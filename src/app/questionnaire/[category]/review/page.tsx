import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";
import Answer from "@/models/Answer";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function CategoryReviewPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();
  const user = await User.findById(session.user.id);
  const partnerId = user.partnerId;

  const decodedCategory = decodeURIComponent(category);
  const questions = await Question.find({ category: decodedCategory }).sort({ order: 1 });

  // Get answers for both partners
  const userAnswers = await Answer.find({
    userId: session.user.id,
    questionId: { $in: questions.map(q => q._id) }
  });

  const partnerAnswers = partnerId ? await Answer.find({
    userId: partnerId,
    questionId: { $in: questions.map(q => q._id) }
  }) : [];

  const userAnswersMap = new Map(userAnswers.map(a => [a.questionId.toString(), (a as any).answer]));
  const partnerAnswersMap = new Map(partnerAnswers.map(a => [a.questionId.toString(), (a as any).answer]));

  return (
    <div className="min-h-screen bg-surface font-sans py-20 px-6 max-w-screen-lg mx-auto space-y-16">
      <header className="space-y-4">
        <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-all">
          ← Back to Sanctuary
        </Link>
        <h1 className="text-5xl font-editorial italic text-on-surface leading-tight">
          Reviewing <br/><span className="text-primary">{decodedCategory}</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl font-sans">
          Reflect on your shared responses and use these insights to deepen your connection.
        </p>
      </header>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userVal = userAnswersMap.get(q._id.toString());
          const partnerVal = partnerAnswersMap.get(q._id.toString());
          const bothAnswered = userVal !== undefined && partnerVal !== undefined;
          const isLong = (val: any) => typeof val === 'string' && val.length > 5;

          return (
            <div key={q._id.toString()} className="bg-surface-container-low p-8 rounded-[2rem] editorial-shadow space-y-6 transition-all hover:scale-[1.01]">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Question {idx + 1}</span>
                  <h3 className="text-xl font-editorial text-on-surface leading-snug">{q.text}</h3>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "flex items-center justify-center font-editorial transition-all",
                      isLong(userVal) ? "bg-surface-container-high text-xs p-4 rounded-2xl min-w-[120px]" : "w-10 h-10 rounded-full bg-primary text-on-primary text-lg"
                    )}>
                      {userVal || "-"}
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-tight text-on-surface-variant">YOU</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "flex items-center justify-center font-editorial transition-all",
                      bothAnswered 
                        ? isLong(partnerVal) ? "bg-surface-container-highest text-xs p-4 rounded-2xl min-w-[120px]" : "w-10 h-10 rounded-full bg-primary-container text-on-primary-container text-lg"
                        : "w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant/20 blur-[2px]"
                    )}>
                      {bothAnswered ? partnerVal : "?"}
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-tight text-on-surface-variant">PARTNER</span>
                  </div>
                </div>
              </div>
              
              {!bothAnswered && (
                <div className="pt-4 border-t border-outline/5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/20" />
                   Pending Reveal
                </div>
              )}
            </div>
          );
        })}
      </div>

      <footer className="pt-12 border-t border-outline/10 text-center">
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
