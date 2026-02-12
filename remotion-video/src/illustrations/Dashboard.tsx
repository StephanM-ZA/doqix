import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {COLORS} from '../theme';

type DashboardProps = {
  x?: number;
  y?: number;
  delay?: number;
};

export const Dashboard: React.FC<DashboardProps> = ({
  x = 0,
  y = 0,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({frame, fps, delay, config: {damping: 200}});

  const bars = [
    {height: 80, color: COLORS.successGreen, barDelay: 0},
    {height: 55, color: COLORS.teal, barDelay: 8},
    {height: 95, color: COLORS.accent, barDelay: 16},
    {height: 70, color: COLORS.action, barDelay: 24},
  ];

  return (
    <g transform={`translate(${x}, ${y})`} opacity={entrance}>
      {/* Dashboard frame */}
      <rect
        x={-100}
        y={-120}
        width={200}
        height={140}
        rx={10}
        fill="#0F2430"
        stroke={COLORS.teal}
        strokeWidth={1.5}
        opacity={0.9}
      />

      {/* Title bar */}
      <rect x={-100} y={-120} width={200} height={20} rx={10} fill="#162E3A" />
      <circle cx={-86} cy={-110} r={3} fill={COLORS.errorRed} opacity={0.6} />
      <circle cx={-76} cy={-110} r={3} fill={COLORS.accent} opacity={0.6} />
      <circle cx={-66} cy={-110} r={3} fill={COLORS.successGreen} opacity={0.6} />

      {/* Bars */}
      {bars.map((bar, i) => {
        const barGrow = spring({
          frame,
          fps,
          delay: delay + bar.barDelay,
          config: {damping: 200},
          durationInFrames: fps,
        });

        const barHeight = bar.height * barGrow;

        return (
          <rect
            key={i}
            x={-75 + i * 42}
            y={10 - barHeight}
            width={28}
            height={barHeight}
            rx={4}
            fill={bar.color}
            opacity={0.85}
          />
        );
      })}

      {/* Baseline */}
      <line
        x1={-85}
        y1={12}
        x2={85}
        y2={12}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1}
      />
    </g>
  );
};
