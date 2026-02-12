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
import {
  EmailIcon,
  AccountingIcon,
  SpreadsheetIcon,
  MessagingIcon,
  AutomationIcon,
  CrmIcon,
  NotificationsIcon,
  DatabaseIcon,
} from '../illustrations/AppIcons';
import {AppNode} from '../illustrations/AppNode';
import {DataParticle, ConnectionLine} from '../illustrations/DataParticle';

/**
 * Scene 4 (44-60s): The full connected ecosystem + CTA.
 * All category apps orbiting around Automation hub, data flowing everywhere.
 */
export const WorkflowBigPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Layout: Automation center, 7 categories orbiting
  const orbit = [
    {angle: -90, Icon: EmailIcon, label: 'Email', color: '#EA4335'},
    {angle: -39, Icon: AccountingIcon, label: 'Accounting', color: '#13B5EA'},
    {angle: 12, Icon: SpreadsheetIcon, label: 'Spreadsheet', color: '#0F9D58'},
    {angle: 64, Icon: MessagingIcon, label: 'Messaging', color: '#25D366'},
    {angle: 116, Icon: CrmIcon, label: 'CRM', color: '#6366F1'},
    {angle: 167, Icon: NotificationsIcon, label: 'Notifications', color: '#8B5CF6'},
    {angle: 219, Icon: DatabaseIcon, label: 'Database', color: '#1E40AF'},
  ];

  const orbitRadius = 180;

  // Orbit spin — very slow rotation
  const spin = interpolate(frame, [0, durationInFrames], [0, 15], {
    extrapolateRight: 'clamp',
  });

  // Center hub entrance
  const hubScale = spring({frame, fps, delay: 0, config: {damping: 15, stiffness: 160}});

  // Connection lines draw in
  const linesDelay = 15;

  // CTA entrance
  const ctaDelay = Math.round(10 * fps);
  const ctaEntrance = spring({frame, fps, delay: ctaDelay, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.darkBg}}>
      {/* Warm glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,128,0,0.07), transparent 60%)`,
        }}
      />

      <svg
        viewBox="-400 -280 800 560"
        width={1920}
        height={1080}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        {/* Orbit ring */}
        <circle
          cx={0}
          cy={0}
          r={orbitRadius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1.5}
          opacity={hubScale}
        />

        {/* Connection lines from center to each app */}
        {orbit.map(({angle, color}, i) => {
          const rad = ((angle + spin) / 180) * Math.PI;
          const ax = Math.cos(rad) * orbitRadius;
          const ay = Math.sin(rad) * orbitRadius;
          return (
            <ConnectionLine
              key={`line-${i}`}
              x1={0}
              y1={0}
              x2={ax}
              y2={ay}
              delay={linesDelay + i * 4}
              color={`${color}30`}
            />
          );
        })}

        {/* Center Automation hub */}
        <g transform={`scale(${hubScale})`} opacity={hubScale}>
          <circle cx={0} cy={0} r={42} fill="rgba(255,109,90,0.08)" />
          <AppNode
            x={0}
            y={0}
            label="Automation"
            icon={<AutomationIcon size={62} />}
            delay={0}
            glowColor="#FF6D5A"
            active={frame > 1 * fps}
            size={62}
          />
        </g>

        {/* Orbiting category nodes */}
        {orbit.map(({angle, Icon, label, color}, i) => {
          const rad = ((angle + spin) / 180) * Math.PI;
          const ax = Math.cos(rad) * orbitRadius;
          const ay = Math.sin(rad) * orbitRadius;
          return (
            <AppNode
              key={i}
              x={ax}
              y={ay}
              label={label}
              icon={<Icon size={48} />}
              delay={8 + i * 5}
              glowColor={color}
              active={frame > (3 + i * 1) * fps}
              size={48}
            />
          );
        })}

        {/* Cycling data particles */}
        {orbit.map(({angle, color}, i) => {
          const cycleStart = Math.round((3 + i * 1.3) * fps);
          const rad = ((angle + spin) / 180) * Math.PI;
          const ax = Math.cos(rad) * orbitRadius;
          const ay = Math.sin(rad) * orbitRadius;

          return (
            <React.Fragment key={`p-${i}`}>
              <DataParticle
                x1={0} y1={0}
                x2={ax} y2={ay}
                startFrame={cycleStart}
                durationFrames={Math.round(1 * fps)}
                color={color}
                size={5}
              />
              <DataParticle
                x1={ax} y1={ay}
                x2={0} y2={0}
                startFrame={cycleStart + Math.round(1.5 * fps)}
                durationFrames={Math.round(1 * fps)}
                color={color}
                size={4}
              />
            </React.Fragment>
          );
        })}

        {/* "Connected" badge */}
        {frame > 8 * fps && (
          <g opacity={interpolate(frame, [8 * fps, 8.5 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
            <rect x={-60} y={orbitRadius + 55} width={120} height={26} rx={13} fill={COLORS.successGreen} opacity={0.15} />
            <text
              x={0}
              y={orbitRadius + 72}
              textAnchor="middle"
              fontSize={12}
              fontFamily="Montserrat"
              fontWeight="bold"
              fill={COLORS.successGreen}
            >
              ALL CONNECTED
            </text>
          </g>
        )}
      </svg>

      {/* Title */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '40px 100px',
          zIndex: 2,
        }}
      >
        <Sequence from={Math.round(0.5 * fps)} layout="none">
          <FadeSlideIn
            text="Your entire business, connected."
            fontSize={36}
            color={COLORS.white}
            fontWeight="bold"
            style={{textAlign: 'center', marginBottom: 6}}
          />
        </Sequence>
        <Sequence from={Math.round(1.5 * fps)} layout="none">
          <FadeSlideIn
            text="Automated workflows. Built by Do.Qix."
            fontSize={20}
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
          padding: '0 100px 55px',
          zIndex: 2,
        }}
      >
        <Sequence from={ctaDelay} layout="none">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              opacity: ctaEntrance,
              transform: `translateY(${interpolate(ctaEntrance, [0, 1], [25, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: 'Montserrat',
                fontWeight: 700,
                fontSize: 18,
                color: COLORS.accent,
                letterSpacing: 4,
              }}
            >
              DO.QIX
            </div>
            <div
              style={{
                padding: '14px 40px',
                borderRadius: 8,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.action})`,
                fontFamily: 'Montserrat',
                fontWeight: 700,
                fontSize: 18,
                color: COLORS.white,
                boxShadow: '0 4px 24px rgba(255,128,0,0.3)',
              }}
            >
              Get Your Free Automation Plan
            </div>
            <div
              style={{
                fontFamily: 'Open Sans',
                fontSize: 14,
                color: 'rgba(255,255,255,0.4)',
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
