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
import {Desk} from '../illustrations/Desk';
import {Dashboard} from '../illustrations/Dashboard';
import {FadeSlideIn} from '../components/AnimatedText';

// Floating rule card
const RuleCard: React.FC<{
  icon: string;
  text: string;
  delay: number;
  yOffset: number;
}> = ({icon, text, delay, yOffset}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: {damping: 15, stiffness: 200},
  });

  const float = Math.sin((frame - delay) / 25) * 4;

  return (
    <g
      transform={`translate(0, ${yOffset + float}) scale(${entrance})`}
      opacity={entrance}
    >
      {/* Card bg with glow */}
      <rect
        x={-130}
        y={-20}
        width={260}
        height={40}
        rx={10}
        fill="rgba(255,128,0,0.06)"
        stroke={COLORS.accent}
        strokeWidth={1}
        opacity={0.8}
      />
      {/* Icon */}
      <text x={-110} y={6} fontSize={18}>{icon}</text>
      {/* Text */}
      <text
        x={-85}
        y={5}
        fontSize={13}
        fontFamily="Open Sans"
        fontWeight="600"
        fill="rgba(255,255,255,0.85)"
      >
        {text}
      </text>
    </g>
  );
};

export const RulesForSuccess: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Background pulse
  const pulse = Math.sin(frame / 30) * 0.02 + 0.98;

  // CTA entrance
  const ctaEntrance = spring({
    frame,
    fps,
    delay: Math.round(5 * fps),
    config: {damping: 200},
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.warmBg}}>
      {/* Rich warm glow */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 500px 350px at 35% 50%, rgba(255,128,0,${0.1 * pulse}), transparent),
            radial-gradient(ellipse 400px 300px at 70% 60%, rgba(77,217,180,0.06), transparent)
          `,
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
          {/* Clean desk with dashboard */}
          <Desk x={-200} y={80} clean />

          {/* Person standing tall, confident */}
          <Person
            pose="standing"
            x={-200}
            y={-10}
            scale={1.1}
          />

          {/* Dashboard floating beside */}
          <Dashboard x={120} y={-60} delay={Math.round(0.5 * fps)} />

          {/* Three golden rules floating on right */}
          <g transform="translate(120, 100)">
            <RuleCard
              icon="⚡"
              text="Optimize first, then automate"
              delay={Math.round(2 * fps)}
              yOffset={0}
            />
            <RuleCard
              icon="🤝"
              text="Keep humans in the loop"
              delay={Math.round(2.6 * fps)}
              yOffset={55}
            />
            <RuleCard
              icon="📈"
              text="Measure, iterate, scale"
              delay={Math.round(3.2 * fps)}
              yOffset={110}
            />
          </g>
        </svg>
      </AbsoluteFill>

      {/* Text overlays */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '50px 100px',
          zIndex: 2,
        }}
      >
        <Sequence from={0} layout="none">
          <FadeSlideIn
            text="Focus on what humans do best"
            fontSize={40}
            color={COLORS.white}
            fontWeight="bold"
            style={{textAlign: 'center', marginBottom: 8}}
          />
        </Sequence>

        <Sequence from={Math.round(0.5 * fps)} layout="none">
          <FadeSlideIn
            text="Innovation. Strategy. Creating value."
            fontSize={22}
            fontFamily="Open Sans"
            color={COLORS.teal}
            fontWeight="600"
            style={{textAlign: 'center'}}
          />
        </Sequence>
      </AbsoluteFill>

      {/* CTA at bottom */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0 100px 70px',
          zIndex: 2,
        }}
      >
        <Sequence from={Math.round(5 * fps)} layout="none">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              opacity: ctaEntrance,
              transform: `translateY(${interpolate(ctaEntrance, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* DO.QIX wordmark */}
            <div
              style={{
                fontFamily: 'Montserrat',
                fontWeight: 700,
                fontSize: 20,
                color: COLORS.accent,
                letterSpacing: 4,
                marginBottom: 8,
              }}
            >
              DO.QIX
            </div>

            {/* CTA button */}
            <div
              style={{
                padding: '14px 36px',
                borderRadius: 8,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.action})`,
                fontFamily: 'Montserrat',
                fontWeight: 700,
                fontSize: 18,
                color: COLORS.white,
                boxShadow: `0 4px 24px rgba(255,128,0,0.3)`,
              }}
            >
              Get Your Free Automation Plan
            </div>

            <div
              style={{
                fontFamily: 'Open Sans',
                fontSize: 14,
                color: 'rgba(255,255,255,0.4)',
                marginTop: 4,
              }}
            >
              doqix.co.za
            </div>
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
