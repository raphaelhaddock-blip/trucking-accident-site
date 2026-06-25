import type { SVGProps } from 'react';

/**
 * Single stroked icon set (replaces the ~8 copy-pasted inline SVGs across the old
 * pages). 1.8 stroke, round joins, currentColor. Keep the set small + consistent.
 */
type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };
}

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
);

export const Phone = (p: IconProps) => (
  <svg {...base(p)}><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
);

export const Check = (p: IconProps) => (
  <svg {...base(p)}><path d="M4.5 12.75l6 6 9-13.5" /></svg>
);

export const CheckCircle = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export const ChevronRight = (p: IconProps) => (
  <svg {...base(p)}><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
);

export const ShieldCheck = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
);

export const Clock = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export const Scale = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3v18m0-18l6 2m-6-2L6 5m12 0l3 7a3.001 3.001 0 01-6 0l3-7zM6 5L3 12a3.001 3.001 0 006 0L6 5zm-3 16.5h18" /></svg>
);

export const Document = (p: IconProps) => (
  <svg {...base(p)}><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);

export const MapPin = (p: IconProps) => (
  <svg {...base(p)}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
);

export const AlertTriangle = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
);

export const Users = (p: IconProps) => (
  <svg {...base(p)}><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
);
