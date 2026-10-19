<template>
  <div class="relative w-full">
    <div class="flex flex-wrap gap-3 mb-2 text-xs text-slate-500">
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-3 h-3 rounded-full bg-red-500"/>
        高風險
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-3 h-3 rounded-full bg-amber-400"/>
        中風險
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-3 h-3 rounded-full bg-slate-300"/>
        低風險／獨立
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-5 h-0.5 bg-rose-500"/>
        Zebra 同人
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-5 h-0.5 bg-orange-400"/>
        同 IP
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-5 h-0.5 bg-violet-400"/>
        同裝置（補強）
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-5 h-0.5 bg-teal-400"/>
        同網段
      </span>
      <span class="basis-full text-slate-400">
        滾輪或雙指縮放、拖曳平移；點叢集展開成員，點申請節點查看詳情
      </span>
    </div>
    <div class="relative w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div
v-if="mode === 'cluster'"
           class="absolute top-3 left-3 z-10 flex items-center gap-2">
        <button
class="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-slate-200 shadow-sm cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                @click="backToOverview">
          <UIcon class="h-3.5 w-3.5" name="i-heroicons-arrow-left"/>
          返回總覽
        </button>
        <span class="rounded-full bg-slate-900/85 text-white px-3 py-1.5 text-xs font-semibold">
          叢集 {{ activeClusterId }}（{{ activeClusterSize }} 筆）
        </span>
      </div>
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
}>();

const mode = ref<'overview' | 'cluster'>('overview');
const activeClusterId = ref<number | null>(null);
const chartEl = ref<HTMLDivElement | null>(null);

let chart: echarts.EChartsType | null = null;

const activeClusterSize = computed(() =>
  props.nodes.filter((node) => node.clusterId === activeClusterId.value).length,
);

const colorOfRisk = (riskLevel: string) => {
  if (riskLevel === 'high') return '#ef4444';
  if (riskLevel === 'medium') return '#fbbf24';
  return '#cbd5e1';
};

const colorOfRelation = (relations: string[]) => {
  if (relations.includes('zebra')) return '#f43f5e';
  if (relations.includes('ip')) return '#fb923c';
  if (relations.includes('device')) return '#a78bfa';
  if (relations.includes('subnet')) return '#2dd4bf';
  return '#94a3b8';
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
      `風險：${data.riskLevel}${flags ? '｜' + flags : ''}`,
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
    `風險：${node.riskLevel}｜叢集 ${node.clusterSize} 筆${flags ? '｜' + flags : ''}`,
  ].join('<br/>');
};

const buildOption = (): any => {
  const isClusterMode = mode.value === 'cluster';
  let data: any[] = [];
  let links: any[] = [];

  if (isClusterMode) {
    const members = props.nodes.
        filter((node) => node.clusterId === activeClusterId.value);
    const memberCodes = new Set(members.map((member) => member.code));
    data = members.map((node) => ({
      id: node.code,
      name: node.code,
      kind: 'node',
      code: node.code,
      symbolSize: 2 * (5 + Math.min(node.clusterSize - 1, 8)),
      itemStyle: {
        color: colorOfRisk(node.riskLevel),
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
            color: colorOfRelation(edge.relations),
            width: Math.min(1 + edge.weight * 0.4, 4),
            opacity: Math.min(0.25 + edge.weight * 0.08, 0.8),
          },
        }));
  } else {
    // One item per cluster (or per isolated application)
    const clusters = new Map<number, AdminJoinGraphNode[]>();
    for (const node of props.nodes) {
      if (!clusters.has(node.clusterId)) clusters.set(node.clusterId, []);
      clusters.get(node.clusterId)?.push(node);
    }
    data = [...clusters.entries()].map(([clusterId, members]) => {
      if (members.length >= 2) {
        return {
          id: `cluster-${clusterId}`,
          name: `cluster-${clusterId}`,
          kind: 'cluster',
          clusterId,
          size: members.length,
          riskLevel: members[0].riskLevel,
          multiRoom: members[0].clusterMultiRoom ?? false,
          burst: members[0].clusterBurst ?? false,
          rooms: [...new Set(members.map((member) => member.roomLabel))],
          symbolSize: 2 * (12 + Math.min(members.length * 2.5, 26)),
          itemStyle: {
            color: colorOfRisk(members[0].riskLevel),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'inside',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 'bold',
          },
        };
      }
      const node = members[0];
      return {
        id: node.code,
        name: node.code,
        kind: 'single',
        code: node.code,
        symbolSize: 10,
        itemStyle: {
          color: colorOfRisk(node.riskLevel),
          borderColor: node.code === props.selectedCode ? '#0f172a' : '#ffffff',
          borderWidth: node.code === props.selectedCode ? 3 : 2,
        },
        label: {
          show: true,
          position: 'right',
          color: '#64748b',
          fontSize: 10,
        },
      };
    });

    // Aggregate the edges between clusters
    const codeToCluster = new Map(props.nodes.map((node) => [node.code, node.clusterId]));
    const keyOfCluster = (clusterId: number) => {
      const members = clusters.get(clusterId) || [];
      return members.length >= 2 ? `cluster-${clusterId}` : members[0]?.code || '';
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
        color: '#94a3b8',
        width: Math.min(1 + link.weight * 0.2, 3),
        opacity: 0.4,
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
    activeClusterId.value = params.data.clusterId;
    mode.value = 'cluster';
    return;
  }
  if (params.data.code) {
    emit('select', params.data.code);
  }
};

const backToOverview = () => {
  mode.value = 'overview';
  activeClusterId.value = null;
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
</script>
