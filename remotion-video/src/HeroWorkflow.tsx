import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadJetBrainsMono} from '@remotion/google-fonts/JetBrainsMono';

loadInter('normal', {weights: ['400', '500', '600', '700', '800'], subsets: ['latin']});
loadJetBrainsMono('normal', {weights: ['400', '500'], subsets: ['latin']});

// ── Palette ──
const C = {
  bg: '#0B1117',
  bgWarm: '#0F1419',
  card: '#161B22',
  cardBorder: '#30363D',
  accent: '#FF7B00',
  accentSoft: 'rgba(255,123,0,0.08)',
  blue: '#58A6FF',
  green: '#3FB950',
  purple: '#A371F7',
  red: '#F85149',
  teal: '#39D0D8',
  yellow: '#D29922',
  pink: '#DB61A2',
  text: '#E6EDF3',
  textMuted: '#8B949E',
  textDim: '#484F58',
  line: '#21262D',
} as const;

const FPS = 30;
const DURATION_SEC = 30;
export const HERO_TOTAL_FRAMES = DURATION_SEC * FPS;

// ── Easing helper ──
const ease = (frame: number, start: number, end: number, from: number, to: number) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

// ═══════════════════════════════════════════
// SCENE 1: THE PROBLEM (0 - 9s)
// Apps in a circle, connected, data flying chaotically in every direction
// ═══════════════════════════════════════════

const SceneProblem: React.FC<{sceneFrame: number}> = ({sceneFrame}) => {
  const fps = FPS;
  const radius = 160;

  // 6 apps evenly spaced in a circle
  const appDefs = [
    {label: 'Email', sub: 'Inbox', icon: 'trigger', color: C.red},
    {label: 'Spreadsheet', sub: 'Manual entry', icon: 'action', color: C.green},
    {label: 'Accounting', sub: 'Copy-paste', icon: 'ai', color: C.blue},
    {label: 'Messaging', sub: 'Notify team', icon: 'slack', color: C.purple},
    {label: 'CRM', sub: 'Update records', icon: 'user', color: C.yellow},
    {label: 'Reports', sub: 'Format & send', icon: 'branch', color: C.teal},
  ];

  const apps = appDefs.map((app, i) => {
    const angle = (i / appDefs.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...app,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: 10 + i * 12,
    };
  });

  // Every app connects to every other — full mesh of connections
  const connections: Array<{from: number; to: number; delay: number}> = [];
  let connDelay = 70;
  for (let i = 0; i < apps.length; i++) {
    for (let j = i + 1; j < apps.length; j++) {
      connections.push({from: i, to: j, delay: connDelay});
      connDelay += 4;
    }
  }

  // Chaotic data pulses — every direction, overlapping, constant
  // Each pulse: from → to, with a staggered start that repeats
  const pulsePairs = [
    {from: 0, to: 2}, {from: 3, to: 1}, {from: 5, to: 0}, {from: 2, to: 4},
    {from: 1, to: 5}, {from: 4, to: 3}, {from: 0, to: 4}, {from: 3, to: 5},
    {from: 2, to: 1}, {from: 5, to: 3}, {from: 1, to: 0}, {from: 4, to: 2},
    {from: 0, to: 3}, {from: 2, to: 5}, {from: 4, to: 1}, {from: 1, to: 3},
  ];

  return (
    <g>
      {/* Orbit ring */}
      <circle cx={0} cy={0} r={radius} fill="none" stroke={C.textDim}
        strokeWidth={1} opacity={ease(sceneFrame, 40, 60, 0, 0.12)} />

      {/* Connection lines — same AnimLine style as other scenes */}
      {connections.map(({from, to, delay}, i) => {
        const a = apps[from];
        const b = apps[to];
        return (
          <AnimLine
            key={`c-${i}`}
            points={[{x: a.x, y: a.y}, {x: b.x, y: b.y}]}
            delay={delay}
            frame={sceneFrame}
            color={C.textDim}
          />
        );
      })}

      {/* Chaotic data pulses — firing in every direction constantly */}
      {pulsePairs.map(({from, to}, i) => {
        const a = apps[from];
        const b = apps[to];
        const pulseStart = Math.round(3.5 * fps) + i * 12;
        return (
          <Pulse
            key={`p-${i}`}
            points={[{x: a.x, y: a.y}, {x: b.x, y: b.y}]}
            start={pulseStart}
            dur={28}
            color={apps[from].color}
            frame={sceneFrame}
          />
        );
      })}

      {/* App node cards — identical WfNode style, no rotation, clean */}
      {apps.map(({label, sub, icon, color, x, y, delay}, i) => (
        <WfNode
          key={i}
          x={x} y={y}
          label={label} sub={sub}
          color={color} delay={delay} frame={sceneFrame}
          icon={icon}
          w={140} h={60}
        />
      ))}

      {/* Stat pill */}
      {sceneFrame > 5.5 * fps && (
        <g opacity={ease(sceneFrame, 5.5 * fps, 6.2 * fps, 0, 1)}>
          <rect x={-120} y={radius + 45} width={240} height={28} rx={14}
            fill={`${C.red}12`} stroke={`${C.red}25`} strokeWidth={1} />
          <text x={0} y={radius + 63} textAnchor="middle" fontSize={11}
            fontFamily="Inter" fontWeight="600" fill={C.red}>
            30% of your week — lost to this chaos
          </text>
        </g>
      )}
    </g>
  );
};

// ═══════════════════════════════════════════
// SCENE 2: THE TRANSFORMATION (5 - 9s)
// Chaos melts → clean pipeline appears
// ═══════════════════════════════════════════

const SceneTransform: React.FC<{sceneFrame: number}> = ({sceneFrame}) => {
  const fps = FPS;

  // Pipeline nodes
  const nodes = [
    {label: 'Trigger', sub: 'Event received', color: C.accent, x: -300, icon: 'trigger'},
    {label: 'Process', sub: 'AI analyzes data', color: C.blue, x: -100, icon: 'ai'},
    {label: 'Route', sub: 'Smart decisions', color: C.green, x: 100, icon: 'branch'},
    {label: 'Action', sub: 'Auto-execute', color: C.purple, x: 300, icon: 'action'},
  ];

  // Connection lines draw between nodes
  const connections = [
    {x1: -230, x2: -170},
    {x1: -30, x2: 30},
    {x1: 170, x2: 230},
  ];

  return (
    <g>
      {/* Glowing pipeline track */}
      <line
        x1={-350} y1={0} x2={350} y2={0}
        stroke={C.accent}
        strokeWidth={2}
        opacity={ease(sceneFrame, 10, 30, 0, 0.08)}
      />

      {/* Connection lines */}
      {connections.map(({x1, x2}, i) => {
        const drawProg = ease(sceneFrame, 30 + i * 20, 50 + i * 20, 0, 1);
        if (drawProg <= 0) return null;
        const ex = interpolate(drawProg, [0, 1], [x1, x2]);
        return (
          <g key={i}>
            <line
              x1={x1} y1={0} x2={ex} y2={0}
              stroke={C.textDim}
              strokeWidth={2}
              opacity={0.5}
            />
            {/* Arrow head */}
            {drawProg > 0.9 && (
              <polygon
                points={`${x2},0 ${x2 - 6},-4 ${x2 - 6},4`}
                fill={C.textDim}
                opacity={ease(sceneFrame, 48 + i * 20, 52 + i * 20, 0, 0.5)}
              />
            )}
          </g>
        );
      })}

      {/* Pipeline nodes */}
      {nodes.map(({label, sub, color, x, icon}, i) => {
        const delay = 15 + i * 18;
        const entrance = spring({
          frame: sceneFrame,
          fps,
          delay,
          config: {damping: 14, stiffness: 150},
        });
        const isActive = sceneFrame > delay + 2 * fps;
        const pulse = isActive ? Math.sin(sceneFrame / 20) * 1.5 : 0;
        const w = 140;
        const h = 70;

        return (
          <g key={i} transform={`translate(${x}, 0) scale(${entrance})`} opacity={entrance}>
            {/* Glow ring */}
            {isActive && (
              <rect
                x={-w / 2 - 4} y={-h / 2 - 4} width={w + 8} height={h + 8} rx={14}
                fill="none"
                stroke={color}
                strokeWidth={1}
                opacity={0.2 + pulse * 0.03}
              />
            )}
            {/* Card */}
            <rect
              x={-w / 2} y={-h / 2} width={w} height={h} rx={10}
              fill={C.card}
              stroke={isActive ? `${color}60` : C.cardBorder}
              strokeWidth={isActive ? 1.5 : 1}
            />
            {/* Left color bar */}
            <rect x={-w / 2} y={-h / 2} width={3} height={h} rx={1.5} fill={color} />
            {/* Icon */}
            <g transform={`translate(${-w / 2 + 22}, -2)`}>
              <NodeIcon type={icon} color={color} />
            </g>
            {/* Labels */}
            <text
              x={-w / 2 + 42} y={-4}
              fontSize={12}
              fontFamily="Inter"
              fontWeight="700"
              fill={C.text}
            >
              {label}
            </text>
            <text
              x={-w / 2 + 42} y={12}
              fontSize={9}
              fontFamily="Inter"
              fontWeight="500"
              fill={C.textMuted}
            >
              {sub}
            </text>
            {/* Port dots */}
            <circle cx={-w / 2} cy={0} r={3.5} fill={C.cardBorder} stroke={C.bg} strokeWidth={1} />
            <circle cx={w / 2} cy={0} r={3.5} fill={C.cardBorder} stroke={C.bg} strokeWidth={1} />
          </g>
        );
      })}

      {/* Data pulse flowing through */}
      {sceneFrame > 3 * fps && (() => {
        const pulseProgress = ease(sceneFrame, 3 * fps, 3 * fps + 60, 0, 1);
        const px = interpolate(pulseProgress, [0, 1], [-300, 300]);
        if (pulseProgress <= 0 || pulseProgress >= 1) return null;
        return (
          <g>
            <circle cx={px} cy={0} r={10} fill={C.accent} opacity={0.12} />
            <circle cx={px} cy={0} r={5} fill={C.accent} opacity={0.9} />
            <text
              x={px} y={-14}
              textAnchor="middle"
              fontSize={8}
              fontFamily="JetBrains Mono"
              fontWeight="500"
              fill={`${C.accent}bb`}
            >
              data
            </text>
          </g>
        );
      })()}
    </g>
  );
};

// ═══════════════════════════════════════════
// SCENE 3: REAL WORKFLOW IN ACTION (9 - 15s)
// Full n8n-style diagram with branching, tools, data flowing
// ═══════════════════════════════════════════

const SceneWorkflow: React.FC<{sceneFrame: number}> = ({sceneFrame}) => {
  const fps = FPS;

  // Main pipeline nodes
  const formX = -380;
  const agentX = -130;
  const condX = 90;
  const actTopX = 310;
  const actBotX = 310;
  const cy = 0;
  const branch = 85;

  // Tool integrations hanging below the AI Agent
  const toolY = 120;
  const toolNodes = [
    {label: 'AI Model', color: C.purple, x: agentX - 80},
    {label: 'Memory', color: C.teal, x: agentX - 20},
    {label: 'Identity', color: C.blue, x: agentX + 40},
    {label: 'Ticketing', color: C.green, x: agentX + 100},
  ];

  // Entrance delays
  const d = {
    form: 8,
    l1: 25,
    agent: 35,
    tools: 50,
    l2: 70,
    cond: 80,
    l3: 100,
    actTop: 110,
    actBot: 115,
    pulse1: 130,
    pulse2: 175,
    status: 4.5 * fps,
  };

  // Data paths
  const pathFormToAgent = [
    {x: formX + 85, y: cy},
    {x: agentX - 85, y: cy},
  ];
  const pathAgentToCond = [
    {x: agentX + 85, y: cy},
    {x: condX - 35, y: cy},
  ];
  const pathCondTop = [
    {x: condX + 35, y: cy},
    {x: condX + 55, y: cy},
    {x: condX + 55, y: cy - branch},
    {x: actTopX - 85, y: cy - branch},
  ];
  const pathCondBot = [
    {x: condX + 35, y: cy},
    {x: condX + 55, y: cy},
    {x: condX + 55, y: cy + branch},
    {x: actBotX - 85, y: cy + branch},
  ];

  return (
    <g>
      {/* Connection lines */}
      <AnimLine points={pathFormToAgent} delay={d.l1} frame={sceneFrame} />
      <AnimLine points={pathAgentToCond} delay={d.l2} frame={sceneFrame} />
      <AnimLine points={pathCondTop} delay={d.l3} frame={sceneFrame} color={C.green} />
      <AnimLine points={pathCondBot} delay={d.l3 + 6} frame={sceneFrame} />

      {/* Agent → tool dashed lines */}
      {toolNodes.map((t, i) => (
        <AnimLine
          key={`tl-${i}`}
          points={[
            {x: agentX + (i - 1) * 15, y: cy + 42},
            {x: t.x, y: toolY - 20},
          ]}
          delay={d.tools + i * 4}
          frame={sceneFrame}
          dashed
        />
      ))}

      {/* ── Nodes ── */}
      <WfNode x={formX} y={cy} label="Form Submit" sub="On 'Create User'" color={C.accent} delay={d.form} frame={sceneFrame} icon="trigger" />
      <WfNode x={agentX} y={cy} label="AI Agent" sub="Tools Agent" color={C.blue} delay={d.agent} frame={sceneFrame} icon="ai" w={165} h={84} />
      <CondDiamond x={condX} y={cy} label="Is manager?" delay={d.cond} frame={sceneFrame} />
      <WfNode x={actTopX} y={cy - branch} label="Add to channel" sub="invite: channel" color={C.green} delay={d.actTop} frame={sceneFrame} icon="slack" />
      <WfNode x={actBotX} y={cy + branch} label="Update profile" sub="updateProfile: user" color={C.blue} delay={d.actBot} frame={sceneFrame} icon="user" />

      {/* Tool bubbles */}
      {toolNodes.map((t, i) => {
        const ent = spring({frame: sceneFrame, fps, delay: d.tools + i * 6, config: {damping: 12, stiffness: 200}});
        return (
          <g key={i} transform={`translate(${t.x}, ${toolY}) scale(${ent})`} opacity={ent}>
            <circle cx={0} cy={0} r={18} fill={`${t.color}12`} stroke={`${t.color}30`} strokeWidth={1} />
            <circle cx={0} cy={0} r={3} fill={t.color} opacity={0.7} />
            <text x={0} y={30} textAnchor="middle" fontSize={8} fontFamily="Inter" fontWeight="500" fill={C.textMuted}>{t.label}</text>
          </g>
        );
      })}

      {/* Branch labels */}
      <BLabel x={condX + 48} y={cy - 38} text="true" color={C.green} delay={d.l3 + 10} frame={sceneFrame} />
      <BLabel x={condX + 48} y={cy + 38} text="false" color={C.textMuted} delay={d.l3 + 14} frame={sceneFrame} />

      {/* Data pulses */}
      <Pulse points={pathFormToAgent} start={d.pulse1} dur={22} color={C.accent} frame={sceneFrame} label="new_user" />
      <Pulse points={pathAgentToCond} start={d.pulse1 + 26} dur={18} color={C.blue} frame={sceneFrame} />
      <Pulse points={pathCondTop} start={d.pulse2} dur={22} color={C.green} frame={sceneFrame} label="manager" />
      <Pulse points={pathCondBot} start={d.pulse2 + 30} dur={22} color={C.blue} frame={sceneFrame} label="profile" />

      {/* Second wave */}
      <Pulse points={pathFormToAgent} start={d.pulse2 + 60} dur={22} color={C.accent} frame={sceneFrame} />
      <Pulse points={pathAgentToCond} start={d.pulse2 + 86} dur={18} color={C.blue} frame={sceneFrame} />

      {/* Status pill */}
      {sceneFrame > d.status && (
        <g opacity={ease(sceneFrame, d.status, d.status + 15, 0, 1)}>
          <rect x={-52} y={170} width={104} height={26} rx={13} fill={`${C.green}15`} stroke={`${C.green}35`} strokeWidth={1} />
          <circle cx={-28} cy={183} r={3.5} fill={C.green} />
          <text x={8} y={187} textAnchor="middle" fontSize={10} fontFamily="Inter" fontWeight="600" fill={C.green}>Active</text>
        </g>
      )}
    </g>
  );
};

// ═══════════════════════════════════════════
// SCENE 4: THE RESULT (15 - 20s)
// Metrics, confidence, CTA
// ═══════════════════════════════════════════

const SceneResult: React.FC<{sceneFrame: number}> = ({sceneFrame}) => {
  const fps = FPS;

  const metrics = [
    {label: 'Time saved', value: '30%', color: C.green, x: -220, delay: 15},
    {label: 'Zero errors', value: '0', color: C.blue, x: -0, delay: 25},
    {label: 'Always on', value: '24/7', color: C.purple, x: 220, delay: 35},
  ];

  return (
    <g>
      {/* Subtle connecting arcs */}
      <path
        d="M-220,0 Q0,-60 220,0"
        fill="none"
        stroke={C.accent}
        strokeWidth={1}
        opacity={ease(sceneFrame, 50, 70, 0, 0.15)}
        strokeDasharray="6 4"
      />

      {/* Metric cards */}
      {metrics.map(({label, value, color, x, delay}, i) => {
        const ent = spring({frame: sceneFrame, fps, delay, config: {damping: 14, stiffness: 140}});
        const isShown = sceneFrame > delay + fps;
        return (
          <g key={i} transform={`translate(${x}, 0) scale(${ent})`} opacity={ent}>
            {/* Card glow */}
            <rect x={-75} y={-55} width={150} height={110} rx={14} fill={`${color}08`} stroke={`${color}25`} strokeWidth={1} />
            {/* Value */}
            <text x={0} y={8} textAnchor="middle" fontSize={36} fontFamily="Inter" fontWeight="800" fill={color}>
              {isShown ? value : ''}
            </text>
            {/* Label */}
            <text x={0} y={32} textAnchor="middle" fontSize={12} fontFamily="Inter" fontWeight="500" fill={C.textMuted}>
              {label}
            </text>
          </g>
        );
      })}

      {/* Checkmark animation */}
      {sceneFrame > 2.5 * fps && (() => {
        const checkProg = spring({frame: sceneFrame, fps, delay: Math.round(2.5 * fps), config: {damping: 12, stiffness: 200}});
        return (
          <g transform={`translate(0, -100) scale(${checkProg})`} opacity={checkProg}>
            <circle cx={0} cy={0} r={22} fill={`${C.green}20`} />
            <circle cx={0} cy={0} r={15} fill={C.green} />
            <polyline
              points="-6,0 -2,5 7,-5"
              fill="none"
              stroke="#fff"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })()}
    </g>
  );
};

// ═══════════════════════════════════════════
// SHARED MICRO-COMPONENTS
// ═══════════════════════════════════════════

const NodeIcon: React.FC<{type: string; color: string}> = ({type, color}) => {
  switch (type) {
    case 'trigger':
      return (
        <g>
          <path d="M-5,-8 L5,-2 L-5,4 Z" fill={color} opacity={0.9} />
          <path d="M-2,3 L8,9 L-2,15 Z" fill={color} opacity={0.4} />
        </g>
      );
    case 'ai':
      return (
        <g>
          <circle cx={0} cy={0} r={10} fill="none" stroke={color} strokeWidth={1.5} />
          <circle cx={-3} cy={-2} r={1.5} fill={color} />
          <circle cx={3} cy={-2} r={1.5} fill={color} />
          <path d="M-3,3 Q0,6 3,3" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
        </g>
      );
    case 'slack':
      return (
        <g>
          <rect x={-2} y={-8} width={4} height={9} rx={2} fill={C.green} />
          <rect x={-8} y={-2} width={9} height={4} rx={2} fill={C.blue} />
          <rect x={2} y={-2} width={4} height={4} rx={2} fill={C.yellow} />
          <rect x={-2} y={2} width={4} height={4} rx={2} fill={C.red} />
        </g>
      );
    case 'user':
      return (
        <g>
          <circle cx={0} cy={-3} r={4} fill="none" stroke={color} strokeWidth={1.3} />
          <path d="M-6,7 Q0,2 6,7" fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
        </g>
      );
    case 'branch':
      return (
        <g>
          <path d="M-6,-6 L0,0 L6,-6 M0,0 L0,8" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'action':
      return (
        <g>
          <polygon points="-4,-10 -8,0 -2,0 -4,10 8,0 2,0 4,-10" fill={color} opacity={0.8} />
        </g>
      );
    default:
      return <circle cx={0} cy={0} r={5} fill={color} />;
  }
};

/** Animated connection line (reusable) */
const AnimLine: React.FC<{
  points: Array<{x: number; y: number}>;
  delay: number;
  frame: number;
  color?: string;
  dashed?: boolean;
}> = ({points, delay, frame, color = C.textDim, dashed = false}) => {
  const drawProg = ease(frame, delay, delay + 18, 0, 1);
  if (drawProg <= 0) return null;

  let totalLen = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLen += Math.sqrt(dx * dx + dy * dy);
  }

  const d = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray={dashed ? '5 4' : `${totalLen}`}
      strokeDashoffset={dashed ? 0 : totalLen * (1 - drawProg)}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={dashed ? 0.35 * drawProg : 0.5}
    />
  );
};

/** Workflow node card */
const WfNode: React.FC<{
  x: number; y: number;
  label: string; sub: string;
  color: string; delay: number; frame: number;
  icon: string;
  w?: number; h?: number;
}> = ({x, y, label, sub, color, delay, frame, icon, w = 160, h = 72}) => {
  const fps = FPS;
  const ent = spring({frame, fps, delay, config: {damping: 14, stiffness: 150}});
  const active = frame > delay + 3 * fps;
  const pulse = active ? Math.sin(frame / 22) * 1.5 : 0;

  return (
    <g transform={`translate(${x}, ${y}) scale(${ent})`} opacity={ent}>
      {active && (
        <rect x={-w / 2 - 5} y={-h / 2 - 5} width={w + 10} height={h + 10} rx={15}
          fill="none" stroke={color} strokeWidth={1} opacity={0.15 + pulse * 0.03} />
      )}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10}
        fill={C.card} stroke={active ? `${color}55` : C.cardBorder} strokeWidth={active ? 1.5 : 1} />
      <rect x={-w / 2} y={-h / 2} width={3} height={h} rx={1.5} fill={color} />
      <g transform={`translate(${-w / 2 + 22}, -1)`}><NodeIcon type={icon} color={color} /></g>
      <text x={-w / 2 + 42} y={-4} fontSize={11} fontFamily="Inter" fontWeight="700" fill={C.text}>{label}</text>
      <text x={-w / 2 + 42} y={10} fontSize={9} fontFamily="Inter" fontWeight="500" fill={C.textMuted}>{sub}</text>
      <circle cx={-w / 2} cy={0} r={3.5} fill={C.cardBorder} stroke={C.bg} strokeWidth={1} />
      <circle cx={w / 2} cy={0} r={3.5} fill={C.cardBorder} stroke={C.bg} strokeWidth={1} />
    </g>
  );
};

/** Condition diamond */
const CondDiamond: React.FC<{x: number; y: number; label: string; delay: number; frame: number}> = ({x, y, label, delay, frame}) => {
  const fps = FPS;
  const ent = spring({frame, fps, delay, config: {damping: 14, stiffness: 150}});
  return (
    <g transform={`translate(${x}, ${y}) scale(${ent})`} opacity={ent}>
      <rect x={-24} y={-24} width={48} height={48} rx={6} transform="rotate(45)" fill={C.card} stroke={`${C.green}50`} strokeWidth={1.5} />
      <g transform="scale(0.6)"><NodeIcon type="branch" color={C.green} /></g>
      <text x={0} y={44} textAnchor="middle" fontSize={9} fontFamily="Inter" fontWeight="600" fill={C.textMuted}>{label}</text>
    </g>
  );
};

/** Branch label pill */
const BLabel: React.FC<{x: number; y: number; text: string; color: string; delay: number; frame: number}> = ({x, y, text, color, delay, frame}) => {
  const op = ease(frame, delay, delay + 12, 0, 1);
  return (
    <g opacity={op}>
      <rect x={x - 16} y={y - 7} width={32} height={14} rx={7} fill={`${color}18`} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={8} fontFamily="Inter" fontWeight="600" fill={color}>{text}</text>
    </g>
  );
};

/** Data pulse */
const Pulse: React.FC<{
  points: Array<{x: number; y: number}>;
  start: number; dur: number;
  color: string; frame: number;
  label?: string;
}> = ({points, start, dur, color, frame, label}) => {
  const prog = ease(frame, start, start + dur, 0, 1);
  if (prog <= 0 || prog >= 1) return null;

  let totalLen = 0;
  const segs: Array<{s: {x: number; y: number}; e: {x: number; y: number}; l: number}> = [];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const l = Math.sqrt(dx * dx + dy * dy);
    segs.push({s: points[i - 1], e: points[i], l});
    totalLen += l;
  }

  const target = prog * totalLen;
  let walked = 0;
  let cx = points[0].x;
  let cy = points[0].y;
  for (const seg of segs) {
    if (walked + seg.l >= target) {
      const t = (target - walked) / seg.l;
      cx = seg.s.x + (seg.e.x - seg.s.x) * t;
      cy = seg.s.y + (seg.e.y - seg.s.y) * t;
      break;
    }
    walked += seg.l;
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.1} />
      <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.9} />
      {label && (
        <text x={cx} y={cy - 12} textAnchor="middle" fontSize={7} fontFamily="JetBrains Mono" fontWeight="500" fill={`${color}bb`}>{label}</text>
      )}
    </g>
  );
};

// ═══════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════

export const HeroWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Scene timing (in seconds → frames) — 30s total, generous breathing room
  const s1End = 9 * fps;      // Problem: 0-9s
  const s2Start = 8 * fps;    // Transform starts (1s overlap)
  const s2End = 15 * fps;     // Transform: 8-15s
  const s3Start = 14 * fps;   // Workflow starts (1s overlap)
  const s3End = 23 * fps;     // Workflow: 14-23s
  const s4Start = 22 * fps;   // Result starts (1s overlap)

  // Scene opacities (cross-fade — 1.5s fades for silky blending)
  const fadeLen = Math.round(1.5 * fps);
  const s1Op = interpolate(frame, [0, 20, s1End - fadeLen, s1End], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s2Op = interpolate(frame, [s2Start, s2Start + fadeLen, s2End - fadeLen, s2End], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s3Op = interpolate(frame, [s3Start, s3Start + fadeLen, s3End - fadeLen, s3End], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s4Op = interpolate(frame, [s4Start, s4Start + fadeLen, durationInFrames - 2 * fps, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Scene-local frames
  const s1Frame = frame;
  const s2Frame = Math.max(0, frame - s2Start);
  const s3Frame = Math.max(0, frame - s3Start);
  const s4Frame = Math.max(0, frame - s4Start);

  // Slow drift
  const drift = interpolate(frame, [0, durationInFrames], [0, 15], {extrapolateRight: 'clamp'});

  // Title pairs for each scene
  const titles: Array<{
    text: string;
    sub: string;
    fromFrame: number;
    toFrame: number;
    color: string;
    subColor: string;
  }> = [
    {
      text: 'Your team is drowning in manual work',
      sub: 'Repetitive tasks. Human errors. Wasted hours.',
      fromFrame: Math.round(2 * fps),
      toFrame: s1End,
      color: C.text,
      subColor: C.red,
    },
    {
      text: 'What if it all just... flowed?',
      sub: 'Trigger. Process. Route. Act. Automatically.',
      fromFrame: s2Start + Math.round(1.5 * fps),
      toFrame: s2End,
      color: C.text,
      subColor: C.accent,
    },
    {
      text: 'This is workflow automation',
      sub: 'Your apps. Connected. Working for you.',
      fromFrame: s3Start + Math.round(1.5 * fps),
      toFrame: s3End,
      color: C.text,
      subColor: C.teal,
    },
    {
      text: 'Automate anything. Connect everything.',
      sub: 'Built by Do.Qix',
      fromFrame: s4Start + Math.round(2 * fps),
      toFrame: durationInFrames,
      color: C.text,
      subColor: C.accent,
    },
  ];

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {/* Animated grid */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${C.line}30 1px, transparent 1px),
              linear-gradient(90deg, ${C.line}30 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: `${drift}px ${drift * 0.5}px`,
            opacity: 0.3,
          }}
        />
        {/* Central glow */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '42%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${C.accentSoft}, transparent 70%)`,
          }}
        />
      </AbsoluteFill>

      {/* SVG canvas for all scenes */}
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg viewBox="-560 -220 1120 440" width={1920} height={1080} style={{position: 'absolute'}}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Scene 1: Problem */}
          {s1Op > 0.01 && (
            <g opacity={s1Op}>
              <SceneProblem sceneFrame={s1Frame} />
            </g>
          )}

          {/* Scene 2: Transform */}
          {s2Op > 0.01 && (
            <g opacity={s2Op}>
              <SceneTransform sceneFrame={s2Frame} />
            </g>
          )}

          {/* Scene 3: Full workflow */}
          {s3Op > 0.01 && (
            <g opacity={s3Op}>
              <SceneWorkflow sceneFrame={s3Frame} />
            </g>
          )}

          {/* Scene 4: Results */}
          {s4Op > 0.01 && (
            <g opacity={s4Op}>
              <SceneResult sceneFrame={s4Frame} />
            </g>
          )}
        </svg>
      </AbsoluteFill>

      {/* ── Text overlays ── */}
      {titles.map(({text, sub, fromFrame, toFrame, color, subColor}, i) => {
        const tIn = ease(frame, fromFrame, fromFrame + 15, 0, 1);
        const tOut = ease(frame, toFrame - fps, toFrame, 1, 0);
        const tOp = Math.min(tIn, tOut);
        const tY = interpolate(tIn, [0, 1], [25, 0]);

        if (tOp < 0.01) return null;

        return (
          <AbsoluteFill
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: i < 3 ? 'flex-end' : 'flex-end',
              alignItems: 'center',
              padding: i === 3 ? '0 100px 50px' : '0 100px 60px',
              zIndex: 3,
              opacity: tOp,
              transform: `translateY(${tY}px)`,
            }}
          >
            <div
              style={{
                fontSize: i === 3 ? 36 : 28,
                fontFamily: 'Inter',
                fontWeight: 700,
                color,
                textAlign: 'center',
                letterSpacing: -0.5,
                marginBottom: 8,
              }}
            >
              {text}
            </div>
            <div
              style={{
                fontSize: i === 3 ? 18 : 16,
                fontFamily: 'Inter',
                fontWeight: 500,
                color: subColor,
                textAlign: 'center',
              }}
            >
              {sub}
            </div>
          </AbsoluteFill>
        );
      })}

      {/* ── CTA Button (final scene) ── */}
      {frame > s4Start + 4 * fps && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 100px 110px',
            zIndex: 4,
          }}
        >
          <Sequence from={s4Start + Math.round(4.5 * fps)} layout="none">
            <CTAButton frame={frame - s4Start - Math.round(4.5 * fps)} />
          </Sequence>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════
// STANDALONE SCENE COMPOSITIONS
// Each can be previewed independently in Remotion Studio
// ═══════════════════════════════════════════

/** Shared scene shell — dark bg, grid, glow, SVG canvas */
const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 8], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${C.line}30 1px, transparent 1px),
              linear-gradient(90deg, ${C.line}30 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: `${drift}px ${drift * 0.5}px`,
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '42%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${C.accentSoft}, transparent 70%)`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg viewBox="-560 -220 1120 440" width={1920} height={1080} style={{position: 'absolute'}}>
          {children}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene durations (frames)
export const SCENE1_FRAMES = 9 * FPS;
export const SCENE2_FRAMES = 7 * FPS;
export const SCENE3_FRAMES = 9 * FPS;
export const SCENE4_FRAMES = 8 * FPS;

/** Scene 1 standalone — The Problem */
export const HeroScene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <SceneProblem sceneFrame={frame} />
    </SceneShell>
  );
};

/** Scene 2 standalone — The Transformation */
export const HeroScene2Transform: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <SceneTransform sceneFrame={frame} />
    </SceneShell>
  );
};

/** Scene 3 standalone — Workflow in Action */
export const HeroScene3Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <SceneWorkflow sceneFrame={frame} />
    </SceneShell>
  );
};

/** Scene 4 standalone — The Result */
export const HeroScene4Result: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <SceneResult sceneFrame={frame} />
    </SceneShell>
  );
};

const CTAButton: React.FC<{frame: number}> = ({frame}) => {
  const fps = FPS;
  const ent = spring({frame, fps, delay: 0, config: {damping: 200}});
  const op = interpolate(ent, [0, 1], [0, 1]);
  const y = interpolate(ent, [0, 1], [20, 0]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 800,
          fontSize: 14,
          color: C.accent,
          letterSpacing: 4,
        }}
      >
        DO.QIX
      </div>
    </div>
  );
};
