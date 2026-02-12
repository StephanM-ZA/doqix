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
import {WorkflowPipeline} from '../illustrations/WorkflowPipeline';
import {FadeSlideIn} from '../components/AnimatedText';

// Mini vignette: a workflow example
const Vignette: React.FC<{
  fromIcon: string;
  fromLabel: string;
  toIcon: string;
  toLabel: string;
  color: string;
  delay: number;
}> = ({fromIcon, fromLabel, toIcon, toLabel, color, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({frame, fps, delay, config: {damping: 200}});
  const arrowProgress = spring({
    frame,
    fps,
    delay: delay + 15,
    config: {damping: 200},
  });

  return (
    <g opacity={entrance}>
      {/* From box */}
      <g transform={`translate(-90, 0) scale(${entrance})`}>
        <rect x={-50} y={-25} width={100} height={50} rx={10} fill="#0F2430" stroke={color} strokeWidth={1.5} />
        <text x={0} y={-2} textAnchor="middle" fontSize={18}>{fromIcon}</text>
        <text x={0} y={16} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.6)" fontFamily="Open Sans">{fromLabel}</text>
      </g>

      {/* Arrow */}
      <g opacity={arrowProgress}>
        <line x1={-30} y1={0} x2={30} y2={0} stroke={color} strokeWidth={2} strokeDasharray="5 3" />
        <polygon points="28,-5 38,0 28,5" fill={color} />
      </g>

      {/* To box */}
      <g transform={`translate(90, 0) scale(${entrance})`}>
        <rect x={-50} y={-25} width={100} height={50} rx={10} fill="#0F2430" stroke={COLORS.successGreen} strokeWidth={1.5} />
        <text x={0} y={-2} textAnchor="middle" fontSize={18}>{toIcon}</text>
        <text x={0} y={16} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.6)" fontFamily="Open Sans">{toLabel}</text>
      </g>

      {/* Checkmark appears */}
      {arrowProgress > 0.8 && (
        <g transform="translate(140, -20)" opacity={arrowProgress}>
          <circle cx={0} cy={0} r={10} fill={COLORS.successGreen} opacity={0.9} />
          <polyline
            points="-4,0 -1,4 5,-3"
            stroke={COLORS.white}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
};

export const AnatomyOfAutomation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.warmBg, opacity: exitOpacity}}>
      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '20%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.accentGlow}, transparent 70%)`,
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
          {/* Main pipeline at top */}
          <WorkflowPipeline x={0} y={-180} delay={0} scale={0.9} />

          {/* Three vignettes stacked */}
          <g transform="translate(0, -40)">
            <Vignette
              fromIcon="📧"
              fromLabel="Invoice arrives"
              toIcon="📂"
              toLabel="Auto-filed"
              color={COLORS.accent}
              delay={Math.round(2 * fps)}
            />
          </g>

          <g transform="translate(0, 50)">
            <Vignette
              fromIcon="👤"
              fromLabel="New lead"
              toIcon="📊"
              toLabel="CRM updated"
              color={COLORS.teal}
              delay={Math.round(3.5 * fps)}
            />
          </g>

          <g transform="translate(0, 140)">
            <Vignette
              fromIcon="📅"
              fromLabel="Report due"
              toIcon="📈"
              toLabel="Dashboard live"
              color={COLORS.action}
              delay={Math.round(5 * fps)}
            />
          </g>
        </svg>
      </AbsoluteFill>

      {/* Text */}
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
            text="Trigger → Rule → Action"
            fontSize={18}
            color={COLORS.teal}
            fontWeight="600"
            style={{letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8}}
          />
        </Sequence>

        <Sequence from={Math.round(0.5 * fps)} layout="none">
          <FadeSlideIn
            text="The anatomy of every automation"
            fontSize={36}
            color={COLORS.white}
            fontWeight="bold"
            style={{textAlign: 'center'}}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
