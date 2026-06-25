import Link from 'next/link';
import { ChevronRight } from '@/components/ui/Icon';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Color context. Breadcrumbs sit inside the dark CommandHero by default. */
  tone?: 'dark' | 'light';
}

export default function Breadcrumb({ items, tone = 'dark' }: BreadcrumbProps) {
  // Generate JSON-LD BreadcrumbList schema (unchanged — SEO critical)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://trucking-accident-site.vercel.app${item.href}` }),
    })),
  };

  const dark = tone === 'dark';
  const linkColor = dark ? 'text-steel-300 hover:text-amber-400' : 'text-ink-muted hover:text-amber-700';
  const currentColor = dark ? 'text-white' : 'text-ink-strong';
  const sepColor = dark ? 'text-steel-500' : 'text-ink-muted/50';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className={`mx-1 h-4 w-4 ${sepColor}`} />}
              {item.href ? (
                <Link
                  href={item.href}
                  className={`-mx-1 rounded px-1 py-1 font-medium transition-colors ${linkColor}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`px-1 py-1 font-semibold ${currentColor}`} aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
