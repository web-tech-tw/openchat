import {afterAll, beforeAll, expect, test} from 'vitest';
import {chromium, type Browser, type Page} from 'playwright';
import {spawn, type ChildProcess} from 'node:child_process';
import {CLUSTER_CODES, TEST_TOKEN, graphResponse, listResponse} from './fixtures';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess: ChildProcess | null = null;
let browser: Browser | null = null;
const listRequests: string[] = [];

const waitForServer = async (timeoutMs = 120_000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) return;
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`dev server not ready at ${BASE_URL}`);
};

beforeAll(async () => {
  serverProcess = spawn('bun', ['run', 'dev'], {
    cwd: process.cwd(),
    env: {...process.env, PORT: String(PORT), CI: '1'},
    detached: true,
    stdio: 'ignore',
  });
  serverProcess.unref();
  await waitForServer();
  browser = await chromium.launch({headless: true});
}, 240_000);

afterAll(async () => {
  await browser?.close();
  if (serverProcess?.pid) {
    // Kill the whole process group, otherwise the nuxt children survive
    process.kill(-serverProcess.pid, 'SIGTERM');
  }
});

interface PageOptions {
  withToken?: boolean;
  viewport?: {width: number; height: number};
}

const newPage = async (options: PageOptions = {}): Promise<Page> => {
  const context = await browser!.newContext(
      options.viewport ? {viewport: options.viewport} : undefined,
  );
  await context.route('**/recv/openchat/applications/list*', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(listResponse),
    }),
  );
  await context.route('**/recv/openchat/applications/graph*', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(graphResponse),
    }),
  );
  await context.route('**/recv/sara/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html><body>Sara 登入頁</body></html>',
    }),
  );
  if (options.withToken !== false) {
    await context.addInitScript((token: string) => {
      localStorage.setItem('unified_token', token);
    }, TEST_TOKEN);
  }
  context.on('request', (request) => {
    if (request.url().includes('/applications/list')) {
      listRequests.push(request.url());
    }
  });
  return context.newPage();
};

const gotoDashboard = async (page: Page) => {
  await page.goto(`${BASE_URL}/admin/join`);
  await page.getByText('入群申請儀表板').first().waitFor();
};

const readRelatedRows = (page: Page) => page.evaluate(() => {
  const dialog = document.querySelector('[role=dialog]');
  if (!dialog) return null;
  const header = [...dialog.querySelectorAll('h3')].
      find((h) => h.textContent?.includes('關聯申請'));
  if (!header) return null;
  const container = header.parentElement;
  if (!container) return null;
  const rows = [...container.querySelectorAll('button')];
  return {
    codes: rows.map((row) => row.querySelectorAll('span')[1]?.textContent?.trim()),
    selfHighlighted: rows.findIndex((row) => row.className.includes('bg-sky-50')),
  };
});

test('沒有 token 時轉跳 Sara 登入', async () => {
  const page = await newPage({withToken: false});
  await page.goto(`${BASE_URL}/admin/join`);
  await page.waitForURL(/\/sara\//, {timeout: 15_000});
  expect(page.url()).toContain('/sara/');
  await page.close();
});

test('儀表板載入統計卡與申請列表', async () => {
  const page = await newPage();
  await gotoDashboard(page);
  const totalCardText = await page.getByText('總申請').locator('..').textContent();
  expect(totalCardText).toContain('8');
  await page.getByText('待審核').first().waitFor();
  await page.getByText('已載入 8 / 8 筆').waitFor();
  await page.getByText('bb22cc33').first().waitFor();
  await page.close();
});

test('狀態篩選改為伺服器端過濾', async () => {
  const page = await newPage();
  await gotoDashboard(page);
  const before = listRequests.length;
  await page.getByRole('button', {name: '待審核'}).click();
  await page.waitForTimeout(800);
  const after = listRequests.slice(before);
  expect(after.some((url) => url.includes('state=pending'))).toBe(true);
  await page.close();
});

test('點擊列開啟詳情 Modal，並可用 X 關閉', async () => {
  const page = await newPage();
  await gotoDashboard(page);
  await page.getByText('bb22cc33').first().click();
  const dialog = page.locator('[role=dialog]');
  await dialog.waitFor();
  const dialogText = await dialog.textContent();
  expect(dialogText).toContain('bb22cc33');
  expect(dialogText).toContain('網路資訊');
  await dialog.locator('button[aria-label="關閉"]').click();
  await dialog.waitFor({state: 'detached'});
  await page.close();
});

test('關聯申請列表排序固定且以反藍標記本人', async () => {
  const page = await newPage();
  await gotoDashboard(page);

  // Open a cluster member
  await page.getByText('bb22cc33').first().click();
  await page.locator('[role=dialog]').waitFor();
  let rows = await readRelatedRows(page);
  expect(rows?.codes).toEqual([...CLUSTER_CODES]);
  expect(rows?.codes[rows.selfHighlighted]).toBe('bb22cc33');

  // Switch to another member inside the modal, order must not change
  await page.locator('[role=dialog] button', {hasText: 'dd44ee55'}).click();
  await page.waitForTimeout(600);
  rows = await readRelatedRows(page);
  expect(rows?.codes).toEqual([...CLUSTER_CODES]);
  expect(rows?.codes[rows.selfHighlighted]).toBe('dd44ee55');
  await page.close();
});

test('關聯圖調查動線：排行 → 叢集 → 列表過濾', async () => {
  const page = await newPage();
  await gotoDashboard(page);
  await page.getByRole('button', {name: '關聯圖', exact: true}).click();
  await page.getByText('關聯排行').waitFor();

  // Enter the top ranked cluster from the triage panel
  await page.locator('button', {hasText: '#1'}).first().click();
  await page.getByText('返回排行').waitFor();
  await page.getByText('叢集成員（4 筆）').waitFor();
  for (const code of CLUSTER_CODES) {
    await page.getByText(code).first().waitFor();
  }

  // Inspect the cluster in the list view
  await page.getByRole('button', {name: '在列表只看此叢集'}).click();
  await page.getByText('只看叢集（4 筆）').waitFor();
  const visibleCodes = await page.evaluate(() =>
    [...document.querySelectorAll('span.font-mono')].
        map((el) => el.textContent?.trim()).
        filter((code) => code && /^[0-9a-f]{8}$/.test(code)),
  );
  expect(visibleCodes).toEqual(expect.arrayContaining([...CLUSTER_CODES]));
  expect(visibleCodes).toHaveLength(CLUSTER_CODES.length);

  // Clear the cluster filter chip
  await page.getByRole('button', {name: /只看叢集（4 筆）/}).click();
  await page.getByText('已載入 8 / 8 筆').waitFor();
  await page.close();
});

test('行動版視窗不橫向溢出且 Modal 貼合視區', async () => {
  const page = await newPage({viewport: {width: 390, height: 844}});
  await gotoDashboard(page);
  const pageOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(pageOverflow).toBe(false);

  await page.getByText('bb22cc33').first().click();
  const dialog = page.locator('[role=dialog]');
  await dialog.waitFor();
  const modalFits = await page.evaluate(() => {
    const rect = document.querySelector('[role=dialog]')!.getBoundingClientRect();
    return rect.left >= 0 && rect.right <= window.innerWidth;
  });
  expect(modalFits).toBe(true);
  await dialog.locator('button[aria-label="關閉"]').waitFor();
  await page.close();
});
