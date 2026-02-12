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
  SpreadsheetIcon,
  AccountingIcon,
  MessagingIcon,
} from '../illustrations/AppIcons';

/**
 * Scene 1 (0-12s): Hook — show the manual nightmare.
 * Category icons scattered, disconnected, with "copy-paste" arrows and frustration.
 */
export const WorkflowHook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Icons float in one by one
  const icons = [
    {Icon: EmailIcon, x: -260, y: -60, delay: 10, label: 'Email'},
    {Icon: SpreadsheetIcon, x: -80, y: -120, delay: 22, label: 'Spreadsheet'},
    {Icon: AccountingIcon, x: 100, y: -40, delay: 34, label: 'Accounting'},
    {Icon: MessagingIcon, x: 260, y: -100, delay: 46, label: 'Messaging'},
  ];

  // Disconnection "X" marks appear after icons
  const xMarkDelay = 3 * fps;
  const xProgress = spring({
    frame,
    fps,
    delay: xMarkDelay,
    config: {damping: 200},
  });

  // Manual arrow chaos
  const chaosArrows = [
    {x1: -210, y1: -50, x2: -130, y2: -110, d: 2.5 * fps},
    {x1: -30, y1: -110, x2: 50, y2: -30, d: 2.8 * fps},
    {x1: 150, y1: -30, x2: 210, y2: -90, d: 3.1 * fps},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.darkBg, opacity: exitOpacity}}>
      {/* Grid bg */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* SVG Scene */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg viewBox="-400 -250 800 500" width={1920} height={1080}>
          {/* App icons scattered */}
          {icons.map(({Icon, x, y, delay, label}, i) => {
            const s = spring({
              frame,
              fps,
              delay,
              config: {damping: 15, stiffness: 180},
            });
            const float = Math.sin((frame - delay) / 20 + i) * 5;
            return (
              <g
                key={i}
                transform={`translate(${x}, ${y + float}) scale(${s})`}
                opacity={s}
              >
                <circle cx={2} cy={3} r={32} fill="rgba(0,0,0,0.25)" />
                <Icon size={56} />
                <text
                  x={0}
                  y={46}
                  textAnchor="middle"
                  fontSize={12}
                  fontFamily="Open Sans"
                  fontWeight="600"
                  fill="rgba(255,255,255,0.7)"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Messy manual arrows */}
          {chaosArrows.map(({x1, y1, x2, y2, d}, i) => {
            const ap = interpolate(frame, [d, d + 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            if (ap <= 0) return null;
            const ex = interpolate(ap, [0, 1], [x1, x2]);
            const ey = interpolate(ap, [0, 1], [y1, y2]);
            return (
              <g key={i} opacity={0.4}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={ex}
                  y2={ey}
                  stroke={COLORS.errorRed}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />
                {ap > 0.9 && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 8}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="Open Sans"
                    fill={COLORS.errorRed}
                    opacity={0.7}
                  >
                    copy-paste
                  </text>
                )}
              </g>
            );
          })}

          {/* Disconnection "✕" marks on lines */}
          {xProgress > 0.3 &&
            chaosArrows.map(({x1, y1, x2, y2}, i) => {
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2;
              return (
                <g key={`x-${i}`} opacity={xProgress * 0.8}>
                  <circle cx={mx} cy={my + 5} r={8} fill={COLORS.errorRed} opacity={0.9} />
                  <line x1={mx - 3} y1={my + 2} x2={mx + 3} y2={my + 8} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
                  <line x1={mx + 3} y1={my + 2} x2={mx - 3} y2={my + 8} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
                </g>
              );
            })}

          {/* Big frustration stat */}
          {frame > 5 * fps && (
            <g opacity={interpolate(frame, [5 * fps, 5.5 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
              <text
                x={0}
                y={140}
                textAnchor="middle"
                fontSize={16}
                fontFamily="Open Sans"
                fill={COLORS.grey}
              >
                Manual. Disconnected. Error-prone.
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
          alignItems: 'center',
          padding: '0 100px 70px',
          zIndex: 2,
        }}
      >
        <Sequence from={Math.round(0.5 * fps)} layout="none">
          <FadeSlideIn
            text="Your tools don't talk to each other."
            fontSize={34}
            color={COLORS.white}
            fontWeight="bold"
            style={{textAlign: 'center', marginBottom: 8}}
          />
        </Sequence>
        <Sequence from={Math.round(6 * fps)} layout="none">
          <FadeSlideIn
            text="What if they could?"
            fontSize={28}
            color={COLORS.accent}
            fontWeight="600"
            style={{textAlign: 'center'}}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
