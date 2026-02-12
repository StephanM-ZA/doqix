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
import {EmailIcon, AccountingIcon, SpreadsheetIcon, NotificationsIcon} from '../illustrations/AppIcons';
import {AppNode} from '../illustrations/AppNode';
import {DataParticle, ConnectionLine} from '../illustrations/DataParticle';

/**
 * Scene 2 (12-28s): Workflow 1 — Invoice arrives via email,
 * data flows into Accounting, then Spreadsheet, then Notifications.
 */
export const WorkflowInvoice: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Layout — 4 nodes in a horizontal flow
  const nodes = [
    {x: -280, y: 0, label: 'Email', Icon: EmailIcon, color: '#EA4335', delay: 0},
    {x: -90, y: 0, label: 'Accounting', Icon: AccountingIcon, color: '#13B5EA', delay: 12},
    {x: 100, y: 0, label: 'Spreadsheet', Icon: SpreadsheetIcon, color: '#0F9D58', delay: 24},
    {x: 280, y: 0, label: 'Notifications', Icon: NotificationsIcon, color: '#8B5CF6', delay: 36},
  ];

  // Step labels appear as data flows through
  const steps = [
    {text: '📧 Invoice received', frame: 2 * fps, y: -110},
    {text: '✓ Auto-logged in accounts', frame: 4.5 * fps, y: -110},
    {text: '📊 Row added to tracker', frame: 7 * fps, y: -110},
    {text: '🔔 Team notified instantly', frame: 9.5 * fps, y: -110},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.darkBg, opacity: exitOpacity}}>
      {/* Subtle glow behind pipeline */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(255,128,0,0.05), transparent 70%)`,
        }}
      />

      <svg
        viewBox="-400 -220 800 440"
        width={1920}
        height={1080}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        {/* Connection lines */}
        <ConnectionLine x1={-230} y1={0} x2={-140} y2={0} delay={15} color="rgba(255,255,255,0.12)" />
        <ConnectionLine x1={-40} y1={0} x2={50} y2={0} delay={27} color="rgba(255,255,255,0.12)" />
        <ConnectionLine x1={150} y1={0} x2={230} y2={0} delay={39} color="rgba(255,255,255,0.12)" />

        {/* App nodes */}
        {nodes.map(({x, y, label, Icon, color, delay}, i) => (
          <AppNode
            key={i}
            x={x}
            y={y}
            label={label}
            icon={<Icon size={56} />}
            delay={delay}
            glowColor={color}
            active={
              (i === 0 && frame > 2 * fps) ||
              (i === 1 && frame > 4 * fps) ||
              (i === 2 && frame > 6.5 * fps) ||
              (i === 3 && frame > 9 * fps)
            }
          />
        ))}

        {/* Data particles flowing between nodes */}
        <DataParticle
          x1={-230} y1={0}
          x2={-140} y2={0}
          startFrame={Math.round(2.5 * fps)}
          durationFrames={Math.round(1.5 * fps)}
          color="#EA4335"
          label="invoice.pdf"
        />
        <DataParticle
          x1={-40} y1={0}
          x2={50} y2={0}
          startFrame={Math.round(5 * fps)}
          durationFrames={Math.round(1.5 * fps)}
          color="#13B5EA"
          label="R12,450"
        />
        <DataParticle
          x1={150} y1={0}
          x2={230} y2={0}
          startFrame={Math.round(7.5 * fps)}
          durationFrames={Math.round(1.5 * fps)}
          color="#0F9D58"
          label="row #47"
        />

        {/* Step labels */}
        {steps.map(({text, frame: f, y: sy}, i) => {
          const opacity = interpolate(
            frame,
            [f, f + 10, f + 3 * fps, f + 3.5 * fps],
            [0, 1, 1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          );
          return (
            <text
              key={i}
              x={nodes[i].x}
              y={sy}
              textAnchor="middle"
              fontSize={13}
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

      {/* Title overlay */}
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
            text="Workflow: Invoice Processing"
            fontSize={16}
            color={COLORS.teal}
            fontWeight="600"
            style={{letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6}}
          />
        </Sequence>
        <Sequence from={Math.round(0.3 * fps)} layout="none">
          <FadeSlideIn
            text="Email → Accounting → Spreadsheet → Notify"
            fontSize={30}
            color={COLORS.white}
            fontWeight="bold"
            style={{textAlign: 'center'}}
          />
        </Sequence>
      </AbsoluteFill>

      {/* "Zero manual effort" badge */}
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
            text="Zero manual effort. Every time."
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
