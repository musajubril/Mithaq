import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Question from "@/models/Question";
import Answer from "@/models/Answer";
import { cn } from "@/lib/utils";
import PresenceIndicator from "@/components/dashboard/PresenceIndicator";
import PartnerSyncForm from "@/components/dashboard/PartnerSyncForm";
import DailyPrompt from "@/components/dashboard/DailyPrompt";
import Link from "next/link";
import UserDropdown from "@/components/dashboard/UserDropdown";

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();
  const user = await User.findById(session?.user?.id).populate("partnerId");

  if (!user) return null;

  // Calculate Progress
  const totalQuestionsCount = await Question.countDocuments();
  const userAnswersCount = await Answer.countDocuments({ userId: session?.user?.id });
  const totalProgress = totalQuestionsCount > 0 ? Math.round((userAnswersCount / totalQuestionsCount) * 100) : 0;
  
  // Progress Ring Calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (totalProgress / 100) * circumference;

  // Find first category with incomplete questions
  const categories = await Question.distinct("category");
  let nextCategory = (categories[0] as string) || "Spiritual & Values";
  
  for (const cat of categories) {
    const catQuestions = await Question.find({ category: cat });
    const catAnswers = await Answer.countDocuments({ 
      userId: session?.user?.id, 
      questionId: { $in: catQuestions.map(q => q._id) } 
    });
    if (catAnswers < catQuestions.length) {
      nextCategory = cat as string;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-surface font-sans transition-colors duration-500 selection:bg-primary/10 selection:text-primary">
      {/* Top Nav - Glassmorphism & Tonal Shift */}
      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-primary/5">
        <nav className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto">
          <Link href="/dashboard" className="text-2xl font-editorial text-primary italic tracking-tight hover:scale-[1.02] transition-transform">
            Mithaq <span className="text-base font-sans not-italic opacity-30 ml-1">مِيثَاق</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:block">
              <PresenceIndicator isPartnerLinked={!!user?.partnerId} />
            </div>
            <UserDropdown user={{ fullName: user.fullName, email: user.email }} />
          </div>
        </nav>
      </header>

      <main className="pt-32 px-6 max-w-7xl mx-auto space-y-24 pb-24">
        {/* Hero Section - Centered Progress (Refined) */}
        <section className="flex flex-col items-center text-center space-y-12">
          <div className="relative flex items-center justify-center group scale-75 md:scale-100 transition-transform">
            {/* SVG Progress Ring */}
            <svg className="w-64 h-64 md:w-80 md:h-80 -rotate-90">
              <circle 
                className="text-surface-container-high stroke-current" 
                cx="160" cy="160" r={radius} 
                fill="transparent" 
                strokeWidth="6"
              />
              <circle 
                className="text-primary stroke-current transition-all duration-1000 ease-out" 
                cx="160" cy="160" r={radius} 
                fill="transparent" 
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant/60">Connection</span>
              <h2 className="text-6xl md:text-7xl font-editorial text-on-surface italic leading-none">
                {totalProgress}<span className="text-2xl not-italic opacity-20 ml-1">%</span>
              </h2>
              <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-80">Reflected</p>
            </div>
            
            {/* Subtle floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/5 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse delay-700" />
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-editorial text-on-surface leading-[1.1] tracking-tight">
              Salaam, <span className="italic text-primary">{user?.fullName?.split(' ')[0]}</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
              Welcome to your sacred sanctuary. Your journey of {totalProgress}% connection continues through intentional reflection.
            </p>
            <div className="pt-4">
              <Link 
                href={`/questionnaire/${encodeURIComponent(nextCategory)}`}
                className="px-10 py-5 bg-primary text-on-primary rounded-full font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-500"
              >
                Continue Reflection
              </Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            {/* Category Pathways Selection (Bento Grid - Refined) */}
            <section className="space-y-10">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Pathways</span>
                  <h3 className="text-4xl font-editorial italic text-on-surface">Points of Connection</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(await Promise.all(categories.map(async (cat) => {
                  const questions = await Question.find({ category: cat });
                  const answersCount = await Answer.countDocuments({ 
                    userId: session?.user?.id, 
                    questionId: { $in: questions.map(q => q._id) } 
                  });
                  const isComplete = answersCount === questions.length;
                  const categoryProgress = questions.length > 0 ? Math.round((answersCount / questions.length) * 100) : 0;
                  
                  // Icon mapping
                  const { Wallet, BookOpen, Users, Heart, User: UserIcon, Briefcase, MessageCircle, Sparkles } = await import("lucide-react");
                  const icons: Record<string, any> = {
                    "Finance": Wallet,
                    "Religion": BookOpen,
                    "Family": Users,
                    "Health": Heart,
                    "Personal": UserIcon,
                    "Career": Briefcase,
                    "Conflict": MessageCircle
                  };
                  
                  const Icon = Object.entries(icons).find(([key]) => cat.toString().includes(key))?.[1] || Sparkles;

                  return (
                    <div key={cat as string} className="group relative bg-surface-container-low/40 hover:bg-surface-container-low p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0px_20px_50px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[320px] border border-primary/5">
                      <div className="space-y-8">
                        <div className="flex justify-between items-start">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                            isComplete ? "bg-tertiary/10 text-tertiary" : "bg-primary/5 text-primary"
                          )}>
                            <Icon size={28} strokeWidth={1.5} />
                          </div>
                          {isComplete && (
                            <div className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[8px] font-bold uppercase tracking-widest">
                              Sacredly Complete
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-2xl font-editorial font-bold text-on-surface leading-tight transition-colors">{cat as string}</h4>
                          <p className="text-sm text-on-surface-variant/70 font-sans leading-relaxed line-clamp-2">
                             Navigating the depths of {cat.toString().toLowerCase()} through honest transparency and shared growth.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6 pt-8">
                        <div className="space-y-2">
                          <div className="flex justify-between items-end text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                            <span>Journey Progress</span>
                            <span className="text-primary">{categoryProgress}%</span>
                          </div>
                          <div className="h-1 w-full bg-surface-container-highest/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary/40 group-hover:bg-primary transition-all duration-1000" 
                              style={{ width: `${categoryProgress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Link 
                            href={`/questionnaire/${encodeURIComponent(cat as string)}/summary`}
                            className={cn(
                              "flex-1 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] text-center transition-all duration-300",
                              isComplete 
                                ? "bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary shadow-sm" 
                                : "bg-primary text-on-primary hover:bg-primary/90 shadow-md shadow-primary/10 hover:shadow-primary/20"
                            )}
                          >
                            {isComplete ? "View Reflections" : "Continue Journey"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })))}
              </div>
            </section>

            {/* Signature Editorial Card */}
            <section className="pt-12">
              <div className="bg-surface-container-low/40 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border border-primary/5 group">
                <div className="flex-1 space-y-6 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-tertiary">Weekly Reflection</span>
                  <h2 className="text-4xl md:text-5xl font-editorial font-bold text-on-surface leading-tight italic">Navigating the Unspoken Boundaries</h2>
                  <p className="text-lg text-on-surface-variant font-sans max-w-lg leading-relaxed">
                    This week, dive into the nuances of personal space and emotional capacity. A quiet exploration designed for mutual understanding.
                  </p>
                  <div className="pt-4">
                    <Link href="#" className="inline-block font-bold text-[10px] uppercase tracking-[0.2em] text-primary border-b-2 border-primary/20 pb-1 hover:border-primary transition-all duration-500">
                      Begin the Reflection
                    </Link>
                  </div>
                </div>
                <div className="flex-1 w-full md:w-auto h-80 relative group-hover:scale-105 transition-transform duration-1000">
                  <img 
                    alt="Editorial connection" 
                    className="w-full h-full object-cover rounded-[2rem] shadow-2xl shadow-primary/5" 
                    src="/images/editorial.png"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Stats */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Partner Sync Card (Refined) */}
            {!user?.partnerId ? (
              <div className="bg-surface-container-low/40 p-10 rounded-[3rem] border border-dashed border-primary/20">
                <PartnerSyncForm userCode={user?.partnershipId || ""} />
              </div>
            ) : (
              <div className="bg-surface-container-low/40 p-12 rounded-[3.5rem] border border-primary/5 space-y-10 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
                
                <div className="relative">
                  <div className="w-28 h-28 mx-auto rounded-full bg-surface-container-high border-4 border-primary/10 flex items-center justify-center font-editorial text-4xl text-primary italic overflow-hidden shadow-inner">
                    {(user?.partnerId as any)?.fullName?.[0]}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <PresenceIndicator isPartnerLinked={true} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-editorial italic text-on-surface">{(user?.partnerId as any)?.fullName}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/60">Synchronized Soul</p>
                </div>

{/* 
                <div className="pt-6">
                  <a 
                    href="/api/charter" 
                    target="_blank"
                    className="block w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all duration-500 shadow-xl shadow-primary/20"
                  >
                    Generate Covenant
                  </a>
                </div>
                */}
              </div>
            )}

            {/* Daily Prompt (Refined) */}
            <div className="bg-primary/5 p-10 rounded-[3.5rem] border border-primary/10">
              <DailyPrompt />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
