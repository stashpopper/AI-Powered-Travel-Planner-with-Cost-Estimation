import { useState } from "react";


function TravelForm({ onSubmit, loading = false }) {
  const [origin, setOrigin] = useState("");
  const [preferences, setPreferences] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const payload = {
      origin: origin.trim(),
      preferences: preferences
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      days: Number(days),
      budget: budget === "" ? null : Number(budget),
    };

    await onSubmit(payload);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Origin
          <input
            type="text"
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder="Enter your starting city"
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
            disabled={loading}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Preferences
          <input
            type="text"
            value={preferences}
            onChange={(event) => setPreferences(event.target.value)}
            placeholder="beach, mountains, food"
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
            disabled={loading}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Days
          <input
            type="number"
            min="1"
            value={days}
            onChange={(event) => setDays(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
            disabled={loading}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Budget (optional)
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            placeholder="Optional budget"
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
            disabled={loading}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>
    </form>
  );
}

export default TravelForm;