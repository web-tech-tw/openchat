<template>
  <div class="min-h-[70vh] bg-gradient-to-b from-sky-50 via-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-7xl mx-auto">
      <!-- Title -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold bg-sky-100 text-sky-800 mb-2 tracking-wide uppercase">
            <UIcon name="i-heroicons-shield-check" class="h-3.5 w-3.5"/>
            管理員專區
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            入群申請儀表板
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            審核申請、檢視 IP、裝置與瀏覽器特徵的關聯分析，辨識重複申請
          </p>
        </div>
        <button
class="inline-flex items-center gap-2 rounded-full bg-sky-500 hover:bg-sky-600 cursor-pointer disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 shadow disabled:opacity-50"
                :disabled="loading"
                @click="load">
          <UIcon :class="loading ? 'animate-spin' : ''" name="i-heroicons-arrow-path" class="h-4 w-4"/>
          重新載入
        </button>
      </div>

      <!-- Loading / access states -->
      <div v-if="!ready" class="text-slate-500 py-20 text-center">
        載入中...
      </div>
      <div v-else-if="!access" class="text-slate-500 py-20 text-center">
        {{ status || "存取遭拒" }}
      </div>

      <template v-else>
        <!-- Stats cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
            <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide">總申請</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">{{ stats?.total ?? 0 }}</p>
          </div>
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
            <p class="text-xs text-amber-600 font-semibold uppercase tracking-wide">待審核</p>
            <p class="mt-1 text-2xl font-bold text-amber-600">{{ stats?.pending ?? 0 }}</p>
          </div>
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
            <p class="text-xs text-emerald-600 font-semibold uppercase tracking-wide">已許可</p>
            <p class="mt-1 text-2xl font-bold text-emerald-600">{{ stats?.approved ?? 0 }}</p>
          </div>
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
            <p class="text-xs text-red-600 font-semibold uppercase tracking-wide">已否決</p>
            <p class="mt-1 text-2xl font-bold text-red-600">{{ stats?.rejected ?? 0 }}</p>
          </div>
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
            <p class="text-xs text-rose-600 font-semibold uppercase tracking-wide">高風險叢集</p>
            <p class="mt-1 text-2xl font-bold text-rose-600">{{ graphStats?.highRisk ?? 0 }}</p>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <div class="inline-flex rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden">
            <button
v-for="option in stateOptions" :key="option.value"
                    :class="stateFilter === option.value ?
                      'bg-sky-500 text-white' :
                      'bg-white text-slate-600 hover:bg-slate-50'"
                    class="px-4 py-1.5 text-sm font-semibold cursor-pointer"
                    @click="stateFilter = option.value">
              {{ option.label }}
            </button>
          </div>
          <select
v-model="roomFilter"
                  class="rounded-full bg-white border border-slate-200 shadow-sm px-4 py-1.5 text-sm text-slate-600">
            <option value="">全部社群</option>
            <option
v-for="room in roomOptions" :key="room.slug" :value="room.slug"
            >{{ room.label }}</option>
          </select>
          <button
v-if="clusterCodes"
              class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 cursor-pointer px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              @click="clusterCodes = null">
            只看叢集（{{ clusterCodes.length }} 筆）
            <UIcon class="h-3.5 w-3.5" name="i-heroicons-x-mark"/>
          </button>
          <div class="flex-1 min-w-[200px] max-w-sm flex rounded-full bg-white shadow-sm border border-slate-200">
            <input
v-model="query"
                   class="w-full bg-transparent px-4 py-1.5 text-sm text-slate-900 outline-none"
                   placeholder="搜尋加入代碼，例如：000000" type="text" @keydown.enter="submitQuery">
          </div>
          <div class="inline-flex rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden">
            <button
:class="viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                    class="px-4 py-1.5 text-sm font-semibold cursor-pointer"
                    @click="viewMode = 'list'">
              列表
            </button>
            <button
:class="viewMode === 'graph' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                    class="px-4 py-1.5 text-sm font-semibold cursor-pointer"
                    @click="viewMode = 'graph'">
              關聯圖
            </button>
          </div>
        </div>

        <!-- List view (virtualized) -->
        <div v-if="viewMode === 'list'" class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <div class="min-w-[900px]">
              <div class="grid grid-cols-[100px_130px_160px_180px_150px_90px_110px] gap-2 px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-400 bg-slate-50/60 border-b border-slate-100">
                <span>代碼</span>
                <span>社群</span>
                <span>申請時間</span>
                <span>IP 位置</span>
                <span>裝置</span>
                <span>狀態</span>
                <span>風險</span>
              </div>
              <div
v-if="!filteredApplications.length"
                   class="flex items-center justify-center h-40 text-sm text-slate-400">
                沒有符合條件的申請
              </div>
              <VList
v-else :data="filteredApplications" :item-size="52"
                      style="height: 540px;"
                      @scroll-end="loadNextPage">
                <template #default="{item}">
                  <div
:class="item.code === selected?.code ?
                        'bg-sky-50' : 'hover:bg-slate-50 border-t border-slate-100'"
                       class="grid grid-cols-[100px_130px_160px_180px_150px_90px_110px] gap-2 px-4 py-3.5 items-center cursor-pointer transition-colors text-sm"
                       @click="selectApplication(item)">
                    <span class="font-mono text-slate-900">{{ item.code }}</span>
                    <span class="truncate">{{ item.roomLabel || item.roomSlug }}</span>
                    <span class="text-xs">{{ formatTime(item.createdAt) }}</span>
                    <span>
                      <span class="block truncate">{{ item.ipAddress }}</span>
                      <span
v-if="item.ipGeolocation?.country"
                            class="block text-xs text-slate-400 truncate">
                        {{ item.ipGeolocation.country }}{{ item.ipGeolocation.city ? '・' + item.ipGeolocation.city : '' }}
                      </span>
                    </span>
                    <span class="text-xs truncate">{{ formatDevice(item) }}</span>
                    <span>
                      <span
:class="stateBadgeClass(item)"
                            class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {{ stateLabel(item) }}
                      </span>
                    </span>
                    <span>
                      <span
:class="riskBadgeClass(riskOf(item.code))"
                            class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {{ riskLabel(riskOf(item.code)) }}
                      </span>
                    </span>
                  </div>
                </template>
              </VList>
            </div>
          </div>
          <div class="flex items-center justify-between px-4 py-2 border-t border-slate-100 text-xs text-slate-400">
            <span>已載入 {{ filteredApplications.length }} / {{ listTotal }} 筆</span>
            <span v-if="loadingMore">載入中…</span>
            <span v-else-if="!nextCursor">已載入全部</span>
            <span v-else>捲動到底自動載入更多</span>
          </div>
        </div>

        <!-- Graph view -->
        <AdminJoinGraph
v-else :edges="graphEdges" :nodes="graphNodes" :selected-code="selected?.code || null"
                         @inspect="inspectCluster"
                         @select="selectByCode"/>

        <!-- Detail modal -->
        <UModal :open="detailOpen" :ui="{content: 'max-w-2xl'}" @update:open="(open: boolean) => open ? (detailOpen = true) : closeDetail()">
          <template #header="{ close }">
            <div v-if="selectedLoading" class="flex-1 min-w-0 space-y-2">
              <USkeleton class="h-5 w-40"/>
              <USkeleton class="h-3.5 w-56"/>
            </div>
            <div v-else class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-slate-800">
                加入代碼：<span class="font-mono">{{ selected?.code }}</span>
              </h2>
              <p class="mt-0.5 text-sm text-slate-500">{{ selected?.roomLabel || selected?.roomSlug }}</p>
              <p class="mt-0.5 text-sm text-slate-500">申請時間：{{ formatTime(selected?.createdAt) }}</p>
            </div>
            <UButton
aria-label="關閉"
                    class="cursor-pointer"
                    color="neutral"
                    icon="i-heroicons-x-mark"
                    variant="ghost"
                    @click="close"/>
          </template>

          <template #body>
            <div v-if="selectedLoading" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="column in 2" :key="column" class="space-y-2.5">
                  <USkeleton class="h-4 w-24"/>
                  <USkeleton class="h-3.5 w-full"/>
                  <USkeleton class="h-3.5 w-5/6"/>
                  <USkeleton class="h-3.5 w-2/3"/>
                  <USkeleton class="h-3.5 w-3/4"/>
                </div>
              </div>
              <div class="pt-5 border-t border-slate-100 space-y-3">
                <USkeleton class="h-4 w-48"/>
                <div class="flex flex-wrap gap-2">
                  <USkeleton v-for="chip in 3" :key="chip" class="h-7 w-28 !rounded-full"/>
                </div>
              </div>
            </div>

            <template v-else>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
                <div>
                  <h3 class="font-semibold text-slate-700 mb-2">網路資訊</h3>
                  <ul class="space-y-1">
                    <li class="break-all">IP 位址：<span class="font-mono">{{ selected?.ipAddress }}</span></li>
                    <li class="break-all">IP 網段：<span class="font-mono">{{ subnetOf(selected?.ipAddress || '') }}</span></li>
                    <li>國家：{{ selected?.ipGeolocation?.country || '未知' }}</li>
                    <li>城市：{{ selected?.ipGeolocation?.city || '未知' }}</li>
                    <li>時區：{{ selected?.ipGeolocation?.timezone || '未知' }}</li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-700 mb-2">裝置與識別</h3>
                  <ul class="space-y-1">
                    <li>作業系統：{{ uaParsed.os?.name }} {{ uaParsed.os?.version }}</li>
                    <li>瀏覽器：{{ uaParsed.browser?.name }} {{ uaParsed.browser?.version }}</li>
                    <li>瀏覽器辨識碼：<span class="font-mono text-xs">{{ selected?.zebraCode }}</span></li>
                    <li class="break-all">
                      使用者代理：
                      <code class="text-xs bg-slate-100 rounded px-1.5 py-0.5">{{ selected?.userAgent }}</code>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Cluster analysis -->
              <div v-if="relatedApplications.length > 1" class="mt-5 pt-5 border-t border-slate-100">
                <h3 class="font-semibold text-slate-700 mb-2">
                  關聯申請（疑似同人申請，共 {{ relatedApplications.length }} 筆）
                </h3>
                <div class="rounded-xl border border-slate-100 overflow-hidden">
                  <div class="overflow-x-auto">
                    <div class="min-w-[600px]">
                      <div class="grid grid-cols-[32px_92px_minmax(70px,1fr)_148px_minmax(170px,1.4fr)_minmax(64px,auto)] gap-2 px-3 py-2 bg-slate-50/60 text-xs text-slate-400">
                        <span>#</span>
                        <span>代碼</span>
                        <span>社群</span>
                        <span>申請時間</span>
                        <span>裝置</span>
                        <span>與此申請的關係</span>
                      </div>
                      <div class="divide-y divide-slate-100">
                        <button
v-for="(related, index) in relatedApplications" :key="related.code"
                                :class="related.isSelf ?
                                  'bg-sky-50' : 'hover:bg-slate-50 cursor-pointer'"
                                class="grid w-full text-left grid-cols-[32px_92px_minmax(70px,1fr)_148px_minmax(170px,1.4fr)_minmax(64px,auto)] gap-2 px-3 py-2 items-center text-sm transition-colors"
                                @click="selectByCode(related.code)">
                          <span class="text-xs text-slate-400 font-mono">{{ index + 1 }}</span>
                          <span class="font-mono text-xs text-slate-800">{{ related.code }}</span>
                          <span class="text-xs text-slate-500 truncate">{{ related.roomLabel || '—' }}</span>
                          <span class="text-xs text-slate-500 truncate">{{ related.createdAt ? formatTime(related.createdAt) : '—' }}</span>
                          <span class="text-xs text-slate-500 truncate">{{ related.device || '—' }}</span>
                          <span class="text-xs text-rose-600 truncate">
                            {{ related.isSelf ? '—' : related.relations.length ? related.relations.join('、') : '同叢集' }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-xs text-slate-400">
                  排序固定依代碼，切換時位置不變；關聯依據：瀏覽器辨識碼、IP、網段；裝置特徵僅在同 IP 或同瀏覽器辨識碼時作為補強
                </p>
              </div>
            </template>
          </template>

          <template #footer>
            <div v-if="selectedLoading" class="w-full flex justify-end gap-2">
              <USkeleton class="h-9 w-20 !rounded-full"/>
              <USkeleton class="h-9 w-20 !rounded-full"/>
            </div>
            <div
v-else-if="selected?.commitBy === null || selected?.commitBy === undefined"
                 class="w-full flex justify-end gap-2">
              <button
class="rounded-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white text-sm font-bold px-5 py-2"
                      @click="commit(true)">
                許可
              </button>
              <button
class="rounded-full bg-red-500 hover:bg-red-600 cursor-pointer text-white text-sm font-bold px-5 py-2"
                      @click="commit(false)">
                否決
              </button>
            </div>
            <p v-else class="w-full text-right text-sm text-amber-600">
              已由 {{ commitNickname || selected?.commitBy }} 於 {{ formatTime(selected?.commitAt) }} 簽署
              {{ selected?.commitState ? '許可' : '否決' }}
            </p>
          </template>
        </UModal>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import uaParser from 'ua-parser-js';
import {VList} from 'virtua/vue';
import dayjs from 'dayjs';

const config = useRuntimeConfig();
const api = useApi();

const access = ref(false);
const ready = ref(false);
const loading = ref(false);
const status = ref<string | null>(null);
const query = ref('');
const stateFilter = ref('all');
const roomFilter = ref('');
const viewMode = ref('list');

const applications = ref<any[]>([]);
const stats = ref<Record<string, number> | null>(null);
const graphNodes = ref<any[]>([]);
const graphEdges = ref<any[]>([]);
const graphStats = ref<Record<string, number> | null>(null);

const selected = ref<any>(null);
const commitNickname = ref<string | null>(null);
const selectedLoading = ref(false);
const detailOpen = ref(false);

const closeDetail = () => {
  detailOpen.value = false;
  selected.value = null;
  commitNickname.value = null;
  selectedLoading.value = false;
};

interface StateOption {
  value: string;
  label: string;
}

const stateOptions: StateOption[] = [
  {value: 'all', label: '全部'},
  {value: 'pending', label: '待審核'},
  {value: 'approved', label: '已許可'},
  {value: 'rejected', label: '已否決'},
];

const formatTime = (time: string | null) => {
  if (!time) return '未知';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

const subnetOf = (ipAddress: string) => {
  if (/^[0-9.]+$/.test(ipAddress)) {
    return ipAddress.split('.').slice(0, 3).join('.') + '.x';
  }
  return ipAddress;
};

const formatDevice = (application: any) => {
  const {os, browser} = uaParser(application.userAgent);
  return `${os?.name || '?'} / ${browser?.name || '?'}`;
};

const roomOptions = ref<{slug: string; label: string}[]>([]);
const nextCursor = ref<string | null>(null);
const loadingMore = ref(false);
const listTotal = ref(0);
const clusterCodes = ref<string[] | null>(null);

const inspectCluster = (codes: string[]) => {
  clusterCodes.value = codes;
  viewMode.value = 'list';
};

const listSearchParams = (cursor: string | null) => {
  const searchParams: Record<string, string> = {limit: '100'};
  if (cursor) {
    searchParams.cursor = cursor;
  }
  if (clusterCodes.value) {
    // The cluster drill-down comes from the graph, which ignores the
    // state and room filters, so the list must not apply them either
    searchParams.codes = clusterCodes.value.join(',');
    return searchParams;
  }
  if (stateFilter.value !== 'all') {
    searchParams.state = stateFilter.value;
  }
  if (roomFilter.value) {
    searchParams.room = roomFilter.value;
  }
  return searchParams;
};

const loadListPage = async (cursor: string | null) => {
  const response = await api?.get('applications/list', {
    searchParams: listSearchParams(cursor),
  }).json<any>();
  const page = response?.applications || [];
  if (cursor) {
    applications.value = [...applications.value, ...page];
  } else {
    applications.value = page;
    if (selected.value?.code) {
      const refreshed = applications.value.find(
          (application) => application.code === selected.value.code,
      );
      if (refreshed) {
        selected.value = refreshed;
      }
    }
  }
  stats.value = response?.stats || null;
  listTotal.value = response?.total ?? 0;
  nextCursor.value = response?.nextCursor || null;

  // Accumulate the room options across pages
  const optionMap = new Map(roomOptions.value.map((room) => [room.slug, room]));
  for (const application of page) {
    if (!optionMap.has(application.roomSlug)) {
      optionMap.set(application.roomSlug, {
        slug: application.roomSlug,
        label: application.roomLabel || application.roomSlug,
      });
    }
  }
  roomOptions.value = [...optionMap.values()].
      sort((a, b) => a.label.localeCompare(b.label));
};

const loadNextPage = async () => {
  if (!api || !nextCursor.value || loadingMore.value) return;
  loadingMore.value = true;
  try {
    await loadListPage(nextCursor.value);
  } catch (e) {
    console.error(e);
  } finally {
    loadingMore.value = false;
  }
};

const resetList = async () => {
  nextCursor.value = null;
  try {
    await loadListPage(null);
  } catch (e) {
    status.value = '載入資料失敗';
    console.error(e);
  }
};

const loadGraph = async () => {
  const response = await api?.get('applications/graph', {
    searchParams: {limit: 500},
  }).json<any>();
  graphNodes.value = response?.nodes || [];
  graphEdges.value = response?.edges || [];
  graphStats.value = response?.stats || null;
};

const load = async () => {
  if (!api) return;
  loading.value = true;
  status.value = null;
  try {
    await Promise.all([resetList(), loadGraph()]);
  } catch (e: any) {
    status.value = '載入資料失敗';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch([stateFilter, roomFilter, clusterCodes], () => {
  if (access.value) {
    resetList();
  }
});

const filteredApplications = computed(() => {
  const keyword = query.value.trim();
  if (!keyword) return applications.value;
  return applications.value.filter((application) => application.code.includes(keyword));
});

const riskOf = (code: string) => {
  const node = graphNodes.value.find((graphNode) => graphNode.code === code);
  return node ? {
    riskLevel: node.riskLevel,
    clusterSize: node.clusterSize,
  } : null;
};

const riskLabel = (risk: {riskLevel: string; clusterSize: number} | null) => {
  if (!risk) return '無資料';
  if (risk.clusterSize >= 2) return `叢集 ${risk.clusterSize} 筆`;
  return '獨立';
};

const riskBadgeClass = (risk: {riskLevel: string; clusterSize: number} | null) => {
  if (!risk) return 'bg-slate-100 text-slate-500';
  if (risk.riskLevel === 'high') return 'bg-red-100 text-red-700';
  if (risk.riskLevel === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-500';
};

const stateLabel = (application: any) => {
  if (application.commitState === true) return '已許可';
  if (application.commitState === false) return '已否決';
  return '待審核';
};

const stateBadgeClass = (application: any) => {
  if (application.commitState === true) return 'bg-emerald-100 text-emerald-700';
  if (application.commitState === false) return 'bg-red-100 text-red-700';
  return 'bg-amber-100 text-amber-700';
};

const relatedApplications = computed(() => {
  const selfCode = selected.value?.code;
  if (!selfCode) return [];

  // Collect the relations between each member and the selected application
  const relations = new Map<string, string[]>();
  for (const edge of graphEdges.value) {
    if (edge.source !== selfCode && edge.target !== selfCode) continue;
    const other = edge.source === selfCode ? edge.target : edge.source;
    if (other === selfCode) continue;
    relations.set(other, [
      ...new Set([...(relations.get(other) || []), ...edge.relations]),
    ]);
  }

  // List the whole cluster (including the selected one), fallback to
  // the direct neighbours when the selected one is missing from the graph
  const selfNode = graphNodes.value.find((node) => node.code === selfCode);
  const members = selfNode ?
    graphNodes.value.filter((node) => node.clusterId === selfNode.clusterId) :
    [selfCode, ...relations.keys()].map((code) => ({code}));

  return members.
      map((member) => ({
        code: member.code,
        roomLabel: member.roomLabel || '',
        device: member.device || '',
        createdAt: member.createdAt || null,
        isSelf: member.code === selfCode,
        relations: member.code === selfCode ? [] : relations.get(member.code) || [],
      })).
      sort((a, b) => a.code.localeCompare(b.code));
});

const getUserNickname = async (userId: string) => {
  try {
    const response = await $fetch<any>(`https://web-tech.tw/recv/sara/users/${userId}`);
    return response?.profile?.nickname || userId;
  } catch {
    return userId;
  }
};

const selectApplication = async (application: any) => {
  selected.value = application;
  detailOpen.value = true;
  commitNickname.value = null;
  if (application.commitBy) {
    commitNickname.value = await getUserNickname(application.commitBy);
  }
};

const selectByCode = async (code: string) => {
  const local = applications.value.find(
      (application) => application.code === code,
  );
  if (local) {
    await selectApplication(local);
    return;
  }
  // Fallback: fetch the code directly from the backend
  selectedLoading.value = true;
  detailOpen.value = true;
  try {
    const response = await api?.get('applications', {
      searchParams: {code},
    }).json<any>();
    if (response?.code) {
      await selectApplication(response);
    }
  } catch (e: any) {
    closeDetail();
    if (e?.response?.status === 404) {
      status.value = '加入代碼不存在';
    } else {
      status.value = '發生嚴重錯誤';
    }
  } finally {
    selectedLoading.value = false;
  }
};

const submitQuery = async () => {
  const keyword = query.value.trim();
  if (!keyword) return;
  if (filteredApplications.value.length) {
    await selectApplication(filteredApplications.value[0]);
    return;
  }
  await selectByCode(keyword);
};

const commit = async (state: boolean) => {
  if (!selected.value?.code) return;
  try {
    await api?.patch('applications', {
      searchParams: {
        code: selected.value.code,
        state: String(state),
      },
    });
    await load();
  } catch (e) {
    console.error(e);
  }
};

const uaParsed = computed(() => {
  const {userAgent: uaString} = selected.value || {};
  return uaParser(uaString);
});

onMounted(() => {
  if (import.meta.client) {
    const profile = useProfile();

    if (!profile) {
      const refer = `${config.public.selfHost}/#/admin/join`;
      const redirectUrl = `${config.public.saraInteHost}/?refer=${encodeURIComponent(refer)}`;
      location.assign(redirectUrl);
      return;
    }

    if (
      Array.isArray(profile?.roles) &&
      profile.roles.includes('openchat')
    ) {
      access.value = true;
      load();
    } else {
      console.warn('Forbidden');
    }
    ready.value = true;
  }
});
</script>
