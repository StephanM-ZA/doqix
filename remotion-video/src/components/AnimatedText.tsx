import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

type AnimatedTextProps = {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  delay?: number;
  style?: React.CSSProperties;
};

export const FadeSlideIn: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 48,
  color = '#FFFFFF',
  fontFamily = 'Montserrat',
  fontWeight = 'bold',
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: {damping: 200},
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily,
        fontWeight,
        opacity,
        transform: `translateY(${translateY}px)`,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const CountUp: React.FC<{
  target: number;
  suffix?: string;
  prefix?: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  fontFamily?: string;
}> = ({
  target,
  suffix = '',
  prefix = '',
  fontSize = 80,
  color = '#ff8000',
  delay = 0,
  fontFamily = 'Montserrat',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: {damping: 200},
    durationInFrames: 2 * fps,
  });

  const current = Math.round(interpolate(progress, [0, 1], [0, target]));

  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily,
        fontWeight: 'bold',
      }}
    >
      {prefix}{current}{suffix}
    </div>
  );
};

export const TypewriterText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  delay?: number;
  speed?: number;
}> = ({
  text,
  fontSize = 24,
  color = 'rgba(255,255,255,0.8)',
  fontFamily = 'Open Sans',
  delay = 0,
  speed = 2,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);
  const charsToShow = Math.min(Math.floor(adjustedFrame / speed), text.length);

  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily,
        lineHeight: 1.6,
        minHeight: fontSize * 1.6,
      }}
    >
      {text.slice(0, charsToShow)}
      {charsToShow < text.length && (
        <span
          style={{
            opacity: Math.round(frame / 15) % 2 === 0 ? 1 : 0,
            color: '#ff8000',
          }}
        >
          |
        </span>
      )}
    </div>
  );
};
