import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function HeroImage({
  src,
  alt,
  priority = true,
  overlay = true,
  overlayOpacity = 0.6,
  className = '',
  children,
}: HeroImageProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90"
          style={{ opacity: overlayOpacity }}
        />
      )}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

// Smaller hero variant for section backgrounds
interface SectionImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function SectionImage({ src, alt, className = '' }: SectionImageProps) {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-xl ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
