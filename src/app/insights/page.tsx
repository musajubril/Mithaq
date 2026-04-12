import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { getAlignmentScores } from "@/app/actions/insights";
import AlignmentChart from "@/components/insights/AlignmentChart";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const result = await getAlignmentScores();

  if ("error" in result) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center space-y-8">
        <h1 className="text-4xl font-editorial italic text-on-surface">Connection Required</h1>
        <p className="text-on-surface-variant max-w-md">To view your alignment radar, you must first link your partner and start answering shared reflections.</p>
        <Link href="/dashboard" className="px-10 py-4 bg-primary text-on-primary rounded-full font-bold uppercase tracking-widest text-sm editorial-shadow">
          Back to Sanctuary
        </Link>
      </div>
    );
  }

  const { scores } = result;

  return (
    <div className="min-h-screen bg-surface py-20 px-6 max-w-screen-lg mx-auto space-y-16">
      <header className="space-y-4">
        <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-all">
          ← Back to Sanctuary
        </Link>
        <h1 className="text-5xl font-editorial italic text-on-surface leading-tight">
          Your Shared <br/><span className="text-primary">Alignment Radar</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl font-sans">
          This visualization highlights the depth of your connection across different domains of life. Use it to celebrate your sync and explore new growth together.
        </p>
      </header>

      <div className="bg-surface-container-low p-8 md:p-12 rounded-[3.5rem] editorial-shadow border border-primary/5">
        <AlignmentChart data={scores} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {scores.map((s) => (
          <div key={s.category} className="bg-surface-container-high p-8 rounded-[2rem] editorial-shadow flex justify-between items-center">
             <div className="space-y-1">
               <h3 className="font-editorial text-xl italic text-on-surface">{s.category}</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Alignment Score</p>
             </div>
             <div className="text-4xl font-editorial text-primary">{s.score}%</div>
          </div>
        ))}
      </div>

      <footer className="pt-12 border-t border-outline/10 text-center">
        <p className="text-sm text-on-surface-variant mb-6 italic">"Connection is not about being the same, but about growing together towards the same horizon."</p>
        <Link 
          href="/dashboard"
          className="px-12 py-5 bg-primary text-on-primary rounded-full font-bold uppercase tracking-widest text-sm editorial-shadow hover:scale-105 transition-all inline-block"
        >
          Return to Dashboard
        </Link>
      </footer>
    </div>
  );
}
