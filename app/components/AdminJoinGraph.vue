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
        同裝置
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block w-5 h-0.5 bg-teal-400"/>
        同網段
      </span>
    </div>
    <div class="relative w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
      <svg
          class="w-full block"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 1000 640"
          @mouseleave="hoveredCode = null"
      >
        <g
v-for="edge in renderedEdges" :key="`${edge.source}-${edge.target}-${edge.relations[0]}`"
           :opacity="edgeOpacity(edge)">
          <title>{{ edge.source }} ↔ {{ edge.target }}：{{ edge.relations.join('、') }}（權重 {{ edge.weight }}）</title>
          <line
:stroke="edgeColor(edge)" :stroke-width="edgeWidth(edge)" :x1="edge.x1" :x2="edge.x2"
                :y1="edge.y1" :y2="edge.y2" class="transition-opacity duration-150"/>
        </g>
        <g v-for="node in renderedNodes" :key="node.code">
          <circle
:cx="node.x" :cy="node.y"
                  :fill="nodeColor(node)"
                  :opacity="nodeOpacity(node)"
                  :r="nodeRadius(node)"
                  :stroke="node.code === selectedCode ? '#0f172a' : '#ffffff'"
                  stroke-width="2"
                  class="cursor-pointer transition-all duration-150"
                  @click="$emit('select', node.code)"
                  @mouseenter="hoveredCode = node.code"/>
          <text
v-if="node.code === hoveredCode || node.code === selectedCode || node.clusterSize >= 3"
               :fill="node.code === selectedCode ? '#0f172a' : '#64748b'"
               :font-size="node.code === selectedCode ? 12 : 10"
               :x="node.x" :y="node.y - nodeRadius(node) - 4"
               class="pointer-events-none select-none"
               text-anchor="middle">{{ displayedLabel(node) }}</text>
        </g>
      </svg>
      <div
v-if="hoveredNode"
           :style="tooltipStyle"
           class="absolute z-10 pointer-events-none max-w-xs bg-slate-900/95 text-white text-xs rounded-lg shadow-lg px-3 py-2 space-y-1">
        <p class="font-semibold">{{ hoveredNode.roomLabel }}</p>
        <p>代碼：{{ hoveredNode.code }}</p>
        <p>IP：{{ hoveredNode.ipAddress }}（{{ hoveredNode.ipGeolocation?.country || '未知' }}{{ hoveredNode.ipGeolocation?.city ? ' ' + hoveredNode.ipGeolocation.city : '' }}）</p>
        <p>裝置：{{ hoveredNode.device }}</p>
        <p>
          風險：{{ hoveredNode.riskLevel }}｜叢集 {{ hoveredNode.clusterSize }} 筆
          <span v-if="hoveredNode.clusterMultiRoom">｜跨社群</span>
          <span v-if="hoveredNode.clusterBurst">｜短時間密集</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';

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

const props = defineProps<{
  nodes: AdminJoinGraphNode[];
  edges: AdminJoinGraphEdge[];
  selectedCode: string | null;
}>();

defineEmits<{
  select: [code: string];
}>();

interface LayoutNode extends AdminJoinGraphNode {
  x: number;
  y: number;
}

interface RenderedEdge {
  source: string;
  target: string;
  relations: string[];
  weight: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const width = 1000;
const height = 640;

const layoutNodes = ref<LayoutNode[]>([]);
const hoveredCode = ref<string | null>(null);

const runSimulation = () => {
  const nodeCount = props.nodes.length;
  if (!nodeCount) {
    layoutNodes.value = [];
    return;
  }

  // Initialize on a circle
  const radius = Math.min(width, height) * 0.35;
  const simNodes = props.nodes.map((node, index) => ({
    ...node,
    x: width / 2 + radius * Math.cos((index / nodeCount) * 2 * Math.PI),
    y: height / 2 + radius * Math.sin((index / nodeCount) * 2 * Math.PI),
    vx: 0,
    vy: 0,
  }));
  const nodeMap = new Map(simNodes.map((node, index) => [node.code, index]));
  const links = props.edges.
      map((edge) => ({
        source: nodeMap.get(edge.source),
        target: nodeMap.get(edge.target),
        weight: edge.weight,
      })).
      filter((link) => link.source !== undefined && link.target !== undefined);

  const iterations = nodeCount > 200 ? 150 : 300;
  for (let step = 0; step < iterations; step++) {
    const cooling = 1 - step / iterations;

    // Repulsion between every pair
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = simNodes[j].x - simNodes[i].x;
        const dy = simNodes[j].y - simNodes[i].y;
        const distanceSquared = Math.max(dx * dx + dy * dy, 25);
        const force = (1600 / distanceSquared) * cooling;
        const distance = Math.sqrt(distanceSquared);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        simNodes[i].vx -= fx;
        simNodes[i].vy -= fy;
        simNodes[j].vx += fx;
        simNodes[j].vy += fy;
      }
    }

    // Attraction along edges
    for (const link of links) {
      const source = simNodes[link.source as number];
      const target = simNodes[link.target as number];
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const springLength = 80;
      const strength = (0.012 + link.weight * 0.008) * cooling;
      const force = (distance - springLength) * strength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }

    // Gravity to center and integrate
    for (const node of simNodes) {
      node.vx += (width / 2 - node.x) * 0.008;
      node.vy += (height / 2 - node.y) * 0.008;
      node.vx *= 0.82;
      node.vy *= 0.82;
      node.x += node.vx;
      node.y += node.vy;
    }
  }

  layoutNodes.value = simNodes.map((node) => ({
    ...node,
    x: Math.min(Math.max(node.x, 30), width - 30),
    y: Math.min(Math.max(node.y, 30), height - 30),
  }));
};

watch(() => [props.nodes, props.edges], runSimulation, {immediate: true});

const renderedNodes = computed(() => layoutNodes.value);

const renderedEdges = computed<RenderedEdge[]>(() => {
  const nodeMap = new Map(layoutNodes.value.map((node) => [node.code, node]));
  return props.edges.flatMap((edge) => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (!source || !target) return [];
    return [{
      ...edge,
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
    }];
  });
});

const hoveredNode = computed(() =>
  layoutNodes.value.find((node) => node.code === hoveredCode.value) || null,
);

const relatedCodes = computed(() => {
  if (!hoveredCode.value) return null;
  const codes = new Set<string>([hoveredCode.value]);
  for (const edge of props.edges) {
    if (edge.source === hoveredCode.value) codes.add(edge.target);
    if (edge.target === hoveredCode.value) codes.add(edge.source);
  }
  return codes;
});

const nodeColor = (node: LayoutNode) => {
  if (node.riskLevel === 'high') return '#ef4444';
  if (node.riskLevel === 'medium') return '#fbbf24';
  return '#cbd5e1';
};

const nodeRadius = (node: LayoutNode) =>
  5 + Math.min(node.clusterSize - 1, 8);

const nodeOpacity = (node: LayoutNode) => {
  if (!relatedCodes.value) return 1;
  return relatedCodes.value.has(node.code) ? 1 : 0.15;
};

const edgeColor = (edge: RenderedEdge) => {
  if (edge.relations.includes('zebra')) return '#f43f5e';
  if (edge.relations.includes('ip')) return '#fb923c';
  if (edge.relations.includes('device')) return '#a78bfa';
  if (edge.relations.includes('subnet')) return '#2dd4bf';
  return '#94a3b8';
};

const edgeWidth = (edge: RenderedEdge) => Math.min(1 + edge.weight * 0.4, 4);

const edgeOpacity = (edge: RenderedEdge) => {
  if (!hoveredCode.value) return Math.min(0.25 + edge.weight * 0.08, 0.8);
  const isRelated = edge.source === hoveredCode.value ||
      edge.target === hoveredCode.value;
  return isRelated ? 0.9 : 0.06;
};

const displayedLabel = (node: LayoutNode) => {
  if (node.clusterSize >= 2) return `${node.code} ×${node.clusterSize}`;
  return node.code;
};

const tooltipStyle = computed(() => {
  const node = hoveredNode.value;
  if (!node) return {};
  const leftPercent = (node.x / width) * 100;
  const topPercent = (node.y / height) * 100;
  return {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
    transform: leftPercent > 70 ?
      'translate(calc(-100% - 12px), -50%)' :
      'translate(12px, -50%)',
  };
});
</script>
