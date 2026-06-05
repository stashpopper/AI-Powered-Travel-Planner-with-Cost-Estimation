import { useState } from 'react'
import { Clock, DollarSign, Sparkles } from 'lucide-react'

function TripDetails({ formData, onChange, loading }) {
  const [days, setDays] = useState(formData.days || 3)
  const [budget, setBudget] = useState(formData.budget || '')

  const handleDaysChange = (e) => {
    const value = Math.max(1, Math.min(90, Number(e.target.value) || 1))
    setDays(value)
    onChange({ ...formData, days: value })
  }

  const handleBudgetChange = (e) => {
    const value = e.target.value
    setBudget(value)
    onChange({ ...formData, budget: value })
  }

  return (
    <div className="space-y-8">
      {/* Duration Section */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
            <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <label className="text-base font-bold text-surface-900 dark:text-white">
            How many days?
          </label>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400 ml-11 mb-4">
          Tell us the length of your trip
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative max-w-xs">
            <input
              type="number"
              min="1"
              max="90"
              value={days}
              onChange={handleDaysChange}
              disabled={loading}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 pl-11 pr-4 py-3 text-base font-semibold text-surface-900 dark:text-white outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 disabled:opacity-60 hover:border-surface-300 dark:hover:border-surface-600"
            />
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-surface-400 dark:text-surface-500 font-medium">days</span>
          </div>

          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2">
            {[3, 5, 7, 10, 14].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => { setDays(d); onChange({ ...formData, days: d }) }}
                disabled={loading}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  days === d
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-950/50'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700'
                } disabled:opacity-60`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Section */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <label className="text-base font-bold text-surface-900 dark:text-white">
            Budget (optional)
          </label>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400 ml-11 mb-4">
          Set a budget range for more accurate cost estimates
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative max-w-xs">
            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" />
            <input
              type="number"
              min="0"
              value={budget}
              onChange={handleBudgetChange}
              placeholder="e.g. 2000"
              disabled={loading}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 pl-11 pr-4 py-3 text-base font-semibold text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 disabled:opacity-60 hover:border-surface-300 dark:hover:border-surface-600"
            />
          </div>

          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2">
            {[500, 1000, 2000, 5000].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => { setBudget(String(b)); onChange({ ...formData, budget: String(b) }) }}
                disabled={loading}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  budget === String(b)
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/50 dark:shadow-emerald-950/50'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700'
                } disabled:opacity-60`}
              >
                ${b.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trip Summary Card */}
      <div className="rounded-xl bg-gradient-to-br from-surface-50 to-surface-100/50 dark:from-surface-800/50 dark:to-surface-800/30 p-5 border border-surface-200/80 dark:border-surface-700/80">
        <p className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-4">
          Trip Summary
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-surface-500 dark:text-surface-400">Destination</span>
            <p className="text-sm font-semibold text-surface-900 dark:text-white mt-0.5">
              {formData.destination || <span className="text-surface-400 dark:text-surface-500 italic">Not set</span>}
            </p>
          </div>
          <div>
            <span className="text-xs text-surface-500 dark:text-surface-400">Duration</span>
            <p className="text-sm font-semibold text-surface-900 dark:text-white mt-0.5">{days} days</p>
          </div>
          <div>
            <span className="text-xs text-surface-500 dark:text-surface-400">Origin</span>
            <p className="text-sm font-semibold text-surface-900 dark:text-white mt-0.5">
              {formData.origin || <span className="text-surface-400 dark:text-surface-500 italic">Not set</span>}
            </p>
          </div>
          <div>
            <span className="text-xs text-surface-500 dark:text-surface-400">Budget</span>
            <p className="text-sm font-semibold text-surface-900 dark:text-white mt-0.5">
              {budget ? `$${Number(budget).toLocaleString()}` : <span className="text-surface-400 dark:text-surface-500 italic">Not set</span>}
            </p>
          </div>
        </div>
      </div>

      {/* AI tip */}
      <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        Fill in more details for a more personalized itinerary
      </p>
    </div>
  )
}

export default TripDetails
