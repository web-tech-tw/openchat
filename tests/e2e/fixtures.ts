// Test fixtures for the admin join dashboard e2e suite.
// The data shape mirrors the openchat-join API responses:
// one suspicious cluster of four applications (same zebra / ip /
// device) plus four isolated applications.

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export const CLUSTER_CODES = [
  'aa11bb22',
  'bb22cc33',
  'cc33dd44',
  'dd44ee55',
] as const;

const clusterApplications = [
  {code: CLUSTER_CODES[0], zebraCode: 'zebra-scam-1', roomSlug: 'ai-tw', roomLabel: 'AI 技術社', userAgent, ipAddress: '1.2.3.4', ipGeolocation: {country: 'VN', city: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh'}, createdAt: '2026-10-18T08:01:00.000Z', commitState: null},
  {code: CLUSTER_CODES[1], zebraCode: 'zebra-scam-1', roomSlug: 'web-tw', roomLabel: '網頁技術社', userAgent, ipAddress: '1.2.3.4', ipGeolocation: {country: 'VN', city: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh'}, createdAt: '2026-10-18T08:03:00.000Z', commitState: null},
  {code: CLUSTER_CODES[2], zebraCode: 'zebra-scam-2', roomSlug: 'ai-tw', roomLabel: 'AI 技術社', userAgent, ipAddress: '1.2.3.5', ipGeolocation: {country: 'VN', city: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh'}, createdAt: '2026-10-18T08:05:00.000Z', commitState: null},
  {code: CLUSTER_CODES[3], zebraCode: 'zebra-scam-2', roomSlug: 'devops-tw', roomLabel: 'DevOps 社', userAgent, ipAddress: '1.2.3.6', ipGeolocation: {country: 'VN', city: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh'}, createdAt: '2026-10-18T08:07:00.000Z', commitState: null},
];

const isolatedApplications = [
  {code: 'ee55ff66', zebraCode: 'zebra-ok-1', roomSlug: 'ai-tw', roomLabel: 'AI 技術社', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', ipAddress: '203.0.113.9', ipGeolocation: {country: 'TW', city: 'Taipei', timezone: 'Asia/Taipei'}, createdAt: '2026-10-17T10:00:00.000Z', commitState: true, commitAt: '2026-10-17T12:00:00.000Z', commitBy: '671dc03ae17ad949a20ffbdb'},
  {code: 'ff66aa77', zebraCode: 'zebra-ok-2', roomSlug: 'web-tw', roomLabel: '網頁技術社', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', ipAddress: '198.51.100.7', ipGeolocation: {country: 'TW', city: 'Kaohsiung', timezone: 'Asia/Taipei'}, createdAt: '2026-10-16T09:00:00.000Z', commitState: false, commitAt: '2026-10-16T11:00:00.000Z', commitBy: '671dc03ae17ad949a20ffbdb'},
  {code: '11223344', zebraCode: 'zebra-ok-3', roomSlug: 'ai-tw', roomLabel: 'AI 技術社', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', ipAddress: '192.0.2.30', ipGeolocation: {country: 'TW', city: 'Hsinchu', timezone: 'Asia/Taipei'}, createdAt: '2026-10-15T09:00:00.000Z', commitState: null},
  {code: '55667788', zebraCode: 'zebra-ok-4', roomSlug: 'devops-tw', roomLabel: 'DevOps 社', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36', ipAddress: '203.0.113.77', ipGeolocation: {country: 'TW', city: 'Taichung', timezone: 'Asia/Taipei'}, createdAt: '2026-10-14T09:00:00.000Z', commitState: true, commitAt: '2026-10-14T12:00:00.000Z', commitBy: '671dc03ae17ad949a20ffbdb'},
];

const applications = [...clusterApplications, ...isolatedApplications];

export const listResponse = {
  total: 8,
  stats: {total: 8, pending: 5, approved: 2, rejected: 1},
  limit: 100,
  hasMore: false,
  nextCursor: null,
  applications,
};

const graphNodeOf = (application: any, index: number) => ({
  code: application.code,
  roomSlug: application.roomSlug,
  roomLabel: application.roomLabel,
  zebraCode: application.zebraCode,
  ipAddress: application.ipAddress,
  ipGeolocation: application.ipGeolocation,
  device: 'Windows 10 / Chrome 120',
  createdAt: application.createdAt,
  commitState: application.commitState,
  clusterId: index < 4 ? 0 : index,
  clusterSize: index < 4 ? 4 : 1,
  clusterMultiRoom: index < 4,
  clusterBurst: index < 4,
  riskScore: index < 4 ? 10.5 : 0,
  riskLevel: index < 4 ? 'high' : 'low',
});

export const graphResponse = {
  nodes: applications.map(graphNodeOf),
  edges: [
    {source: CLUSTER_CODES[0], target: CLUSTER_CODES[1], relations: ['zebra', 'ip', 'device'], weight: 6.5},
    {source: CLUSTER_CODES[0], target: CLUSTER_CODES[2], relations: ['subnet', 'device'], weight: 2.5},
    {source: CLUSTER_CODES[0], target: CLUSTER_CODES[3], relations: ['device'], weight: 1.5},
    {source: CLUSTER_CODES[1], target: CLUSTER_CODES[2], relations: ['subnet', 'device'], weight: 2.5},
    {source: CLUSTER_CODES[1], target: CLUSTER_CODES[3], relations: ['device'], weight: 1.5},
    {source: CLUSTER_CODES[2], target: CLUSTER_CODES[3], relations: ['zebra', 'device'], weight: 4.5},
  ],
  clusters: [{
    id: 0,
    size: 4,
    rooms: ['ai-tw', 'web-tw', 'devops-tw'],
    codes: [...CLUSTER_CODES],
    riskLevel: 'high',
    flags: ['multiRoom', 'burst'],
  }],
  stats: {
    total: 8,
    pending: 5,
    approved: 2,
    rejected: 1,
    graphNodes: 8,
    graphEdges: 6,
    graphClusters: 1,
    highRisk: 1,
  },
};

// A fake SARA JWT accepted by useProfile on the client side.
// jwt-decode only parses the payload, the signature is never verified.
export const TEST_TOKEN = (() => {
  const base64url = (data: string) =>
    Buffer.from(data, 'utf8').toString('base64url');
  const header = base64url(JSON.stringify({alg: 'none', typ: 'JWT'}));
  const payload = base64url(JSON.stringify({
    exp: 1893456000,
    user: {nickname: '測試管理員', roles: ['openchat']},
  }));
  return `${header}.${payload}.`;
})();
