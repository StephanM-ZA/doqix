import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

type PaperStackProps = {
  x?: number;
  y?: number;
  count: number;
  growing?: boolean;
  dissolving?: boolean;
  delay?: number;
};

export const PaperStack: React.FC<PaperStackProps> = ({
  x = 0,
  y = 0,
  count,
  growing = false,
  dissolving = false,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({length: count}).map((_, i) => {
        let paperScale = 1;
        let paperOpacity = 1;

        if (growing) {
          const growDelay = delay + i * 8;
          paperScale = spring({
            frame,
            fps,
            delay: growDelay,
            config: {damping: 15, stiffness: 200},
          });
          paperOpacity = interpolate(paperScale, [0, 0.5], [0, 1], {
            extrapolateRight: 'clamp',
          });
        }

        if (dissolving) {
          const dissolveDelay = delay + i * 5;
          const dissolve = spring({
            frame,
            fps,
            delay: dissolveDelay,
            config: {damping: 200},
          });
          paperOpacity = 1 - dissolve;
          paperScale = 1 + dissolve * 0.3;
        }

        const wobble = Math.sin(frame / 15 + i * 2) * 1.5;
        const rotation = (i % 2 === 0 ? -3 : 3) + wobble;

        return (
          <g
            key={i}
            transform={`translate(0, ${-i * 5}) rotate(${rotation}) scale(${paperScale})`}
            opacity={paperOpacity}
          >
            <rect
              x={-15}
              y={-20}
              width={30}
              height={38}
              rx={2}
              fill="#E8E8E8"
              stroke="#D0D0D0"
              strokeWidth={0.5}
            />
            {/* Text lines on paper */}
            <rect x={-10} y={-14} width={18} height={2} rx={1} fill="#C0C0C0" />
            <rect x={-10} y={-8} width={14} height={2} rx={1} fill="#C0C0C0" />
            <rect x={-10} y={-2} width={20} height={2} rx={1} fill="#C0C0C0" />
          </g>
        );
      })}
    </g>
  );
};
