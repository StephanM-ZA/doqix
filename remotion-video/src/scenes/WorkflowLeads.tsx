import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import {COLORS, FPS} from '../theme';
import {FadeSlideIn} from '../components/AnimatedText';
import {WebFormIcon, MessagingIcon, CrmIcon, SpreadsheetIcon} from '../illustrations/AppIcons';
import {AppNode} from '../illustrations/AppNode';
import {DataParticle, ConnectionLine} from '../illustrations/DataParticle';

/**
 * Scene 3 (28-44s): Workflow 2 — New lead via web form,
 * auto-response on Messaging, CRM entry, Spreadsheet tracking.
 */
export const WorkflowLeads: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Layout — diamond/hub shape with form in center
  const nodes = [
    {x: 0, y: -100, label: 'Web Form', Icon: WebFormIcon, color: '#0D9488', delay: 0},
    {x: -200, y: 40, label: 'Messaging', Icon: MessagingIcon, color: '#25D366', delay: 18},
    {x: 0, y: 120, label: 'CRM', Icon: CrmIcon, color: '#6366F1', delay: 30},
    {x: 200, y: 40, label: 'Spreadsheet', Icon: SpreadsheetIcon, color: '#0F9D58', delay: 42},
  ];

  // Step labels
  const steps = [
    {text: '👤 New lead submitted', frame: 1.5 * fps},
    {text: '💬 Welcome message sent', frame: 4 * fps},
    {text: '📋 Contact created in CRM', frame: 6.5 * fps},
    {text: '📊 Lead logged in tracker', frame: 9 * fps},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.darkBg, opacity: exitOpacity}}>
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(77,217,180,0.06), transparent 70%)`,
        }}
      />

      <svg
        viewBox="-400 -220 800 440"
        width={1920}
        height={1080}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        {/* Automation hub in center */}
        {(() => {
          const hubEntrance = spring({frame, fps, delay: 8, config: {damping: 200}});
          return (
            <g transform={`translate(0, 20) scale(${hubEntrance * 0.6})`} opacity={hubEntrance * 0.4}>
              <circle cx={0} cy={0} r={160} fill="none" stroke={COLORS.accent} strokeWidth={1} strokeDasharray="10 8" opacity={0.3} />
              <text x={0} y={5} textAnchor="middle" fontSize={10} fontFamily="Open Sans" fill={COLORS.accent} opacity={0.5}>
                automation orchestrating
              </text>
            </g>
          );
        })()}

        {/* Connection lines from form to each target */}
        <ConnectionLine x1={0} y1={-50} x2={-150} y2={20} delay={20} color="rgba(37,211,102,0.3)" />
        <ConnectionLine x1={0} y1={-50} x2={0} y2={70} delay={32} color="rgba(99,102,241,0.3)" />
        <ConnectionLine x1={0} y1={-50} x2={150} y2={20} delay={44} color="rgba(15,157,88,0.3)" />

        {/* App nodes */}
        {nodes.map(({x, y, label, Icon, color, delay}, i) => (
          <AppNode
            key={i}
            x={x}
            y={y}
            label={label}
            icon={<Icon size={52} />}
            delay={delay}
            glowColor={color}
            active={
              (i === 0 && frame > 1.5 * fps) ||
              (i === 1 && frame > 4 * fps) ||
              (i === 2 && frame > 6.5 * fps) ||
              (i === 3 && frame > 9 * fps)
            }
          />
        ))}

        {/* Data particles fanning out from form */}
        <DataParticle
          x1={0} y1={-50}
          x2={-150} y2={20}
          startFrame={Math.round(2.5 * fps)}
          durationFrames={Math.round(1.2 * fps)}
          color="#25D366"
          label="lead info"
        />
        <DataParticle
          x1={0} y1={-50}
          x2={0} y2={70}
          startFrame={Math.round(5 * fps)}
          durationFrames={Math.round(1.2 * fps)}
          color="#6366F1"
          label="contact"
        />
        <DataParticle
          x1={0} y1={-50}
          x2={150} y2={20}
          startFrame={Math.round(7.5 * fps)}
          durationFrames={Math.round(1.2 * fps)}
          color="#0F9D58"
          label="row data"
        />

        {/* Step labels floating */}
        {steps.map(({text, frame: f}, i) => {
          const opacity = interpolate(
            frame,
            [f, f + 10, f + 2.5 * fps, f + 3 * fps],
            [0, 1, 1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          );
          const tx = i === 0 ? 160 : i === 1 ? -200 : i === 2 ? -160 : 200;
          const ty = i === 0 ? -100 : i === 1 ? -20 : i === 2 ? 170 : -20;
          return (
            <text
              key={i}
              x={tx}
              y={ty}
              textAnchor={i === 1 ? 'end' : 'start'}
              fontSize={12}
              fontFamily="Open Sans"
              fontWeight="600"
              fill={nodes[i].color}
              opacity={opacity}
            >
              {text}
            </text>
          );
        })}
      </svg>

      {/* Title */}
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
            text="Workflow: Lead Nurturing"
            fontSize={16}
            color={COLORS.teal}
            fontWeight="600"
            style={{letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6}}
          />
        </Sequence>
        <Sequence from={Math.round(0.3 * fps)} layout="none">
          <FadeSlideIn
            text="Form → Messaging → CRM → Spreadsheet"
            fontSize={30}
            color={COLORS.white}
            fontWeight="bold"
            style={{textAlign: 'center'}}
          />
        </Sequence>
      </AbsoluteFill>

      {/* Bottom tag */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          padding: '0 0 65px',
          zIndex: 2,
        }}
      >
        <Sequence from={Math.round(10 * fps)} layout="none">
          <FadeSlideIn
            text="Every lead, instantly handled."
            fontSize={22}
            color={COLORS.accent}
            fontWeight="600"
            style={{textAlign: 'center'}}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
