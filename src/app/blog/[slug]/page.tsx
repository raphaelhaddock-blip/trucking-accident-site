import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { getBlogPost, BLOG_SLUGS, BLOG_POSTS } from '@/lib/blog-content';
import { getAccidentName } from '@/lib/accidents-content';

const PHONE_NUMBER = '1-800-555-0123';

export async function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Article schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Truck Injury Lawyers',
      url: 'https://18wheeleraccidentlawyers.com',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://18wheeleraccidentlawyers.com/blog/${slug}`,
    },
  };

  // FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Get related posts
  const relatedPosts = BLOG_POSTS.filter(
    (p) => post.relatedPosts.includes(p.slug) || p.category === post.category
  )
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500 text-navy-900">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-navy-800 text-gray-300">
              {post.readingTime} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>By {post.author}</span>
            <span>&bull;</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-700 leading-relaxed">
              {post.introduction}
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-100 rounded-xl p-6 mb-12">
            <h2 className="text-lg font-bold text-navy-900 mb-4">In This Article</h2>
            <ul className="space-y-2">
              {post.sections.map((section, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index}`}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faqs" className="text-amber-600 hover:text-amber-700 font-medium">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Sections */}
          {post.sections.map((section, index) => (
            <section key={index} id={`section-${index}`} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-6">
                {section.heading}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="whitespace-pre-line">{section.content}</p>
              </div>
              {section.subsections && (
                <div className="mt-6 space-y-6">
                  {section.subsections.map((sub, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-xl font-bold text-navy-900 mb-3">
                        {sub.heading}
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Related Accident Types */}
          {post.relatedAccidents.length > 0 && (
            <section className="bg-gray-100 rounded-xl p-8 mb-12">
              <h2 className="text-xl font-bold text-navy-900 mb-4">
                Related Accident Types
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {post.relatedAccidents.map((accidentSlug) => (
                  <Link
                    key={accidentSlug}
                    href={`/accidents/${accidentSlug}`}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {getAccidentName(accidentSlug)}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          <section id="faqs" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-navy-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Box */}
          <section className="bg-navy-900 text-white rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">{post.cta.headline}</h2>
            <p className="text-gray-300 mb-6">{post.cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="bg-amber-500 text-navy-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition text-center"
              >
                Call {PHONE_NUMBER}
              </a>
              <Link
                href="/contact"
                className="bg-white text-navy-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition text-center"
              >
                Free Case Evaluation
              </Link>
            </div>
          </section>

          {/* Related States */}
          {post.relatedStates.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-navy-900 mb-4">
                Truck Accident Laws by State
              </h2>
              <div className="flex flex-wrap gap-2">
                {post.relatedStates.map((stateSlug) => (
                  <Link
                    key={stateSlug}
                    href={`/states/${stateSlug}`}
                    className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-amber-100 hover:text-amber-700 transition capitalize"
                  >
                    {stateSlug.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-white border-t">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-navy-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="bg-gray-50 rounded-xl p-6">
                  <span className="text-xs font-medium text-amber-600 uppercase">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-navy-900 mt-2 mb-3">
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="hover:text-amber-600 transition-colors"
                    >
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedPost.introduction.substring(0, 100)}...
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
