import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {COLORS} from '../theme';

type AppNodeProps = {
  x: number;
  y: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
  size?: number;
  glowColor?: string;
  active?: boolean;
};

/**
 * An app node — the icon with a label, glow ring, and entrance animation.
 * Place inside an SVG `<g>`.
 */
export const AppNode: React.FC<AppNodeProps> = ({
  x,
  y,
  label,
  icon,
  delay = 0,
  size = 60,
  glowColor = COLORS.accent,
  active = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: {damping: 15, stiffness: 180},
  });

  const pulse = active ? Math.sin((frame - delay) / 15) * 3 + 3 : 0;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${entrance})`}
      opacity={entrance}
    >
      {/* Outer glow ring */}
      <circle
        cx={0}
        cy={0}
        r={size / 2 + 8 + pulse}
        fill="none"
        stroke={glowColor}
        strokeWidth={1.5}
        opacity={0.25 + (active ? 0.15 : 0)}
      />
      {/* Shadow */}
      <circle cx={2} cy={3} r={size / 2} fill="rgba(0,0,0,0.3)" />
      {/* Icon */}
      {icon}
      {/* Label */}
      <text
        x={0}
        y={size / 2 + 22}
        textAnchor="middle"
        fontSize={13}
        fontFamily="Open Sans, sans-serif"
        fontWeight="600"
        fill="rgba(255,255,255,0.85)"
      >
        {label}
      </text>
    </g>
  );
};
