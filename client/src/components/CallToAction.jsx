import { Link } from 'react-router-dom'

export default function CallToAction({
  className = '',
  primaryHref = '/#recent-posts',
  primaryLabel = 'Browse latest posts',
  secondaryHref = '/about',
  secondaryLabel = 'About the blog',
}) {
  return (
    <section className={`w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg my-8 shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 p-6 md:p-10 min-h-[220px]">
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80&auto=format&fit=crop"
          alt="community"
          className="w-full md:w-64 h-44 md:h-56 object-cover rounded-lg flex-shrink-0 shadow-inner"
        />
        <div className="flex-1">
          <h2 className="text-2xl md:text-4xl font-semibold">Explore curated articles & get involved</h2>
          <p className="mt-3 text-base md:text-lg opacity-95">Browse the latest posts, suggest topics, or contribute via the project's repository.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={primaryHref} className="inline-flex items-center px-5 py-3 bg-white text-indigo-600 rounded-md font-medium shadow-lg hover:opacity-95">{primaryLabel}</Link>
            <Link to={secondaryHref} className="inline-flex items-center px-5 py-3 border border-white/70 rounded-md text-white hover:bg-white/10">{secondaryLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
