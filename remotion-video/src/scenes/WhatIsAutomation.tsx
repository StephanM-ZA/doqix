import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from 'remotion';
import {COLORS} from '../theme';
import {Person} from '../illustrations/Person';
import {Desk} from '../illustrations/Desk';
import {PaperStack} from '../illustrations/PaperStack';
import {GearSystem} from '../illustrations/GearSystem';
import {WorkflowPipeline} from '../illustrations/WorkflowPipeline';
import {FadeSlideIn} from '../components/AnimatedText';

export const WhatIsAutomation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Scene brightens as hope appears
  const warmth = interpolate(frame, [0, 3 * fps], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  // Orange glow entrance from right
  const glowSize = interpolate(warmth, [0, 1], [0, 800]);
  const glowOpacity = interpolate(warmth, [0, 1], [0, 0.12]);

  // Papers start dissolving
  const papersDissolving = frame > 4 * fps;

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: interpolate(warmth, [0, 1], [0, 1])
          ? COLORS.warmBg
          : COLORS.chaosBg,
        opacity: exitOpacity,
      }}
    >
      {/* Warm glow appearing from right */}
      <div
        style={{
          position: 'absolute',
          right: -200,
          top: '30%',
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,128,0,${glowOpacity}), transparent 70%)`,
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
          {/* Person looking up — curious */}
          <Person
            pose="looking-up"
            x={-220}
            y={20}
            scale={1}
          />

          {/* Remaining desk — getting cleaner */}
          <Desk x={-220} y={100} clean={frame > 5 * fps} />

          {/* Papers dissolving */}
          <PaperStack
            x={-140}
            y={75}
            count={4}
            dissolving={papersDissolving}
            delay={Math.round(4 * fps)}
          />

          {/* Gears appearing — automation concept */}
          {frame > 1.5 * fps && (
            <GearSystem
              x={200}
              y={-120}
              delay={Math.round(1.5 * fps)}
              spinning
            />
          )}

          {/* Workflow pipeline — the core concept */}
          {frame > 2.5 * fps && (
            <WorkflowPipeline
              x={120}
              y={80}
              delay={Math.round(2.5 * fps)}
              scale={0.85}
            />
          )}
        </svg>
      </AbsoluteFill>

      {/* Text overlays */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 100px 80px',
          zIndex: 2,
        }}
      >
        <Sequence from={Math.round(1 * fps)} layout="none">
          <FadeSlideIn
            text="What if there was a better way?"
            fontSize={32}
            color={COLORS.accent}
            fontWeight="600"
            style={{marginBottom: 16}}
          />
        </Sequence>

        <Sequence from={Math.round(3 * fps)} layout="none">
          <FadeSlideIn
            text="Automation connects your tools so work flows —"
            fontSize={22}
            fontFamily="Open Sans"
            fontWeight="400"
            color="rgba(255,255,255,0.75)"
            style={{marginBottom: 4}}
          />
        </Sequence>

        <Sequence from={Math.round(3.8 * fps)} layout="none">
          <FadeSlideIn
            text="without you pushing every button."
            fontSize={22}
            fontFamily="Open Sans"
            fontWeight="600"
            color={COLORS.teal}
            delay={Math.round(0.2 * fps)}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
