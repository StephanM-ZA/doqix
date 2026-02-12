import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {COLORS} from '../theme';

type CelebrationParticlesProps = {
  x?: number;
  y?: number;
  delay?: number;
  count?: number;
};

export const CelebrationParticles: React.FC<CelebrationParticlesProps> = ({
  x = 0,
  y = 0,
  delay = 0,
  count = 20,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const burst = spring({
    frame,
    fps,
    delay,
    config: {damping: 20, stiffness: 100},
  });

  const fade = interpolate(frame, [delay + 30, delay + 60], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const colors = [COLORS.accent, COLORS.teal, COLORS.action, COLORS.successGreen, '#FFD700'];

  return (
    <g transform={`translate(${x}, ${y})`} opacity={fade}>
      {Array.from({length: count}).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i * 0.3);
        const distance = (30 + (i % 5) * 20) * burst;
        const size = 3 + (i % 3) * 2;
        const px = Math.cos(angle) * distance;
        const py = Math.sin(angle) * distance - burst * 20; // gravity-ish

        return (
          <rect
            key={i}
            x={px - size / 2}
            y={py - size / 2}
            width={size}
            height={size}
            rx={i % 2 === 0 ? size / 2 : 1}
            fill={colors[i % colors.length]}
            transform={`rotate(${frame * 5 + i * 45}, ${px}, ${py})`}
          />
        );
      })}
    </g>
  );
};
