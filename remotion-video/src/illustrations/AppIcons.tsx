import React from 'react';

// Generic category icons as SVG — no brand names, universally applicable
// Each renders centered on 0,0 at the given `size`

type IconProps = {size?: number};

/** Accounting — teal circle with ledger/calculator icon */
export const AccountingIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#13B5EA" />
      <g transform={`scale(${size / 60})`}>
        {/* Calculator body */}
        <rect x={-10} y={-14} width={20} height={28} rx={3} fill="none" stroke="#fff" strokeWidth={2} />
        {/* Screen */}
        <rect x={-7} y={-11} width={14} height={7} rx={1} fill="rgba(255,255,255,0.85)" />
        {/* Buttons grid */}
        <circle cx={-4} cy={2} r={2} fill="rgba(255,255,255,0.7)" />
        <circle cx={4} cy={2} r={2} fill="rgba(255,255,255,0.7)" />
        <circle cx={-4} cy={8} r={2} fill="rgba(255,255,255,0.7)" />
        <circle cx={4} cy={8} r={2} fill="rgba(255,255,255,0.7)" />
      </g>
    </g>
  );
};

/** Spreadsheet — green doc with grid lines */
export const SpreadsheetIcon: React.FC<IconProps> = ({size = 60}) => {
  const w = size * 0.65;
  const h = size * 0.82;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={size * 0.06} fill="#0F9D58" />
      <path
        d={`M ${w / 2 - size * 0.15} ${-h / 2} L ${w / 2} ${-h / 2 + size * 0.15} L ${w / 2 - size * 0.15} ${-h / 2 + size * 0.15} Z`}
        fill="#0C7A45"
      />
      <rect x={-w * 0.32} y={-h * 0.18} width={w * 0.64} height={h * 0.52} rx={2} fill="rgba(255,255,255,0.9)" />
      <line x1={-w * 0.32} y1={h * 0.0} x2={w * 0.32} y2={h * 0.0} stroke="#0F9D58" strokeWidth={1} />
      <line x1={-w * 0.32} y1={h * 0.16} x2={w * 0.32} y2={h * 0.16} stroke="#0F9D58" strokeWidth={1} />
      <line x1={0} y1={-h * 0.18} x2={0} y2={h * 0.34} stroke="#0F9D58" strokeWidth={1} />
    </g>
  );
};

/** Messaging — green circle with chat bubble icon */
export const MessagingIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#25D366" />
      <g transform={`scale(${size / 60})`}>
        {/* Chat bubble */}
        <rect x={-12} y={-10} width={24} height={16} rx={4} fill="#FFFFFF" />
        {/* Tail */}
        <polygon points="-6,6 -12,12 -2,6" fill="#FFFFFF" />
        {/* Dots */}
        <circle cx={-5} cy={-2} r={1.5} fill="#25D366" />
        <circle cx={0} cy={-2} r={1.5} fill="#25D366" />
        <circle cx={5} cy={-2} r={1.5} fill="#25D366" />
      </g>
    </g>
  );
};

/** Email — red circle with envelope */
export const EmailIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#EA4335" />
      <g transform={`scale(${size / 60})`}>
        <rect x={-14} y={-8} width={28} height={18} rx={2} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
        <polyline
          points="-14,-8 0,4 14,-8"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
};

/** Automation — orange circle with lightning bolt / gear */
export const AutomationIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#FF6D5A" />
      <g transform={`scale(${size / 60})`}>
        {/* Lightning bolt */}
        <polygon
          points="-2,-14 -8,2 -1,2 -4,14 8,-2 1,-2 4,-14"
          fill="#FFFFFF"
        />
      </g>
    </g>
  );
};

/** CRM — indigo circle with people icon */
export const CrmIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#6366F1" />
      <g transform={`scale(${size / 60})`}>
        <circle cx={-4} cy={-5} r={5} fill="#FFFFFF" />
        <ellipse cx={-4} cy={9} rx={9} ry={6} fill="#FFFFFF" />
        <circle cx={10} cy={-3} r={4} fill="rgba(255,255,255,0.6)" />
        <ellipse cx={10} cy={8} rx={7} ry={5} fill="rgba(255,255,255,0.6)" />
      </g>
    </g>
  );
};

/** Notifications — purple circle with bell icon */
export const NotificationsIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#8B5CF6" />
      <g transform={`scale(${size / 60})`}>
        {/* Bell shape */}
        <path
          d="M 0 -12 C -8 -12 -12 -6 -12 0 L -12 4 L -14 7 L 14 7 L 12 4 L 12 0 C 12 -6 8 -12 0 -12 Z"
          fill="#FFFFFF"
        />
        {/* Clapper */}
        <ellipse cx={0} cy={10} rx={4} ry={3} fill="#FFFFFF" />
        {/* Alert dot */}
        <circle cx={8} cy={-8} r={4} fill="#FF6D5A" />
      </g>
    </g>
  );
};

/** Database — dark blue circle with cylinder/storage icon */
export const DatabaseIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#1E40AF" />
      <g transform={`scale(${size / 60})`}>
        {/* Cylinder top */}
        <ellipse cx={0} cy={-8} rx={12} ry={5} fill="none" stroke="#FFFFFF" strokeWidth={2} />
        {/* Cylinder body */}
        <line x1={-12} y1={-8} x2={-12} y2={8} stroke="#FFFFFF" strokeWidth={2} />
        <line x1={12} y1={-8} x2={12} y2={8} stroke="#FFFFFF" strokeWidth={2} />
        {/* Cylinder bottom */}
        <ellipse cx={0} cy={8} rx={12} ry={5} fill="none" stroke="#FFFFFF" strokeWidth={2} />
        {/* Middle line */}
        <ellipse cx={0} cy={0} rx={12} ry={5} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      </g>
    </g>
  );
};

/** Web Form — teal circle with form/clipboard icon */
export const WebFormIcon: React.FC<IconProps> = ({size = 60}) => {
  const r = size / 2;
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill="#0D9488" />
      <g transform={`scale(${size / 60})`}>
        {/* Clipboard */}
        <rect x={-10} y={-12} width={20} height={26} rx={2} fill="none" stroke="#FFFFFF" strokeWidth={2} />
        {/* Clip */}
        <rect x={-5} y={-15} width={10} height={6} rx={2} fill="#FFFFFF" />
        {/* Lines */}
        <line x1={-6} y1={-3} x2={6} y2={-3} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        <line x1={-6} y1={2} x2={6} y2={2} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        <line x1={-6} y1={7} x2={3} y2={7} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
      </g>
    </g>
  );
};
