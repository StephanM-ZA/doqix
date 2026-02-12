import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

type ClockFaceProps = {
  x?: number;
  y?: number;
  speed?: number;
  size?: number;
};

export const ClockFace: React.FC<ClockFaceProps> = ({
  x = 0,
  y = 0,
  speed = 1,
  size = 40,
}) => {
  const frame = useCurrentFrame();

  const minuteAngle = (frame * speed * 3) % 360;
  const hourAngle = (frame * speed * 0.25) % 360;

  const r = size / 2;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Face */}
      <circle cx={0} cy={0} r={r} fill="#1A2E38" stroke={COLORS.grey} strokeWidth={2} />

      {/* Hour markers */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const inner = r - 6;
        const outer = r - 3;
        return (
          <line
            key={i}
            x1={Math.cos(angle) * inner}
            y1={Math.sin(angle) * inner}
            x2={Math.cos(angle) * outer}
            y2={Math.sin(angle) * outer}
            stroke={COLORS.grey}
            strokeWidth={1.5}
          />
        );
      })}

      {/* Hour hand */}
      <line
        x1={0}
        y1={0}
        x2={Math.cos((hourAngle / 180) * Math.PI - Math.PI / 2) * (r * 0.45)}
        y2={Math.sin((hourAngle / 180) * Math.PI - Math.PI / 2) * (r * 0.45)}
        stroke={COLORS.white}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={0}
        y1={0}
        x2={Math.cos((minuteAngle / 180) * Math.PI - Math.PI / 2) * (r * 0.65)}
        y2={Math.sin((minuteAngle / 180) * Math.PI - Math.PI / 2) * (r * 0.65)}
        stroke={COLORS.accent}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={0} cy={0} r={2} fill={COLORS.accent} />
    </g>
  );
};
