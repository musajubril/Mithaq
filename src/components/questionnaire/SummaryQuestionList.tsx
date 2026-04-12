"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import Link from "next/link";
import ReflectionComparison from "./ReflectionComparison";

interface Question {
  _id: string;
  text: string;
  order: number;
}

interface Answer {
  questionId: string;
  userId: string;
  answer: string | number;
}

interface Props {
  category: string;
  questions: Question[];
  userAnswers: Record<string, string | number>;
  partnerAnswers: Record<string, string | number>;
  revealState: Record<string, boolean>;
  userName: string;
  partnerName: string;
}

export default function SummaryQuestionList({
  category,
  questions,
  userAnswers,
  partnerAnswers,
  revealState,
  userName,
  partnerName
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const isAnsweredByUser = !!userAnswers[q._id];
        const isAnsweredByPartner = !!partnerAnswers[q._id];
        const isRevealed = revealState[q._id];
        const isExpanded = expandedId === q._id;

        // Fully completed (both answered)
        if (isAnsweredByUser && isAnsweredByPartner) {
          return (
            <div 
              key={q._id}
              className={cn(
                "rounded-2xl transition-all duration-500 overflow-hidden",
                isExpanded 
                  ? "bg-surface-container-lowest shadow-[0px_12px_32px_rgba(62,39,35,0.06)] border border-primary/5" 
                  : "bg-surface-container-low hover:bg-surface-container hover:shadow-sm"
              )}
            >
              <button 
                onClick={() => toggleExpand(q._id)}
                className="w-full px-8 py-6 flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 className={cn("w-5 h-5", isExpanded ? "text-primary" : "text-tertiary")} fill="currentColor" />
                  <span className={cn(
                    "text-lg font-headline font-semibold transition-colors",
                    isExpanded ? "text-primary italic" : "text-on-surface"
                  )}>
                    {q.text}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-on-surface-variant/40 transition-transform duration-500",
                  isExpanded && "rotate-180 text-primary"
                )} />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ReflectionComparison 
                      userAnswer={userAnswers[q._id]}
                      partnerAnswer={partnerAnswers[q._id]}
                      userName={userName}
                      partnerName={partnerName}
                      isRevealed={isRevealed}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        // Incomplete (one or both missing)
        return (
          <div 
            key={q._id}
            className="bg-surface-container-low/40 border border-dashed border-outline-variant/30 rounded-2xl overflow-hidden group"
          >
            <Link 
              href={`/questionnaire/${encodeURIComponent(category)}`}
              className="w-full px-8 py-6 flex items-center justify-between opacity-60 hover:opacity-100 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <Circle className="w-5 h-5 text-on-surface-variant/40" />
                <span className="text-lg font-headline font-semibold text-on-surface">
                  {q.text}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant/40 group-hover:text-primary/60 transition-colors">
                  Journey
                </span>
                <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary/60" />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
