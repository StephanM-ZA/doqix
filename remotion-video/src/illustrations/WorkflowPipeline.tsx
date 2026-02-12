import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {COLORS} from '../theme';

type WorkflowPipelineProps = {
  x?: number;
  y?: number;
  delay?: number;
  scale?: number;
};

const PipelineNode: React.FC<{
  cx: number;
  cy: number;
  icon: string;
  label: string;
  color: string;
  nodeDelay: number;
}> = ({cx, cy, icon, label, color, nodeDelay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const s = spring({
    frame,
    fps,
    delay: nodeDelay,
    config: {damping: 15, stiffness: 200},
  });

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s})`} opacity={s}>
      {/* Glow */}
      <circle cx={0} cy={0} r={38} fill={color} opacity={0.08} />
      {/* Circle bg */}
      <circle
        cx={0}
        cy={0}
        r={30}
        fill="#0F2430"
        stroke={color}
        strokeWidth={2.5}
      />
      {/* Icon text */}
      <text
        x={0}
        y={6}
        textAnchor="middle"
        fontSize={22}
        fill={COLORS.white}
      >
        {icon}
      </text>
      {/* Label */}
      <text
        x={0}
        y={48}
        textAnchor="middle"
        fontSize={12}
        fontFamily="Open Sans"
        fill="rgba(255,255,255,0.7)"
      >
        {label}
      </text>
    </g>
  );
};

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({
  x = 0,
  y = 0,
  delay = 0,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Animated arrows between nodes
  const arrow1 = spring({
    frame,
    fps,
    delay: delay + 15,
    config: {damping: 200},
  });
  const arrow2 = spring({
    frame,
    fps,
    delay: delay + 30,
    config: {damping: 200},
  });

  // Data particle flowing through
  const particleProgress = interpolate(
    frame,
    [delay + 40, delay + 80],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const particleX = interpolate(particleProgress, [0, 0.45, 0.55, 1], [-130, -10, 10, 130]);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Connection arrows */}
      <g opacity={arrow1}>
        <line
          x1={-90}
          y1={0}
          x2={-45}
          y2={0}
          stroke={COLORS.teal}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <polygon
          points="-48,-5 -38,0 -48,5"
          fill={COLORS.teal}
        />
      </g>
      <g opacity={arrow2}>
        <line
          x1={42}
          y1={0}
          x2={87}
          y2={0}
          stroke={COLORS.teal}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <polygon
          points="84,-5 94,0 84,5"
          fill={COLORS.teal}
        />
      </g>

      {/* Data particle */}
      {particleProgress > 0 && particleProgress < 1 && (
        <circle
          cx={particleX}
          cy={0}
          r={5}
          fill={COLORS.accent}
          opacity={0.9}
        >
        </circle>
      )}

      {/* Nodes */}
      <PipelineNode
        cx={-130}
        cy={0}
        icon="⚡"
        label="Trigger"
        color={COLORS.accent}
        nodeDelay={delay}
      />
      <PipelineNode
        cx={0}
        cy={0}
        icon="⚙️"
        label="Rule"
        color={COLORS.teal}
        nodeDelay={delay + 12}
      />
      <PipelineNode
        cx={130}
        cy={0}
        icon="✓"
        label="Action"
        color={COLORS.action}
        nodeDelay={delay + 24}
      />
    </g>
  );
};
