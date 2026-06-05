import { Plane, Compass, Twitter, Github, Linkedin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-surface-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-6 h-6 text-indigo-400" />
              <Compass className="w-3.5 h-3.5 text-amber-400 -mt-1" />
              <span className="text-lg font-bold">VoyageAgent</span>
            </div>
            <p className="text-sm text-surface-300 leading-relaxed">
              AI-powered travel planning that turns your wanderlust into perfectly curated itineraries.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-300 mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-300 mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-300 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-surface-300 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Social media */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <a href="#" className="text-surface-400 hover:text-white transition-colors" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-surface-400 hover:text-white transition-colors" aria-label="GitHub">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-surface-400 hover:text-white transition-colors" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        <div className="mt-6 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-400">© 2025 VoyageAgent. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-surface-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
