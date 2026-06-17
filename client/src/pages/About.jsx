import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaCheckCircle, FaSearch, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import CallToAction from '../components/CallToAction';

export default function About() {
  const whyChooseUs = [
    { text: 'Many paragraphs on detailed technical topics.', iconColor: 'text-emerald-500' },
    { text: 'Easy to find posts and navigate.', iconColor: 'text-indigo-500' },
    { text: 'Rich information covering many technology fields.', iconColor: 'text-purple-500' },
    { text: 'Intuitive website structure & Knowledge map.', iconColor: 'text-pink-500' },
    { text: 'Easier searching using labels like Gaming, Emulator, Tutorial, Android, and more.', iconColor: 'text-sky-500' },
    { text: 'Great resource for practical tech tips and tutorials.', iconColor: 'text-amber-500' },
  ];


  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-[rgb(10,18,32)] py-12 transition-colors duration-300">
      {/* SEO Title tag would be handled by a layout or index.html, but inside components we structure semantically */}
      
      <main className="max-w-5xl mx-auto px-4">
        {/* Slogan & Hero */}
        <header className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            About MyTechsu
          </h1>
          <p className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 uppercase tracking-widest">
            MADE FOR TECHNOPHILES ❤ MADE BY TECHNOPHILES
          </p>
        </header>

        {/* Intro Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Service Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              Our Service
            </h2>
            <p className="text-slate-650 dark:text-slate-350 leading-relaxed">
              Welcome to <strong>MyTechsu</strong>, your dedicated Technology World. We provide you with technical tips, comprehensive tutorials, and in-depth guides.</p>
          </div>

          {/* Journey Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              Beginning & Journey
            </h2>
            <p className="text-slate-650 dark:text-slate-350 leading-relaxed">
              Established in 2014, MyTechsu made its initial debut in India, quickly expanding to a dedicated YouTube channel.
            </p>
          </div>
        </section>

        {/* Why MyTechsu */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">
            Why Choose MyTechsu?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-5 rounded-xl border border-slate-200/40 dark:border-slate-850/50 bg-white/30 dark:bg-slate-900/25 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <FaCheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${item.iconColor}`} />
                <span className="text-sm text-slate-650 dark:text-slate-300 leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </section>
      
        {/* Social Media Links */}
        <section className="text-center mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Stay Connected #StayConnected
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://instagram.com/mytechsu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-95 text-white font-semibold shadow-md transition-opacity"
            >
              <FaInstagram className="w-5 h-5" />
              Instagram
            </a>
            <a
              href="https://facebook.com/mytechsu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-750 text-white font-semibold shadow-md transition-colors"
            >
              <FaFacebookF className="w-5 h-5" />
              Facebook
            </a>
            <a
              href="https://twitter.com/mytechsu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold shadow-md transition-colors border border-slate-700/35"
            >
              <FaTwitter className="w-5 h-5" />
              Twitter / X
            </a>
          </div>
        </section>

        {/* Final Thanks & Slogan */}
        <footer className="text-center py-8 border-t border-slate-200/50 dark:border-slate-800/40 mb-12">
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            Thank You For Joining Us!
          </p>
          <span className="text-xl sm:text-2xl font-black tracking-widest text-indigo-600 dark:text-indigo-400">
            #MYTECHSU
          </span>
        </footer>

        {/* Call to Action section */}
        <CallToAction />
      </main>
    </div>
  );
}
