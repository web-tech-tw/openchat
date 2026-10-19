<template>
  <div class="space-y-2">
    <!-- Compact legend & controls -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full" style="background:#94a3b8"/>
          低風險
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full" style="background:#f59e0b"/>
          中風險
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full" style="background:#e11d48"/>
          高風險
        </span>
        <span class="text-slate-400">線越粗＝關聯越強，hover 節點與連線看關係細節</span>
      </div>
      <div class="flex items-center gap-2">
        <button
class="inline-flex items-center gap-1.5 cursor-pointer rounded-full border px-3 py-1 font-semibold transition-colors"
                :class="showIsolated ?
                  'bg-slate-900 text-white border-slate-900' :
                  'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'"
                :disabled="!isolatedCount"
                @click="showIsolated = !showIsolated">
          含獨立申請
          <span class="font-mono">{{ isolatedCount }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
      <!-- Triage panel -->
      <div class="flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden max-h-[688px]">
        <!-- Overview: ranked suspicious clusters -->
        <template v-if="mode === 'overview'">
          <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span class="text-sm font-bold text-slate-700">疑似集團排行</span>
            <span class="text-xs text-slate-400">{{ rankedClusters.length }} 群</span>
          </div>
          <div class="overflow-y-auto flex-1 divide-y divide-slate-100">
            <button
v-for="(cluster, index) in rankedClusters" :key="cluster.id"
                    class="block w-full text-left px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    @click="enterCluster(cluster.id)">
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm font-bold text-slate-700">
                  #{{ index + 1 }}
                  <span class="font-mono">{{ cluster.size }}</span> 筆
                </span>
                <span
class="text-xs font-semibold"
                      :style="{color: riskColor(cluster.riskLevel)}">
                  {{ riskText(cluster.riskLevel) }}風險
                </span>
              </div>
              <p class="mt-0.5 text-xs text-slate-500 truncate">
                {{ cluster.rooms.join('、') }}
              </p>
              <div class="mt-1 flex items-center gap-2 text-xs">
                <span
v-if="cluster.multiRoom"
                      class="rounded-full bg-rose-50 text-rose-600 px-2 py-0.5">跨社群</span>
                <span
v-if="cluster.burst"
                      class="rounded-full bg-amber-50 text-amber-600 px-2 py-0.5">短時間密集</span>
              </div>
              <div class="mt-2 h-1 rounded-full bg-slate-100">
                <div
class="h-1 rounded-full"
                     :style="{
                       width: `${Math.min(cluster.riskScore / maxRiskScore * 100, 100)}%`,
                       background: riskColor(cluster.riskLevel),
                     }"/>
              </div>
            </button>
            <div
v-if="!rankedClusters.length"
                 class="px-4 py-10 text-center text-xs text-slate-400">
              沒有偵測到疑似集團
            </div>
            <button
v-if="isolatedCount"
                    class="block w-full text-left px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    @click="showIsolated = !showIsolated">
              <span class="text-sm text-slate-500">
                獨立申請
                <span class="font-mono">{{ isolatedCount }}</span> 筆
                <span class="text-xs text-slate-400">
                  （{{ showIsolated ? '點擊隱藏於圖中' : '點擊顯示於圖中' }}）
                </span>
              </span>
            </button>
          </div>
        </template>

        <!-- Cluster mode: investigation panel -->
        <template v-else>
          <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <button
class="inline-flex items-center gap-1.5 cursor-pointer text-sm font-semibold text-slate-600 hover:text-slate-900"
                    @click="backToOverview">
              <UIcon class="h-4 w-4" name="i-heroicons-arrow-left"/>
              返回排行
            </button>
          </div>
          <div class="px-4 py-3 border-b border-slate-100">
            <p class="text-sm font-bold text-slate-700">
              叢集（<span class="font-mono">{{ activeClusterSize }}</span> 筆）
            </p>
            <p class="mt-0.5 text-xs text-slate-500 truncate">{{ activeClusterRooms }}</p>
            <div class="mt-1.5 flex items-center gap-2 text-xs">
              <span
v-if="activeClusterFlags.multiRoom"
                    class="rounded-full bg-rose-50 text-rose-600 px-2 py-0.5">跨社群</span>
              <span
v-if="activeClusterFlags.burst"
                    class="rounded-full bg-amber-50 text-amber-600 px-2 py-0.5">短時間密集</span>
              <span
class="rounded-full px-2 py-0.5"
                    :style="{background: riskColor(activeClusterFlags.riskLevel) + '1a',
                             color: riskColor(activeClusterFlags.riskLevel)}">
                {{ riskText(activeClusterFlags.riskLevel) }}風險
              </span>
            </div>
            <button
class="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 cursor-pointer text-white text-xs font-bold px-3 py-2"
                    @click="inspectActiveCluster">
              <UIcon class="h-3.5 w-3.5" name="i-heroicons-list-bullet"/>
              在列表只看此叢集
            </button>
          </div>
          <div class="overflow-y-auto flex-1 divide-y divide-slate-100">
            <button
v-for="member in activeClusterMembers" :key="member.code"
                    class="block w-full text-left px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                    @click="emit('select', member.code)">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-sm text-slate-800">{{ member.code }}</span>
                <span class="text-xs text-slate-400 truncate">{{ member.roomLabel }}</span>
              </div>
              <p class="mt-0.5 text-xs text-slate-400 truncate">{{ member.device }}</p>
            </button>
          </div>
        </template>
      </div>

      <!-- Graph canvas -->
      <div class="relative rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <div
v-if="mode === 'cluster'"
             class="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span class="rounded-full bg-slate-900/85 text-white px-3 py-1.5 text-xs font-semibold">
            叢集成員（{{ activeClusterSize }} 筆）
          </span>
        </div>
        <button
aria-label="重設縮放"
                class="absolute top-3 right-3 z-10 rounded-full bg-white/95 border border-slate-200 shadow-sm cursor-pointer h-8 w-8 text-slate-600 hover:bg-slate-50"
                @click="resetView">
          <UIcon class="h-4 w-4" name="i-heroicons-arrow-path"/>
        </button>
        <div
v-if="!nodes.length"
             class="flex items-center justify-center h-64 text-sm text-slate-400">
          沒有可分析的申請資料
        </div>
        <div
v-show="nodes.length"
             ref="chartEl"
             class="w-full"
             style="height: 640px;"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import * as echarts from 'echarts/core';
import {GraphChart} from 'echarts/charts';
import {TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

export interface AdminJoinGraphNode {
  code: string;
  roomLabel: string;
  zebraCode: string;
  ipAddress: string;
  ipGeolocation?: Record<string, unknown> | null;
  device: string;
  createdAt: string;
  commitState?: boolean | null;
  clusterId: number;
  clusterSize: number;
  clusterMultiRoom?: boolean;
  clusterBurst?: boolean;
  riskScore: number;
  riskLevel: string;
}

export interface AdminJoinGraphEdge {
  source: string;
  target: string;
  relations: string[];
  weight: number;
}

echarts.use([GraphChart, TooltipComponent, CanvasRenderer]);

const props = defineProps<{
  nodes: AdminJoinGraphNode[];
  edges: AdminJoinGraphEdge[];
  selectedCode: string | null;
}>();

const emit = defineEmits<{
  select: [code: string];
  inspect: [codes: string[]];
}>();

const mode = ref<'overview' | 'cluster'>('overview');
const activeClusterId = ref<number | null>(null);
const showIsolated = ref(false);
const chartEl = ref<HTMLDivElement | null>(null);

let chart: echarts.EChartsType | null = null;

const RISK_COLORS: Record<string, string> = {
  high: '#e11d48',
  medium: '#f59e0b',
  low: '#94a3b8',
};
const EDGE_COLOR = '#cbd5e1';

const riskColor = (riskLevel: string) => RISK_COLORS[riskLevel] || RISK_COLORS.low;
const riskText = (riskLevel: string) => riskLevel === 'high' ? '高' : riskLevel === 'medium' ? '中' : '低';

interface ClusterInfo {
  id: number;
  size: number;
  riskScore: number;
  riskLevel: string;
  multiRoom: boolean;
  burst: boolean;
  rooms: string[];
  codes: string[];
}

const clusters = computed<ClusterInfo[]>(() => {
  const map = new Map<number, AdminJoinGraphNode[]>();
  for (const node of props.nodes) {
    if (!map.has(node.clusterId)) map.set(node.clusterId, []);
    map.get(node.clusterId)?.push(node);
  }
  return [...map.entries()].map(([id, members]) => ({
    id,
    size: members.length,
    riskScore: members.reduce((sum, member) => sum + member.riskScore, 0),
    riskLevel: members[0].riskLevel,
    multiRoom: members[0].clusterMultiRoom ?? false,
    burst: members[0].clusterBurst ?? false,
    rooms: [...new Set(members.map((member) => member.roomLabel))],
    codes: members.map((member) => member.code),
  }));
});

const rankedClusters = computed(() => clusters.value.
    filter((cluster) => cluster.size >= 2).
    sort((a, b) => b.riskScore - a.riskScore || b.size - a.size));

const isolatedCount = computed(() =>
  clusters.value.filter((cluster) => cluster.size === 1).length,
);

const maxRiskScore = computed(() =>
  Math.max(...rankedClusters.value.map((cluster) => cluster.riskScore), 1),
);

const activeClusterMembers = computed(() =>
  props.nodes.filter((node) => node.clusterId === activeClusterId.value),
);

const activeClusterSize = computed(() => activeClusterMembers.value.length);

const activeClusterRooms = computed(() => {
  const cluster = clusters.value.find((c) => c.id === activeClusterId.value);
  return cluster?.rooms.join('、') || '';
});

const activeClusterFlags = computed(() => {
  const cluster = clusters.value.find((c) => c.id === activeClusterId.value);
  return {
    multiRoom: cluster?.multiRoom ?? false,
    burst: cluster?.burst ?? false,
    riskLevel: cluster?.riskLevel || 'low',
  };
});

const enterCluster = (clusterId: number) => {
  activeClusterId.value = clusterId;
  mode.value = 'cluster';
};

const backToOverview = () => {
  mode.value = 'overview';
  activeClusterId.value = null;
};

const inspectActiveCluster = () => {
  const cluster = clusters.value.find((c) => c.id === activeClusterId.value);
  if (cluster) {
    emit('inspect', cluster.codes);
  }
};

const resetView = () => {
  refreshOption();
};

const buildTooltip = (params: any) => {
  if (params.dataType === 'edge') {
    const data = params.data;
    const relations = data.relations?.length ? `：${data.relations.join('、')}` : '';
    return `<b>${data.sourceName} ↔ ${data.targetName}</b>${relations}（權重 ${data.weight}）`;
  }
  if (params.dataType !== 'node') return '';

  const data = params.data;
  if (data.kind === 'cluster') {
    const flags = [
      data.multiRoom ? '跨社群' : '',
      data.burst ? '短時間密集' : '',
    ].filter(Boolean).join('｜');
    return [
      `<b>叢集（${data.size} 筆申請）</b>`,
      `社群：${data.rooms.join('、')}`,
      `風險：${riskText(data.riskLevel)}${flags ? '｜' + flags : ''}`,
      '點擊展開叢集成員',
    ].join('<br/>');
  }

  const node = props.nodes.find((candidate) => candidate.code === data.code);
  if (!node) return '';
  const geo = node.ipGeolocation as Record<string, string> | null | undefined;
  const flags = [
    node.clusterMultiRoom ? '跨社群' : '',
    node.clusterBurst ? '短時間密集' : '',
  ].filter(Boolean).join('｜');
  return [
    `<b>${node.roomLabel}</b>`,
    `代碼：${node.code}`,
    `IP：${node.ipAddress}（${geo?.country || '未知'}${geo?.city ? ' ' + geo.city : ''}）`,
    `裝置：${node.device}`,
    `風險：${riskText(node.riskLevel)}｜叢集 ${node.clusterSize} 筆${flags ? '｜' + flags : ''}`,
  ].join('<br/>');
};

const buildOption = (): any => {
  const isClusterMode = mode.value === 'cluster';
  let data: any[] = [];
  let links: any[] = [];

  if (isClusterMode) {
    data = activeClusterMembers.value.map((node) => ({
      id: node.code,
      name: node.code,
      kind: 'node',
      code: node.code,
      symbolSize: 2 * (5 + Math.min(node.clusterSize - 1, 8)),
      itemStyle: {
        color: riskColor(node.riskLevel),
        borderColor: node.code === props.selectedCode ? '#0f172a' : '#ffffff',
        borderWidth: node.code === props.selectedCode ? 3 : 2,
      },
      label: {
        show: true,
        position: 'right',
        color: node.code === props.selectedCode ? '#0f172a' : '#64748b',
        fontSize: 10,
      },
    }));
    const memberCodes = new Set(activeClusterMembers.value.map((member) => member.code));
    links = props.edges.
        filter((edge) => memberCodes.has(edge.source) && memberCodes.has(edge.target)).
        map((edge) => ({
          source: edge.source,
          target: edge.target,
          sourceName: edge.source,
          targetName: edge.target,
          relations: edge.relations,
          weight: edge.weight,
          lineStyle: {
            color: EDGE_COLOR,
            width: Math.min(1 + edge.weight * 0.4, 5),
            opacity: 0.45,
          },
        }));
  } else {
    data = clusters.value.flatMap((cluster) => {
      if (cluster.size >= 2) {
        return [{
          id: `cluster-${cluster.id}`,
          name: `cluster-${cluster.id}`,
          kind: 'cluster',
          clusterId: cluster.id,
          size: cluster.size,
          riskLevel: cluster.riskLevel,
          multiRoom: cluster.multiRoom,
          burst: cluster.burst,
          rooms: cluster.rooms,
          symbolSize: 2 * (12 + Math.min(cluster.size * 2.5, 26)),
          itemStyle: {
            color: riskColor(cluster.riskLevel),
            borderColor: cluster.id === activeClusterId.value ? '#0f172a' : '#ffffff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'inside',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 'bold',
          },
        }];
      }
      if (!showIsolated.value) return [];
      const node = props.nodes.find((candidate) => candidate.clusterId === cluster.id)!;
      return [{
        id: node.code,
        name: node.code,
        kind: 'single',
        code: node.code,
        symbolSize: 10,
        itemStyle: {
          color: riskColor(node.riskLevel),
          borderColor: node.code === props.selectedCode ? '#0f172a' : '#ffffff',
          borderWidth: node.code === props.selectedCode ? 3 : 2,
        },
        label: {
          show: true,
          position: 'right',
          color: '#64748b',
          fontSize: 10,
        },
      }];
    });

    // Aggregate the edges between clusters
    const codeToCluster = new Map(props.nodes.map((node) => [node.code, node.clusterId]));
    const keyOfCluster = (clusterId: number) => {
      const cluster = clusters.value.find((c) => c.id === clusterId);
      if (!cluster) return '';
      return cluster.size >= 2 ? `cluster-${clusterId}` : cluster.codes[0] || '';
    };
    const linkMap = new Map<string, any>();
    for (const edge of props.edges) {
      const sourceCluster = codeToCluster.get(edge.source);
      const targetCluster = codeToCluster.get(edge.target);
      if (sourceCluster === undefined || targetCluster === undefined) continue;
      if (sourceCluster === targetCluster) continue;
      const sourceKey = keyOfCluster(sourceCluster);
      const targetKey = keyOfCluster(targetCluster);
      if (!sourceKey || !targetKey) continue;
      const pairKey = `${sourceKey}-${targetKey}`;
      if (!linkMap.has(pairKey)) {
        linkMap.set(pairKey, {
          source: sourceKey,
          target: targetKey,
          sourceName: sourceKey,
          targetName: targetKey,
          relations: [],
          weight: 0,
        });
      }
      const link = linkMap.get(pairKey)!;
      link.relations = [...new Set([...link.relations, ...edge.relations])];
      link.weight += edge.weight;
    }
    links = [...linkMap.values()].map((link) => ({
      ...link,
      lineStyle: {
        color: EDGE_COLOR,
        width: Math.min(1 + link.weight * 0.2, 4),
        opacity: 0.35,
      },
    }));
  }

  return {
    tooltip: {
      trigger: 'item',
      formatter: buildTooltip,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderWidth: 0,
      textStyle: {color: '#ffffff', fontSize: 12},
    },
    series: [{
      id: 'graph',
      type: 'graph',
      layout: 'force',
      roam: true,
      force: {
        repulsion: isClusterMode ? 500 : 2000,
        edgeLength: isClusterMode ? 90 : [100, 220],
        gravity: 0.1,
      },
      label: {show: true},
      emphasis: {focus: 'adjacency'},
      data,
      links,
    }],
  };
};

const refreshOption = () => {
  if (!chart) return;
  chart.setOption(buildOption(), {notMerge: true});
};

const onChartClick = (params: any) => {
  if (params.dataType !== 'node') return;
  if (params.data.kind === 'cluster') {
    enterCluster(params.data.clusterId);
    return;
  }
  if (params.data.code) {
    emit('select', params.data.code);
  }
};

const resizeHandler = () => chart?.resize();

onMounted(() => {
  if (!chartEl.value) return;
  chart = echarts.init(chartEl.value, undefined, {renderer: 'canvas'});
  chart.on('click', onChartClick);
  chart.getZr().on('mousemove', (event: any) => {
    const target = event.target;
    if (target && (target.dataType === 'node' || target.dataType === 'edge')) {
      chart?.getZr().setCursorStyle('pointer');
    } else {
      chart?.getZr().setCursorStyle('default');
    }
  });
  refreshOption();
  window.addEventListener('resize', resizeHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler);
  chart?.dispose();
  chart = null;
});

watch(() => [props.nodes, props.edges], () => {
  if (mode.value === 'cluster') {
    // Back to overview when the active cluster is gone after data refresh
    if (!props.nodes.some((node) => node.clusterId === activeClusterId.value)) {
      backToOverview();
      return;
    }
  }
  refreshOption();
});

watch(() => props.selectedCode, refreshOption);

watch([mode, activeClusterId], refreshOption);

watch(showIsolated, refreshOption);
</script>
