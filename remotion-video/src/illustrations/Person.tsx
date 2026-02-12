import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {COLORS} from '../theme';

type PersonProps = {
  pose: 'slumped' | 'looking-up' | 'standing' | 'reaching' | 'celebrating';
  x?: number;
  y?: number;
  scale?: number;
  delay?: number;
};

export const Person: React.FC<PersonProps> = ({
  pose,
  x = 0,
  y = 0,
  scale = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({frame, fps, delay, config: {damping: 200}});

  // Subtle idle breathing animation
  const breathe = Math.sin((frame - delay) / 20) * 2;

  // Pose-specific transforms
  const headTilt = pose === 'slumped' ? 8 : pose === 'looking-up' ? -12 : 0;
  const bodySlump = pose === 'slumped' ? 5 : 0;
  const armRaise =
    pose === 'reaching' ? -30 : pose === 'celebrating' ? -50 : 0;
  const bodyHeight = pose === 'standing' || pose === 'celebrating' ? -20 : 0;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale * entrance})`}
      opacity={entrance}
    >
      {/* Body */}
      <g transform={`translate(0, ${bodySlump + bodyHeight + breathe})`}>
        {/* Torso */}
        <rect
          x={-20}
          y={0}
          width={40}
          height={50}
          rx={12}
          fill={COLORS.action}
          opacity={0.9}
        />

        {/* Left arm */}
        <rect
          x={-30}
          y={5}
          width={12}
          height={35}
          rx={6}
          fill={COLORS.action}
          opacity={0.7}
          transform={`rotate(${armRaise}, -24, 5)`}
        />

        {/* Right arm */}
        <rect
          x={18}
          y={5}
          width={12}
          height={35}
          rx={6}
          fill={COLORS.action}
          opacity={0.7}
          transform={`rotate(${-armRaise}, 24, 5)`}
        />

        {/* Legs */}
        <rect x={-14} y={48} width={12} height={30} rx={6} fill="#1A3A4A" />
        <rect x={2} y={48} width={12} height={30} rx={6} fill="#1A3A4A" />
      </g>

      {/* Head */}
      <g
        transform={`translate(0, ${-30 + bodySlump + bodyHeight + breathe}) rotate(${headTilt})`}
      >
        <circle cx={0} cy={0} r={22} fill="#F5C6A0" />
        {/* Hair */}
        <ellipse cx={0} cy={-12} rx={24} ry={14} fill="#3A2820" />
        {/* Eyes */}
        <circle cx={-7} cy={2} r={2.5} fill="#0D2028" />
        <circle cx={7} cy={2} r={2.5} fill="#0D2028" />
        {/* Mouth - changes with pose */}
        {pose === 'slumped' && (
          <path
            d="M -6 10 Q 0 7 6 10"
            stroke="#0D2028"
            strokeWidth={2}
            fill="none"
          />
        )}
        {(pose === 'looking-up' || pose === 'standing') && (
          <line
            x1={-4}
            y1={9}
            x2={4}
            y2={9}
            stroke="#0D2028"
            strokeWidth={2}
          />
        )}
        {(pose === 'reaching' || pose === 'celebrating') && (
          <path
            d="M -6 8 Q 0 13 6 8"
            stroke="#0D2028"
            strokeWidth={2}
            fill="none"
          />
        )}
      </g>

      {/* Celebration particles */}
      {pose === 'celebrating' &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const dist = 40 + Math.sin(frame / 8 + i) * 10;
          return (
            <circle
              key={i}
              cx={Math.cos(angle) * dist}
              cy={-50 + Math.sin(angle) * dist}
              r={3}
              fill={i % 2 === 0 ? COLORS.accent : COLORS.teal}
              opacity={0.8}
            />
          );
        })}
    </g>
  );
};
