import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Menu, X, Sun, Moon } from 'lucide-react'

function Navbar() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dark') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark', String(dark))
  }, [dark])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = location.pathname === '/'

  // Determine navbar background based on state
  const getNavbarBg = () => {
    if (scrolled) {
      return dark
        ? 'bg-surface-950/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/5'
        : 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50'
    }
    if (isLanding) {
      return 'bg-transparent'
    }
    return dark
      ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/5'
      : 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50'
  }

  // Determine text colors based on state
  const getTextColor = () => {
    if (scrolled) {
      return dark ? 'text-surface-300' : 'text-slate-600'
    }
    if (isLanding) {
      return 'text-white/80'
    }
    return dark ? 'text-surface-300' : 'text-slate-600'
  }

  const getLogoColor = () => {
    if (scrolled) {
      return dark ? 'text-white' : 'text-slate-900'
    }
    if (isLanding) {
      return 'text-white'
    }
    return dark ? 'text-white' : 'text-slate-900'
  }

  const getLogoAccentColor = () => {
    if (scrolled) {
      return dark ? 'text-indigo-400' : 'text-indigo-600'
    }
    if (isLanding) {
      return 'text-indigo-400'
    }
    return dark ? 'text-indigo-400' : 'text-indigo-600'
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${getNavbarBg()}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Plane className={`w-6 h-6 ${getLogoAccentColor()} transition-all duration-300 group-hover:scale-110`} />
            </div>
            <span className={`text-lg font-bold tracking-tight ${getLogoColor()} transition-all duration-300`}>
              VoyageAgent
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isLanding && (
              <>
                <a href="#features" className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${getTextColor()} hover:text-indigo-400 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full ${getTextColor()}`}>
                  Features
                </a>
                <a href="#how-it-works" className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${getTextColor()} hover:text-indigo-400 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full ${getTextColor()}`}>
                  How It Works
                </a>
                <a href="#testimonials" className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${getTextColor()} hover:text-indigo-400 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-indigo-400 after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full ${getTextColor()}`}>
                  Testimonials
                </a>
              </>
            )}
            <div className="w-px h-6 bg-current opacity-10 mx-2" />
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg transition-all duration-300 ${getTextColor()} hover:bg-black/5 dark:hover:bg-white/10`}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/planner">
              <button className="ml-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                <Plane className="w-4 h-4" />
                Plan Your Trip
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg transition-all duration-300 ${getTextColor()} hover:bg-black/5 dark:hover:bg-white/10`}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`p-2 rounded-lg transition-all duration-300 ${getTextColor()} hover:bg-black/5 dark:hover:bg-white/10`}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5 dark:border-white/5"
          >
            <div className="px-4 py-4 space-y-1 bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl">
              {isLanding && (
                <>
                  <a href="#features" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors duration-200">Features</a>
                  <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors duration-200">How It Works</a>
                  <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors duration-200">Testimonials</a>
                </>
              )}
              <div className="pt-2 mt-2 border-t border-gray-200/50 dark:border-white/5">
                <Link to="/planner" onClick={() => setMobileOpen(false)}>
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors duration-200">
                    <Plane className="w-4 h-4" />
                    Plan Your Trip
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
