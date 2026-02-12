import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {COLORS} from '../theme';

type ErrorPopupsProps = {
  x?: number;
  y?: number;
  count: number;
  delay?: number;
};

export const ErrorPopups: React.FC<ErrorPopupsProps> = ({
  x = 0,
  y = 0,
  count,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const popups = Array.from({length: count}).map((_, i) => {
    const popDelay = delay + i * 12;
    const scale = spring({
      frame,
      fps,
      delay: popDelay,
      config: {damping: 12, stiffness: 200},
    });

    const float = Math.sin((frame - popDelay) / 12 + i) * 3;

    // Stagger positions upward and slightly sideways
    const px = (i % 2 === 0 ? -1 : 1) * (15 + i * 8);
    const py = -i * 28 + float;

    return (
      <g key={i} transform={`translate(${px}, ${py}) scale(${scale})`} opacity={scale}>
        {/* Popup bg */}
        <rect
          x={-28}
          y={-12}
          width={56}
          height={24}
          rx={6}
          fill={COLORS.errorRed}
          opacity={0.9}
        />
        {/* X icon */}
        <line x1={-4} y1={-4} x2={4} y2={4} stroke={COLORS.white} strokeWidth={2} strokeLinecap="round" />
        <line x1={4} y1={-4} x2={-4} y2={4} stroke={COLORS.white} strokeWidth={2} strokeLinecap="round" />
        {/* Text */}
        <rect x={10} y={-2} width={14} height={3} rx={1} fill="rgba(255,255,255,0.6)" />
      </g>
    );
  });

  return <g transform={`translate(${x}, ${y})`}>{popups}</g>;
};
