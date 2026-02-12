import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import {COLORS} from '../theme';
import {Person} from '../illustrations/Person';
import {CelebrationParticles} from '../illustrations/CelebrationParticles';
import {FadeSlideIn} from '../components/AnimatedText';

// Animated task card that transforms from manual to automated
const TaskTransform: React.FC<{
  x: number;
  y: number;
  label: string;
  delay: number;
  index: number;
}> = ({x, y, label, delay, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({frame, fps, delay, config: {damping: 200}});
  const transform = spring({
    frame,
    fps,
    delay: delay + 15,
    config: {damping: 15, stiffness: 200},
  });

  // Color transitions from grey to success green
  const bgColor = interpolate(transform, [0, 1], [0, 1]);
  const borderColor = bgColor > 0.5 ? COLORS.successGreen : COLORS.grey;

  return (
    <g transform={`translate(${x}, ${y})`} opacity={entrance}>
      {/* Card */}
      <rect
        x={-70}
        y={-22}
        width={140}
        height={44}
        rx={10}
        fill={bgColor > 0.5 ? 'rgba(52,211,153,0.1)' : 'rgba(107,123,133,0.1)'}
        stroke={borderColor}
        strokeWidth={1.5}
      />

      {/* Icon area */}
      {bgColor < 0.5 ? (
        // Manual: paper icon
        <g transform="translate(-48, 0)">
          <rect x={-8} y={-10} width={16} height={20} rx={2} fill="none" stroke={COLORS.grey} strokeWidth={1.5} />
          <line x1={-4} y1={-4} x2={4} y2={-4} stroke={COLORS.grey} strokeWidth={1} />
          <line x1={-4} y1={0} x2={4} y2={0} stroke={COLORS.grey} strokeWidth={1} />
        </g>
      ) : (
        // Automated: checkmark with glow
        <g transform="translate(-48, 0)">
          <circle cx={0} cy={0} r={11} fill={COLORS.successGreen} opacity={0.2 * transform} />
          <circle cx={0} cy={0} r={8} fill={COLORS.successGreen} opacity={transform} />
          <polyline
            points="-3,1 -1,4 4,-2"
            stroke={COLORS.white}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            opacity={transform}
          />
        </g>
      )}

      {/* Label */}
      <text
        x={4}
        y={4}
        fontSize={12}
        fontFamily="Open Sans"
        fill={bgColor > 0.5 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)'}
      >
        {label}
      </text>

      {/* Speed indicator - each transform is faster */}
      {transform > 0.5 && (
        <text
          x={55}
          y={4}
          fontSize={10}
          fontFamily="Montserrat"
          fontWeight="bold"
          fill={COLORS.accent}
          opacity={transform}
        >
          ✓
        </text>
      )}
    </g>
  );
};

export const FirstWins: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Progress bar
  const progressWidth = interpolate(
    frame,
    [1 * fps, 6 * fps],
    [0, 100],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Person pose changes as wins accumulate
  const personPose = frame > 5.5 * fps ? 'celebrating' : frame > 2 * fps ? 'reaching' : 'standing';

  // Show celebration after all tasks transform
  const showCelebration = frame > 5.5 * fps;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.warmBg, opacity: exitOpacity}}>
      {/* Warm ambient glow */}
      <div
        style={{
          position: 'absolute',
          left: '30%',
          top: '40%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,128,0,0.08), transparent 70%)`,
        }}
      />

      {/* SVG Scene */}
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg
          viewBox="-400 -280 800 560"
          width={1920}
          height={1080}
          style={{position: 'absolute'}}
        >
          {/* Person */}
          <Person
            pose={personPose}
            x={-250}
            y={20}
            scale={1}
          />

          {/* Task cards that transform - each faster than the last */}
          <TaskTransform x={30} y={-120} label="Invoice processing" delay={Math.round(1 * fps)} index={0} />
          <TaskTransform x={30} y={-60} label="Lead assignment" delay={Math.round(2 * fps)} index={1} />
          <TaskTransform x={30} y={0} label="Report generation" delay={Math.round(2.8 * fps)} index={2} />
          <TaskTransform x={30} y={60} label="Email follow-ups" delay={Math.round(3.4 * fps)} index={3} />
          <TaskTransform x={30} y={120} label="Data entry" delay={Math.round(3.8 * fps)} index={4} />

          {/* Progress bar */}
          <g transform="translate(30, 170)">
            <rect x={-70} y={0} width={140} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
            <rect
              x={-70}
              y={0}
              width={progressWidth * 1.4}
              height={8}
              rx={4}
              fill={COLORS.accent}
              opacity={0.85}
            />
          </g>

          {/* Celebration */}
          {showCelebration && (
            <CelebrationParticles
              x={30}
              y={-30}
              delay={Math.round(5.5 * fps)}
              count={16}
            />
          )}
        </svg>
      </AbsoluteFill>

      {/* Text */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 100px 80px',
          zIndex: 2,
        }}
      >
        <Sequence from={Math.round(0.5 * fps)} layout="none">
          <FadeSlideIn
            text="Start small. Pick the task everyone hates."
            fontSize={26}
            fontFamily="Open Sans"
            fontWeight="400"
            color="rgba(255,255,255,0.75)"
            style={{marginBottom: 8}}
          />
        </Sequence>

        <Sequence from={Math.round(2 * fps)} layout="none">
          <FadeSlideIn
            text="Automate it. Watch the momentum build."
            fontSize={26}
            fontFamily="Open Sans"
            fontWeight="600"
            color={COLORS.accent}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
