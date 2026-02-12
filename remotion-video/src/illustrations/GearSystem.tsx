import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {COLORS} from '../theme';

type GearSystemProps = {
  x?: number;
  y?: number;
  delay?: number;
  spinning?: boolean;
};

const Gear: React.FC<{
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  rotation: number;
  color: string;
  opacity?: number;
}> = ({cx, cy, r, teeth, rotation, color, opacity = 0.7}) => {
  const toothPath = Array.from({length: teeth})
    .map((_, i) => {
      const angle = (i / teeth) * Math.PI * 2;
      const nextAngle = ((i + 0.5) / teeth) * Math.PI * 2;
      const inner = r - 4;
      const outer = r + 4;
      return `L ${cx + Math.cos(angle) * outer} ${cy + Math.sin(angle) * outer} L ${cx + Math.cos(nextAngle) * inner} ${cy + Math.sin(nextAngle) * inner}`;
    })
    .join(' ');

  return (
    <g transform={`rotate(${rotation}, ${cx}, ${cy})`} opacity={opacity}>
      <path
        d={`M ${cx + r - 4} ${cy} ${toothPath} Z`}
        fill={color}
      />
      <circle cx={cx} cy={cy} r={r * 0.35} fill="#0F2430" />
    </g>
  );
};

export const GearSystem: React.FC<GearSystemProps> = ({
  x = 0,
  y = 0,
  delay = 0,
  spinning = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({frame, fps, delay, config: {damping: 200}});
  const speed = spinning ? frame * 1.5 : 0;

  return (
    <g transform={`translate(${x}, ${y}) scale(${entrance})`} opacity={entrance}>
      <Gear
        cx={-18}
        cy={0}
        r={22}
        teeth={8}
        rotation={speed}
        color={COLORS.action}
      />
      <Gear
        cx={20}
        cy={-14}
        r={16}
        teeth={6}
        rotation={-speed * 1.33}
        color={COLORS.teal}
      />
      <Gear
        cx={22}
        cy={20}
        r={12}
        teeth={5}
        rotation={speed * 1.76}
        color={COLORS.accent}
        opacity={0.6}
      />
    </g>
  );
};
