import { Search, Plane } from 'lucide-react'

function DestinationPicker({ formData, onChange, loading }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2.5">
            Where do you want to go?
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center group-focus-within:bg-indigo-100 dark:group-focus-within:bg-indigo-900/50 transition-colors">
              <Search className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => onChange({ ...formData, destination: e.target.value })}
              placeholder="City, country, or region..."
              disabled={loading}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 pl-14 pr-4 py-3.5 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 disabled:opacity-60 hover:border-surface-300 dark:hover:border-surface-600"
            />
          </div>
        </div>

        {/* Origin */}
        <div>
          <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2.5">
            Where are you coming from?
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center group-focus-within:bg-emerald-100 dark:group-focus-within:bg-emerald-900/50 transition-colors">
              <Plane className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => onChange({ ...formData, origin: e.target.value })}
              placeholder="Your home city or airport..."
              disabled={loading}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 pl-14 pr-4 py-3.5 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 disabled:opacity-60 hover:border-surface-300 dark:hover:border-surface-600"
            />
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Be specific for better results — e.g., "Tokyo, Japan" instead of just "Japan"
      </p>
    </div>
  )
}

export default DestinationPicker
