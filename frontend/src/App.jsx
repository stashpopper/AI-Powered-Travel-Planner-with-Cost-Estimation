import { useMemo, useState } from "react";
import axios from "axios";

import PlanDetails from "./components/PlanDetails";
import PlanList from "./components/PlanList";
import TravelForm from "./components/TravelForm";


function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const apiUrl = useMemo(() => {
    const envUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_URL : undefined;
    const normalizedBase = envUrl?.trim().replace(/\/$/, "");

    if (normalizedBase) {
      return `${normalizedBase}/app/api/v1/travel/plan`;
    }

    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      return "/app/api/v1/travel/plan";
    }

    return "http://localhost:8000/app/api/v1/travel/plan";
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(apiUrl, payload);
      setData(res.data);
      if (res.data?.error?.detail) {
        const stage = res.data.error.stage ? `[${res.data.error.stage}] ` : "";
        setError(`${stage}${res.data.error.detail}`);
      }
      setSelectedPlan(null);
    } catch {
      setError("Something went wrong. Please try again.");
      setData({ recommended_plan: "", plans: [] });
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">AI Travel Planner</h1>
          <p className="mt-2 text-sm text-slate-600">
            Build a personalized trip plan with AI-powered recommendations.
          </p>
        </header>

        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <TravelForm onSubmit={handleSubmit} loading={loading} />
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Results</h2>

          {error ? (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          ) : null}

          {loading ? (
            <p className="mt-4 text-center text-sm text-slate-600">Generating plans...</p>
          ) : data ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Recommended Plan</p>
                <p className="text-lg font-medium">{data.recommended_plan || "No recommendation available"}</p>
              </div>

              {Array.isArray(data.plans) && data.plans.length > 0 ? (
                selectedPlan ? (
                  <PlanDetails plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
                ) : (
                  <PlanList
                    plans={data.plans}
                    recommended={data.recommended_plan}
                    onSelect={setSelectedPlan}
                  />
                )
              ) : (
                <p className="text-sm text-slate-600">No plans available yet.</p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              Submit the form above to generate travel plans.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;