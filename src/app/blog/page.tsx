import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { BLOG_POSTS, getRecentPosts } from '@/lib/blog-content';

export const metadata: Metadata = {
  title: 'Truck Accident Blog | Legal Guides & Resources',
  description:
    'Expert guides on truck accident claims, FMCSA regulations, settlement amounts, and what to do after an 18-wheeler crash. Free legal resources.',
  alternates: {
    canonical: '/blog',
  },
};

const PHONE_NUMBER = '1-800-555-0123';

export default function BlogPage() {
  const posts = getRecentPosts(10);
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const otherPosts = posts.filter((p) => p.slug !== featuredPost?.slug);

  const categoryColors = {
    guide: 'bg-blue-100 text-blue-800',
    legal: 'bg-purple-100 text-purple-800',
    safety: 'bg-green-100 text-green-800',
    news: 'bg-amber-100 text-amber-800',
  };

  const funnelLabels = {
    awareness: 'Getting Started',
    consideration: 'Understanding Your Case',
    decision: 'Taking Action',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog' },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Truck Accident Legal Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Expert guides on 18-wheeler accidents, your legal rights, FMCSA regulations,
            and how to maximize your compensation. Written by truck accident legal specialists.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white border-b">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-amber-500 font-semibold uppercase tracking-wider text-sm">
                Featured Article
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[featuredPost.category]}`}>
                    {featuredPost.category.charAt(0).toUpperCase() + featuredPost.category.slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {featuredPost.readingTime} min read
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-navy-900 mb-4">
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-amber-600 transition-colors">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {featuredPost.introduction.substring(0, 200)}...
                </p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700"
                >
                  Read Full Article
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl p-8 text-white">
                <p className="text-amber-400 font-semibold mb-2">Key Takeaway</p>
                <p className="text-lg">
                  {featuredPost.cta.description}
                </p>
                <div className="mt-6">
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="inline-block bg-amber-500 text-navy-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition"
                  >
                    Free Consultation: {PHONE_NUMBER}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 mb-8">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-500">
                      {post.readingTime} min
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-amber-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.introduction.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-amber-600 font-medium text-sm hover:text-amber-700"
                    >
                      Read more &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 mb-8">Browse by Topic</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link
              href="/accidents"
              className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
            >
              <h3 className="font-bold text-navy-900 mb-2 group-hover:text-amber-600">
                Accident Types
              </h3>
              <p className="text-gray-600 text-sm">
                20 detailed guides on jackknife, rollover, underride, and more.
              </p>
            </Link>
            <Link
              href="/states"
              className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
            >
              <h3 className="font-bold text-navy-900 mb-2 group-hover:text-amber-600">
                State Laws
              </h3>
              <p className="text-gray-600 text-sm">
                Trucking laws and regulations by state.
              </p>
            </Link>
            <Link
              href="/fmcsa-regulations"
              className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
            >
              <h3 className="font-bold text-navy-900 mb-2 group-hover:text-amber-600">
                FMCSA Regulations
              </h3>
              <p className="text-gray-600 text-sm">
                Federal trucking safety rules that protect you.
              </p>
            </Link>
            <Link
              href="/contact"
              className="p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition group"
            >
              <h3 className="font-bold text-navy-900 mb-2 group-hover:text-amber-600">
                Free Consultation
              </h3>
              <p className="text-gray-600 text-sm">
                Get expert legal help for your truck accident case.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Legal Help Now?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Our network of experienced truck accident attorneys offers free consultations.
            Get the compensation you deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
            >
              Call {PHONE_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition"
            >
              Free Case Evaluation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
