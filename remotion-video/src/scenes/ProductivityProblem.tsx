import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  Easing,
} from 'remotion';
import {COLORS} from '../theme';
import {Person} from '../illustrations/Person';
import {Desk} from '../illustrations/Desk';
import {PaperStack} from '../illustrations/PaperStack';
import {ClockFace} from '../illustrations/ClockFace';
import {ErrorPopups} from '../illustrations/ErrorPopups';
import {FadeSlideIn, CountUp} from '../components/AnimatedText';

export const ProductivityProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Scene darkens over time — frustration building
  const gloom = interpolate(frame, [0, 4 * fps], [0, 0.15], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  // Exit fade
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Clock accelerates
  const clockSpeed = interpolate(frame, [0, 5 * fps], [1, 6], {
    extrapolateRight: 'clamp',
  });

  // Email counter
  const emailCount = Math.min(
    Math.floor(interpolate(frame, [fps, 5 * fps], [3, 47], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })),
    47,
  );

  // Paper stacks grow over time
  const paperCount = Math.min(
    Math.floor(interpolate(frame, [0, 4 * fps], [1, 6], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })),
    6,
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.chaosBg, opacity: exitOpacity}}>
      {/* Darkening overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0,0,0,${gloom})`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* SVG Scene */}
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg
          viewBox="-400 -300 800 600"
          width={1920}
          height={1080}
          style={{position: 'absolute'}}
        >
          {/* Desk */}
          <Desk x={0} y={80} />

          {/* Person — starts normal, becomes slumped */}
          <Person
            pose={frame > 4 * fps ? 'slumped' : 'standing'}
            x={-160}
            y={0}
            scale={1.1}
          />

          {/* Paper stacks growing */}
          <PaperStack x={100} y={-5} count={paperCount} growing delay={10} />
          <PaperStack x={-80} y={-5} count={Math.max(0, paperCount - 2)} growing delay={30} />

          {/* Clock speeding up */}
          <ClockFace x={250} y={-180} speed={clockSpeed} size={60} />

          {/* Error popups accumulating */}
          <ErrorPopups x={80} y={-180} count={Math.min(Math.floor(frame / 30), 5)} delay={20} />

          {/* Email counter */}
          {frame > fps && (
            <g transform="translate(-250, -180)">
              <rect x={-30} y={-18} width={60} height={36} rx={8} fill="#1A2E38" stroke={COLORS.grey} strokeWidth={1} />
              {/* Envelope icon */}
              <rect x={-12} y={-6} width={24} height={14} rx={2} fill="none" stroke={COLORS.grey} strokeWidth={1.5} />
              <polyline points="-12,-6 0,4 12,-6" fill="none" stroke={COLORS.grey} strokeWidth={1.5} />
              {/* Badge */}
              <circle cx={14} cy={-10} r={9} fill={COLORS.errorRed} />
              <text x={14} y={-6} textAnchor="middle" fontSize={9} fontWeight="bold" fill={COLORS.white} fontFamily="Montserrat">
                {emailCount}
              </text>
            </g>
          )}
        </svg>
      </AbsoluteFill>

      {/* Text overlays */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 100px 100px',
          zIndex: 2,
        }}
      >
        <Sequence from={Math.round(1 * fps)} layout="none">
          <FadeSlideIn
            text="You didn't start your business to chase spreadsheets."
            fontSize={28}
            fontFamily="Open Sans"
            fontWeight="400"
            color="rgba(255,255,255,0.75)"
            style={{marginBottom: 16, fontStyle: 'italic'}}
          />
        </Sequence>

        <Sequence from={Math.round(3.5 * fps)} layout="none">
          <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
            <CountUp
              target={30}
              suffix="%"
              fontSize={64}
              color={COLORS.accent}
              delay={Math.round(0.3 * fps)}
            />
            <FadeSlideIn
              text="of your week — lost to repetitive tasks"
              fontSize={24}
              fontFamily="Open Sans"
              fontWeight="600"
              color="rgba(255,255,255,0.6)"
              delay={Math.round(0.8 * fps)}
            />
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
