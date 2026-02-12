import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {COLORS} from '../theme';

type DataParticleProps = {
  /** Start x,y */
  x1: number;
  y1: number;
  /** End x,y */
  x2: number;
  y2: number;
  /** Frame at which the particle starts moving */
  startFrame: number;
  /** How many frames the travel takes */
  durationFrames?: number;
  /** Color */
  color?: string;
  /** Size */
  size?: number;
  /** Optional label shown on the particle */
  label?: string;
};

/**
 * An animated data dot that travels along a straight line between two points.
 * Place inside an SVG.
 */
export const DataParticle: React.FC<DataParticleProps> = ({
  x1,
  y1,
  x2,
  y2,
  startFrame,
  durationFrames = 30,
  color = COLORS.accent,
  size = 7,
  label,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  if (progress <= 0 || progress >= 1) return null;

  const cx = interpolate(progress, [0, 1], [x1, x2]);
  const cy = interpolate(progress, [0, 1], [y1, y2]);

  // Trail
  const trailProgress = Math.max(0, progress - 0.15);
  const trailX = interpolate(trailProgress, [0, 1], [x1, x2]);
  const trailY = interpolate(trailProgress, [0, 1], [y1, y2]);

  return (
    <g>
      {/* Trail line */}
      <line
        x1={trailX}
        y1={trailY}
        x2={cx}
        y2={cy}
        stroke={color}
        strokeWidth={2}
        opacity={0.4}
        strokeLinecap="round"
      />
      {/* Glow */}
      <circle cx={cx} cy={cy} r={size + 4} fill={color} opacity={0.15} />
      {/* Dot */}
      <circle cx={cx} cy={cy} r={size} fill={color} opacity={0.9} />
      {/* Label */}
      {label && (
        <text
          x={cx}
          y={cy - size - 6}
          textAnchor="middle"
          fontSize={9}
          fontFamily="Open Sans, sans-serif"
          fill="rgba(255,255,255,0.7)"
        >
          {label}
        </text>
      )}
    </g>
  );
};

type ConnectionLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
  color?: string;
};

/**
 * Animated dashed connection line between two points.
 */
export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  delay = 0,
  color = 'rgba(255,255,255,0.15)',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const drawProgress = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const endX = interpolate(drawProgress, [0, 1], [x1, x2]);
  const endY = interpolate(drawProgress, [0, 1], [y1, y2]);

  if (drawProgress <= 0) return null;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={endX}
      y2={endY}
      stroke={color}
      strokeWidth={2}
      strokeDasharray="8 5"
      strokeLinecap="round"
      opacity={0.6}
    />
  );
};
