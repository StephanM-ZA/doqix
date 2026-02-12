import React from 'react';
import {COLORS} from '../theme';

type DeskProps = {
  x?: number;
  y?: number;
  clean?: boolean;
};

export const Desk: React.FC<DeskProps> = ({x = 0, y = 0, clean = false}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Desk surface */}
      <rect
        x={-120}
        y={0}
        width={240}
        height={12}
        rx={4}
        fill="#2A4A58"
      />
      {/* Desk legs */}
      <rect x={-110} y={12} width={8} height={60} rx={2} fill="#1E3844" />
      <rect x={102} y={12} width={8} height={60} rx={2} fill="#1E3844" />

      {/* Monitor */}
      <g transform="translate(0, -80)">
        <rect x={-50} y={0} width={100} height={65} rx={6} fill="#1A2E38" />
        {/* Screen */}
        <rect
          x={-44}
          y={6}
          width={88}
          height={50}
          rx={3}
          fill={clean ? '#0F2430' : '#162530'}
        />
        {/* Monitor stand */}
        <rect x={-8} y={65} width={16} height={15} rx={2} fill="#1E3844" />

        {/* Screen content */}
        {clean ? (
          /* Dashboard when clean */
          <g transform="translate(-36, 14)">
            <rect width={20} height={30} rx={2} fill={COLORS.successGreen} opacity={0.6} />
            <rect x={24} width={20} height={22} rx={2} fill={COLORS.teal} opacity={0.6} />
            <rect x={48} width={20} height={36} rx={2} fill={COLORS.accent} opacity={0.6} />
          </g>
        ) : (
          /* Messy lines when chaotic */
          <g opacity={0.4}>
            <rect x={-36} y={14} width={50} height={3} rx={1} fill="#4A6A7A" />
            <rect x={-36} y={22} width={35} height={3} rx={1} fill="#4A6A7A" />
            <rect x={-36} y={30} width={60} height={3} rx={1} fill="#4A6A7A" />
            <rect x={-36} y={38} width={42} height={3} rx={1} fill="#4A6A7A" />
          </g>
        )}
      </g>

      {/* Keyboard */}
      <rect
        x={-35}
        y={-12}
        width={70}
        height={10}
        rx={3}
        fill="#1E3844"
      />
    </g>
  );
};
