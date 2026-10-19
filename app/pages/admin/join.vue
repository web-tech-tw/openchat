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
            審核申請、檢視 IP／裝置／Zebra 關聯分析，辨識重複申請與可疑集團
          </p>
        </div>
        <button
class="inline-flex items-center gap-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 shadow disabled:opacity-50"
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
                    class="px-4 py-1.5 text-sm font-semibold"
                    @click="stateFilter = option.value">
              {{ option.label }}
            </button>
          </div>
          <select
v-model="roomFilter"
                  class="rounded-full bg-white border border-slate-200 shadow-sm px-4 py-1.5 text-sm text-slate-600">
            <option value="">全部社群</option>
            <option v-for="room in roomOptions" :key="room" :value="room">{{ room }}</option>
          </select>
          <div class="flex-1 min-w-[200px] max-w-sm flex rounded-full bg-white shadow-sm border border-slate-200">
            <input
v-model="query"
                   class="w-full bg-transparent px-4 py-1.5 text-sm text-slate-900 outline-none"
                   placeholder="搜尋加入代碼，例如：000000" type="text" @keydown.enter="submitQuery">
          </div>
          <div class="inline-flex rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden">
            <button
:class="viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                    class="px-4 py-1.5 text-sm font-semibold"
                    @click="viewMode = 'list'">
              列表
            </button>
            <button
:class="viewMode === 'graph' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                    class="px-4 py-1.5 text-sm font-semibold"
                    @click="viewMode = 'graph'">
              關聯圖
            </button>
          </div>
        </div>

        <!-- List view -->
        <div v-if="viewMode === 'list'" class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-x-auto">
          <table class="w-full text-sm text-slate-600">
            <thead>
              <tr class="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th class="px-4 py-3">代碼</th>
                <th class="px-4 py-3">社群</th>
                <th class="px-4 py-3">申請時間</th>
                <th class="px-4 py-3">IP 位置</th>
                <th class="px-4 py-3">裝置</th>
                <th class="px-4 py-3">狀態</th>
                <th class="px-4 py-3">風險</th>
              </tr>
            </thead>
            <tbody>
              <tr
v-for="application in filteredApplications" :key="application.code"
                  :class="application.code === selected?.code ?
                    'bg-sky-50' : 'hover:bg-slate-50 border-t border-slate-100'"
                  class="cursor-pointer transition-colors"
                  @click="selectApplication(application)">
                <td class="px-4 py-3 font-mono text-slate-900">{{ application.code }}</td>
                <td class="px-4 py-3">{{ application.roomLabel || application.roomSlug }}</td>
                <td class="px-4 py-3">{{ formatTime(application.createdAt) }}</td>
                <td class="px-4 py-3">
                  {{ application.ipAddress }}
                  <span
v-if="application.ipGeolocation?.country"
                        class="ml-1 text-xs text-slate-400">
                    {{ application.ipGeolocation.country }}{{ application.ipGeolocation.city ? '・' + application.ipGeolocation.city : '' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs">{{ formatDevice(application) }}</td>
                <td class="px-4 py-3">
                  <span
:class="stateBadgeClass(application)"
                        class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {{ stateLabel(application) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
:class="riskBadgeClass(riskOf(application.code))"
                        class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {{ riskLabel(riskOf(application.code)) }}
                  </span>
                </td>
              </tr>
              <tr v-if="!filteredApplications.length">
                <td class="px-4 py-8 text-center text-slate-400" colspan="7">沒有符合條件的申請</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Graph view -->
        <AdminJoinGraph
v-else :edges="graphEdges" :nodes="graphNodes" :selected-code="selected?.code || null"
                         @select="selectByCode"/>

        <!-- Detail panel -->
        <div v-if="selected" class="mt-6 rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 class="text-xl font-bold text-slate-800">
                加入代碼：<span class="font-mono">{{ selected.code }}</span>
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ selected.roomLabel || selected.roomSlug }}｜申請時間：{{ formatTime(selected.createdAt) }}
              </p>
            </div>
            <div v-if="selected.commitBy === null || selected.commitBy === undefined" class="flex gap-2">
              <button
class="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-5 py-2"
                      @click="commit(true)">
                許可
              </button>
              <button
class="rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2"
                      @click="commit(false)">
                否決
              </button>
            </div>
            <p v-else class="text-sm text-amber-600">
              已由 {{ commitNickname || selected.commitBy }} 於 {{ formatTime(selected.commitAt) }} 簽署
              {{ selected.commitState ? '許可' : '否決' }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
            <div>
              <h3 class="font-semibold text-slate-700 mb-2">網路資訊</h3>
              <ul class="space-y-1">
                <li>IP 位址：{{ selected.ipAddress }}</li>
                <li>IP 網段：{{ subnetOf(selected.ipAddress) }}</li>
                <li>國家：{{ selected.ipGeolocation?.country || '未知' }}</li>
                <li>城市：{{ selected.ipGeolocation?.city || '未知' }}</li>
                <li>時區：{{ selected.ipGeolocation?.timezone || '未知' }}</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-slate-700 mb-2">裝置與識別</h3>
              <ul class="space-y-1">
                <li>作業系統：{{ uaParsed.os?.name }} {{ uaParsed.os?.version }}</li>
                <li>瀏覽器：{{ uaParsed.browser?.name }} {{ uaParsed.browser?.version }}</li>
                <li>Zebra 代碼：<span class="font-mono text-xs">{{ selected.zebraCode }}</span></li>
                <li class="break-all">
                  使用者代理：
                  <code class="text-xs bg-slate-100 rounded px-1.5 py-0.5">{{ selected.userAgent }}</code>
                </li>
              </ul>
            </div>
          </div>

          <!-- Cluster analysis -->
          <div v-if="relatedApplications.length" class="mt-5 pt-5 border-t border-slate-100">
            <h3 class="font-semibold text-slate-700 mb-2">
              關聯申請（疑似同一人／集團，共 {{ relatedApplications.length }} 筆）
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
v-for="related in relatedApplications" :key="related.code"
                      class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1 text-xs font-mono text-rose-700"
                      @click="selectByCode(related.code)">
                {{ related.code }}
                <span class="font-sans text-rose-500">{{ related.relations.join('、') }}</span>
              </button>
            </div>
            <p class="mt-2 text-xs text-slate-400">
              關聯依據：Zebra（瀏覽器辨識碼）、IP、網段、裝置指紋；權重越高越可能為同一人
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import uaParser from 'ua-parser-js';
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

const load = async () => {
  if (!api) return;
  loading.value = true;
  status.value = null;
  try {
    const [listResponse, graphResponse] = await Promise.all([
      api.get('applications/list', {
        searchParams: {limit: 200},
      }).json<any>(),
      api.get('applications/graph', {
        searchParams: {limit: 500},
      }).json<any>(),
    ]);
    applications.value = listResponse?.applications || [];
    stats.value = listResponse?.stats || null;
    graphNodes.value = graphResponse?.nodes || [];
    graphEdges.value = graphResponse?.edges || [];
    graphStats.value = graphResponse?.stats || null;
    if (selected.value?.code) {
      const refreshed = applications.value.find(
          (application) => application.code === selected.value.code,
      );
      selected.value = refreshed || selected.value;
    }
  } catch (e: any) {
    status.value = '載入資料失敗';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const filteredApplications = computed(() => {
  return applications.value.filter((application) => {
    if (stateFilter.value === 'pending' && application.commitState !== undefined && application.commitState !== null) {
      return false;
    }
    if (stateFilter.value === 'approved' && application.commitState !== true) {
      return false;
    }
    if (stateFilter.value === 'rejected' && application.commitState !== false) {
      return false;
    }
    if (roomFilter.value && application.roomSlug !== roomFilter.value) {
      return false;
    }
    if (query.value && !application.code.includes(query.value.trim())) {
      return false;
    }
    return true;
  });
});

const roomOptions = computed(() =>
  [...new Set(applications.value.map((application) => application.roomLabel))].sort(),
);

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
  if (!selected.value?.code) return [];
  const codes = new Set<string>();
  const relations = new Map<string, string[]>();
  for (const edge of graphEdges.value) {
    if (edge.source === selected.value.code) {
      codes.add(edge.target);
      relations.set(edge.target, edge.relations);
    } else if (edge.target === selected.value.code) {
      codes.add(edge.source);
      relations.set(edge.source, edge.relations);
    }
  }
  codes.delete(selected.value.code);
  return [...codes].map((code) => ({
    code,
    relations: relations.get(code) || [],
  }));
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
  try {
    const response = await api?.get('applications', {
      searchParams: {code},
    }).json<any>();
    if (response?.code) {
      await selectApplication(response);
    }
  } catch (e: any) {
    if (e?.response?.status === 404) {
      status.value = '加入代碼不存在';
    } else {
      status.value = '發生嚴重錯誤';
    }
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
