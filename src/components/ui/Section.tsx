import type { ReactNode } from 'react';

type Tone = 'paper' | 'paper-2' | 'white' | 'ink';

interface SectionProps {
  tone?: Tone;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  id?: string;
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
}

const toneClass: Record<Tone, string> = {
  paper: 'bg-paper text-ink-body',
  'paper-2': 'bg-paper-2 text-ink-body',
  white: 'bg-white text-ink-body',
  ink: 'bg-ink-900 text-[var(--text-on-ink)]',
};

/**
 * Standard section: consistent vertical rhythm + container + optional header
 * (mono eyebrow → serif H2 → intro). Enforces the design system across pages.
 */
export default function Section({
  tone = 'paper',
  eyebrow,
  title,
  intro,
  center = false,
  id,
  className = '',
  containerClassName = '',
  children,
}: SectionProps) {
  const onInk = tone === 'ink';
  const hasHeader = eyebrow || title || intro;
  return (
    <section id={id} className={`py-16 md:py-24 ${toneClass[tone]} ${className}`}>
      <div className={`container-page ${containerClassName}`}>
        {hasHeader && (
          <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} mb-12`}>
            {eyebrow && (
              <p className={`eyebrow ${onInk ? 'eyebrow-on-ink' : ''} ${center ? 'justify-center' : ''}`}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className={`mt-4 text-[length:var(--text-display-md)] ${onInk ? 'text-white' : 'text-ink-strong'}`}>
                {title}
              </h2>
            )}
            {intro && (
              <p className={`mt-4 text-lg leading-relaxed ${onInk ? 'text-[var(--text-on-ink-muted)]' : 'text-ink-muted'}`}>
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
