// Do.Qix Brand Theme
export const COLORS = {
  ink: '#0D2028',
  accent: '#ff8000',
  action: '#0886B5',
  teal: '#4DD9B4',
  white: '#FFFFFF',
  muted: 'rgba(13,32,40,0.60)',
  line: 'rgba(13,32,40,0.12)',
  darkBg: '#0A1A22',
  chaosBg: '#0C1820',
  warmBg: '#12252E',
  successGreen: '#34D399',
  errorRed: '#EF4444',
  grey: '#6B7B85',
  accentGlow: 'rgba(255, 128, 0, 0.15)',
  actionGlow: 'rgba(8, 134, 181, 0.15)',
} as const;

export const FONT = {
  heading: 'Montserrat',
  body: 'Open Sans',
} as const;

export const FPS = 30;

// Scene durations in seconds
export const SCENE_DURATIONS = {
  productivityProblem: 8,
  whatIsAutomation: 8,
  anatomyOfAutomation: 8,
  firstWins: 8,
  rulesForSuccess: 8,
} as const;

export const TRANSITION_DURATION_FRAMES = 20;
