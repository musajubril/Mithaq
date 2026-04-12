"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { saveAnswer } from "@/app/actions/answers";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSocket } from "@/components/providers/SocketProvider";
import { useSession } from "next-auth/react";
import { getComparisonData } from "@/app/actions/reveal";
import ResponseComparison from "@/components/reveal/ResponseComparison";
import LoadingDots from "@/components/ui/LoadingDots";

interface Question {
  _id: string;
  text: string;
  category: string;
  order: number;
  type: "text" | "scale" | "binary";
  options?: string[];
}

interface Props {
  category: string;
  initialQuestions: Question[];
  initialAnswers: Record<string, string | number>;
  initialIndex: number;
}

export default function QuestionnaireClient({ category, initialQuestions, initialAnswers, initialIndex }: Props) {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [answers, setAnswers] = useState(initialAnswers);
  const [textInput, setTextInput] = useState("");
  const [direction, setDirection] = useState(0); 
  const [isSaving, setIsSaving] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<{
    userAnswer: string | number | null;
    partnerAnswer: string | number | null;
    isRevealed: boolean;
  } | null>(null);

  const currentQuestion = initialQuestions[currentIndex];
  const progress = ((currentIndex + 1) / initialQuestions.length) * 100;

  // Sync text input with stored answers when question changes
  useEffect(() => {
    if (currentQuestion.type === "text") {
      setTextInput((answers[currentQuestion._id] as string) || "");
    }
  }, [currentIndex, currentQuestion.type, answers, currentQuestion._id]);

  // Emit typing event
  useEffect(() => {
    if (socket && session?.user?.id) {
      socket.emit("typing", { 
        userId: session.user.id, 
        partnerId: null, 
        category 
      });
    }
  }, [currentIndex, socket, session, category]);

  const handleSelect = async (value: string | number) => {
    setIsSaving(true);
    setAnswers(prev => ({ ...prev, [currentQuestion._id]: value }));
    await saveAnswer(currentQuestion._id, value);

    const data = await getComparisonData(currentQuestion._id);
    setIsSaving(false);
    if (data && !("error" in data)) {
      setComparisonData({
        userAnswer: value,
        partnerAnswer: data.partnerAnswer as any,
        isRevealed: data.isRevealed as boolean
      });
      setShowComparison(true);
    } else {
      moveToNext();
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleSelect(textInput);
    }
  };

  const moveToNext = () => {
    setShowComparison(false);
    setComparisonData(null);
    setTextInput("");
    if (currentIndex < initialQuestions.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setShowComparison(false);
      setComparisonData(null);
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const renderInput = () => {
    if (showComparison) {
      return (
        <div className="w-full space-y-12">
          <ResponseComparison 
            userAnswer={comparisonData?.userAnswer || null}
            partnerAnswer={comparisonData?.partnerAnswer || null}
            isRevealed={comparisonData?.isRevealed || false}
          />
          
          <button
            onClick={moveToNext}
            className="px-12 py-4 bg-primary text-on-primary rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all editorial-shadow"
          >
            {currentIndex === initialQuestions.length - 1 ? "Finish Category" : "Next Question"}
          </button>
        </div>
      );
    }

    switch (currentQuestion.type) {
      case "scale":
        return (
          <div className="flex flex-col items-center gap-12 w-full">
            <div className="flex flex-wrap justify-center gap-6">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelect(val)}
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center transition-all editorial-shadow",
                    answers[currentQuestion._id] === val 
                      ? "bg-primary text-on-primary scale-110" 
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  )}
                >
                  <span className="text-2xl font-editorial">{val}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between w-full max-w-sm text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50">
              <span>Not at all</span>
              <span>Completely</span>
            </div>
          </div>
        );
      
      case "binary":
        return (
          <div className="flex justify-center gap-8 w-full">
            {["Yes", "No"].map((val) => (
              <button
                key={val}
                onClick={() => handleSelect(val)}
                className={cn(
                  "px-10 py-5 rounded-3xl min-w-[140px] font-bold uppercase tracking-widest text-sm transition-all editorial-shadow",
                  answers[currentQuestion._id] === val 
                    ? "bg-primary text-on-primary scale-105" 
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        );

      case "text":
        return (
          <div className="w-full max-w-xl space-y-8 flex flex-col items-center">
            <textarea 
              className="w-full bg-surface-container-high rounded-[2rem] p-8 text-on-surface placeholder:text-on-surface-variant/20 focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[180px] font-sans text-lg leading-relaxed shadow-inner"
              placeholder="Reflect here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isSaving}
              className="px-12 py-4 bg-primary text-on-primary rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all editorial-shadow disabled:opacity-20 flex items-center justify-center min-h-[56px] min-w-[160px]"
            >
              {isSaving ? <LoadingDots color="white" /> : "Continue"}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-6 py-20 min-h-screen flex flex-col justify-center gap-16 font-sans">
      {/* Header & Progress */}
      <header className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-all flex items-center gap-2 mb-4">
              <span>← Sanctuary</span>
            </Link>
            <h1 className="text-3xl font-editorial italic text-on-surface">{category}</h1>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Question</span>
            <p className="font-editorial text-2xl italic text-primary">{currentIndex + 1} <span className="text-sm text-on-surface-variant not-italic opacity-70">/ {initialQuestions.length}</span></p>
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>

      {/* Question Area */}
      <div className="relative min-h-[500px] flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex flex-col items-center justify-center text-center space-y-12"
          >
            <h2 className="text-4xl md:text-5xl font-editorial text-on-surface leading-snug max-w-3xl">
              {currentQuestion.text}
            </h2>

            {renderInput()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {!showComparison && (
        <footer className="flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="text-xs font-bold uppercase tracking-widest text-on-surface-variant disabled:opacity-20 transition-all px-6 py-4 rounded-xl hover:bg-surface-container-low"
          >
            Previous
          </button>
        </footer>
      )}
    </div>
  );
}
