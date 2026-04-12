import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";
import Answer from "@/models/Answer";
import User from "@/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import SummaryQuestionList from "@/components/questionnaire/SummaryQuestionList";
import { ChevronLeft, Sparkles } from "lucide-react";

export default async function CategorySummaryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await dbConnect();

  const decodedCategory = decodeURIComponent(category);
  const user = await User.findById(session.user.id);
  const partnerId = user?.partnerId;

  const questions = await Question.find({ category: decodedCategory }).sort({ order: 1 });
  
  if (!questions || questions.length === 0) {
    redirect("/dashboard");
  }

  // Fetch answers for both partners
  const userAnswers = await Answer.find({
    userId: session.user.id,
    questionId: { $in: questions.map(q => q._id) }
  });

  const partnerAnswers = partnerId ? await Answer.find({
    userId: partnerId,
    questionId: { $in: questions.map(q => q._id) }
  }) : [];

  const userAnswersMap = Object.fromEntries(userAnswers.map(a => [a.questionId.toString(), (a as any).answer]));
  const partnerAnswersMap = Object.fromEntries(partnerAnswers.map(a => [a.questionId.toString(), (a as any).answer]));
  
  // Reveal state: revealed if both answered
  const revealState = Object.fromEntries(questions.map(q => {
    const qId = q._id.toString();
    return [qId, !!(userAnswersMap[qId] && partnerAnswersMap[qId])];
  }));

  const categoryDescriptions: Record<string, string> = {
    "Spiritual & Values": "Exploring the sacred threads that weave through your shared values and individual beliefs.",
    "Emotional Connection": "Nurturing the invisible bonds that foster understanding, safety, and deep empathy.",
    "Hopes & Dreams": "Mapping the shared horizons and individual aspirations that shape your future together.",
    "Roles & Responsibilities": "Defining the harmony of service and partnership in the dance of daily life.",
    "Intimacy & Love": "Celebrating the unique language of affection and closeness that defines your bond."
  };

  const description = categoryDescriptions[decodedCategory] || "A journey through the intentional layers of your partnership.";

  return (
    <div className="min-h-screen bg-background pb-24 px-6 md:px-12 pt-12 md:pt-20">
      <main className="max-w-screen-lg mx-auto">
        {/* Back Link */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-all mb-12"
        >
          <ChevronLeft size={14} />
          Sanctuary Dashboard
        </Link>

        {/* Category Header */}
        <header className="mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-[10px] font-bold tracking-widest mb-6">
            CATEGORY SUMMARY
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-background tracking-tight mb-8">
            {decodedCategory}
          </h1>
          <p className="text-on-surface-variant text-xl md:text-2xl max-w-2xl font-body italic leading-relaxed">
            {description}
          </p>
        </header>

        {/* Questions List */}
        <section className="mb-24">
          <SummaryQuestionList 
            category={decodedCategory}
            questions={JSON.parse(JSON.stringify(questions))}
            userAnswers={userAnswersMap}
            partnerAnswers={partnerAnswersMap}
            revealState={revealState}
            userName={user?.fullName || "You"}
            partnerName={user?.partnerName || "Partner"}
          />
        </section>

        {/* AI Synthesis / Shared Sanctuary Card */}
        <aside className="bg-surface-container-lowest rounded-[2.5rem] p-12 md:p-20 relative overflow-visible shadow-[0px_12px_32px_rgba(62,39,35,0.06)] border border-primary/5">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-background mb-8 leading-tight">Your Shared Sanctuary</h2>
            <p className="font-body text-on-surface-variant text-lg md:text-xl leading-relaxed mb-10 italic">
              "Your reflections in {decodedCategory} show a beautiful alignment in your core values. While your individual paths vary, the destination of mutual respect and intentional growth remains your shared anchor."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-primary/30"></div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold">AI Companion Synthesis</span>
              </div>
            </div>
          </div>
          
          {/* Decorative element or Image placeholder */}
          <div className="hidden lg:block absolute -right-8 -top-8 w-48 h-64 bg-surface-container-high rounded-2xl rotate-3 shadow-xl overflow-hidden border border-primary/5">
            <img 
              src="/home/musa/.gemini/antigravity/brain/962d227a-eaa2-4221-9bb4-51810d3607ec/editorial_journal_flowers_1775511760732.png" 
              alt="Editorial Sanctuary"
              className="w-full h-full object-cover"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
