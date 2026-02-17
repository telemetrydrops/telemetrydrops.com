import { useState, useEffect, useCallback } from "react";
import { Button } from "./button";
import {
  quizQuestions,
  EXAM_CONFIG,
  DOMAIN_LABELS,
  type QuizQuestion,
  type Domain,
  type AnswerKey,
} from "../../data/quiz-data";
import { cn } from "../../lib/utils";

type Screen = "start" | "quiz" | "results";

/** Renders a subset of markdown: fenced code blocks and inline code. */
function MarkdownText({ text, className }: { text: string; className?: string }) {
  // Split on fenced code blocks first: ```lang\n...\n```
  const parts = text.split(/(```\w*\n[\s\S]*?```)/g);

  const elements: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const fencedMatch = part.match(/^```(\w*)\n([\s\S]*?)```$/);
    if (fencedMatch) {
      elements.push(
        <pre
          key={i}
          className="my-3 p-3 bg-black/30 border border-white/10 rounded-lg overflow-x-auto text-sm"
        >
          <code className="text-telemetria-orange/90">{fencedMatch[2]}</code>
        </pre>
      );
    } else {
      // Handle inline code: `text`
      const inlineParts = part.split(/(`[^`]+`)/g);
      const inlineElements: React.ReactNode[] = [];
      for (let j = 0; j < inlineParts.length; j++) {
        const inline = inlineParts[j];
        if (inline.startsWith("`") && inline.endsWith("`")) {
          inlineElements.push(
            <code
              key={j}
              className="px-1.5 py-0.5 bg-white/10 rounded text-telemetria-orange/90 text-[0.9em]"
            >
              {inline.slice(1, -1)}
            </code>
          );
        } else if (inline) {
          inlineElements.push(inline);
        }
      }
      elements.push(<span key={i}>{inlineElements}</span>);
    }
  }

  return <span className={className}>{elements}</span>;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectExamQuestions(): QuizQuestion[] {
  const byDomain = new Map<Domain, QuizQuestion[]>();
  for (const q of quizQuestions) {
    const list = byDomain.get(q.domain) || [];
    list.push(q);
    byDomain.set(q.domain, list);
  }

  const selected: QuizQuestion[] = [];
  for (const [domain, count] of Object.entries(
    EXAM_CONFIG.domainDistribution
  )) {
    const pool = byDomain.get(domain as Domain) || [];
    const shuffled = shuffleArray(pool);
    selected.push(...shuffled.slice(0, count));
  }

  return shuffleArray(selected);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const OTEL_TRACK_URL =
  "https://mn.dosedetelemetria.com/plans/1948557?bundle_token=f9f52783d3655e0c2be14c012bab2ab5&utm_source=website";

// --- Sub-components ---

function StartScreen({ onStart }: { onStart: () => void }) {
  const domains = Object.entries(EXAM_CONFIG.domainDistribution) as [
    Domain,
    number,
  ][];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-telemetria-orange/10 border border-telemetria-orange/20 rounded-full text-telemetria-orange text-sm mb-4">
          Practice Exam
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          OTCA Practice Exam
        </h1>
        <p className="text-white/80 text-lg">
          Test your readiness for the OpenTelemetry Certified Associate exam
          with 60 questions matching the real exam format.
        </p>
      </div>

      <div className="bg-telemetria-dark/50 border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Exam Details</h2>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 text-white/60">Questions</td>
              <td className="py-2 text-right font-medium">
                60 (from a pool of {quizQuestions.length})
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 text-white/60">Time Reference</td>
              <td className="py-2 text-right font-medium">90 minutes</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 text-white/60">Passing Score</td>
              <td className="py-2 text-right font-medium">75% (45/60)</td>
            </tr>
            <tr>
              <td className="py-2 text-white/60">Format</td>
              <td className="py-2 text-right font-medium">
                Multiple choice (A-D)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-telemetria-dark/50 border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Domain Distribution</h2>
        <div className="space-y-3">
          {domains.map(([domain, count]) => {
            const pct = Math.round((count / EXAM_CONFIG.totalQuestions) * 100);
            return (
              <div key={domain}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">
                    {DOMAIN_LABELS[domain]}
                  </span>
                  <span className="text-white/60">
                    {count} questions ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-telemetria-orange/70 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={onStart}
          className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90 px-8 py-3 text-base font-medium"
          size="lg"
        >
          Start Exam
        </Button>
        <p className="text-white/40 text-xs mt-3">
          Questions are randomly selected each attempt. Timer is shown as
          reference only.
        </p>
      </div>
    </div>
  );
}

function QuestionScreen({
  questions,
  answers,
  currentIndex,
  elapsedSeconds,
  onAnswer,
  onNavigate,
  onSubmit,
}: {
  questions: QuizQuestion[];
  answers: Map<string, AnswerKey>;
  currentIndex: number;
  elapsedSeconds: number;
  onAnswer: (questionId: string, answer: AnswerKey) => void;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
}) {
  const question = questions[currentIndex];
  const selectedAnswer = answers.get(question.id);
  const answeredCount = answers.size;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-white/60">
          Question{" "}
          <span className="text-white font-medium">{currentIndex + 1}</span> of{" "}
          {questions.length}
        </div>
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full border",
              question.domain === "fundamentals" &&
                "bg-blue-500/10 border-blue-500/20 text-blue-400",
              question.domain === "api-sdk" &&
                "bg-green-500/10 border-green-500/20 text-green-400",
              question.domain === "collector" &&
                "bg-purple-500/10 border-purple-500/20 text-purple-400",
              question.domain === "debugging" &&
                "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
            )}
          >
            {question.domainLabel}
          </span>
          <div className="text-sm font-mono text-white/60">
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-telemetria-orange/70 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-telemetria-dark/50 border border-white/10 rounded-xl p-6 mb-6">
        <div className="text-lg leading-relaxed">
          <MarkdownText text={question.question} />
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option) => (
          <button
            key={option.key}
            onClick={() => onAnswer(question.id, option.key)}
            className={cn(
              "w-full text-left p-4 rounded-xl border transition-all duration-200",
              selectedAnswer === option.key
                ? "bg-telemetria-orange/10 border-telemetria-orange/40 text-white"
                : "bg-telemetria-dark/30 border-white/10 text-white/80 hover:border-white/20 hover:bg-telemetria-dark/50"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium border",
                  selectedAnswer === option.key
                    ? "bg-telemetria-orange text-telemetria-dark border-telemetria-orange"
                    : "border-white/20 text-white/60"
                )}
              >
                {option.key}
              </span>
              <span className="pt-0.5">
                <MarkdownText text={option.text} />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          variant="outline"
          className="border-white/10 text-white/70 hover:bg-white/5 disabled:opacity-30"
        >
          Previous
        </Button>

        <span className="text-sm text-white/40">
          {answeredCount} of {questions.length} answered
        </span>

        {currentIndex < questions.length - 1 ? (
          <Button
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={!selectedAnswer}
            className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90 disabled:opacity-30"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={answeredCount < questions.length}
            className="bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90 disabled:opacity-30"
          >
            Submit Exam
          </Button>
        )}
      </div>

      {/* Question navigator */}
      <div className="mt-8 bg-telemetria-dark/50 border border-white/10 rounded-xl p-4">
        <div className="text-xs text-white/40 mb-3">Question Navigator</div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = answers.has(q.id);
            const isCurrent = i === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => onNavigate(i)}
                className={cn(
                  "w-8 h-8 rounded text-xs font-medium transition-all",
                  isCurrent
                    ? "bg-telemetria-orange text-telemetria-dark"
                    : isAnswered
                      ? "bg-white/10 text-white/80 hover:bg-white/20"
                      : "bg-white/5 text-white/30 hover:bg-white/10"
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({
  questions,
  answers,
  elapsedSeconds,
  onRetake,
}: {
  questions: QuizQuestion[];
  answers: Map<string, AnswerKey>;
  elapsedSeconds: number;
  onRetake: () => void;
}) {
  // Calculate scores
  let totalCorrect = 0;
  const domainStats = new Map<
    Domain,
    { correct: number; total: number }
  >();

  for (const q of questions) {
    const stats = domainStats.get(q.domain) || { correct: 0, total: 0 };
    stats.total++;
    if (answers.get(q.id) === q.correctAnswer) {
      stats.correct++;
      totalCorrect++;
    }
    domainStats.set(q.domain, stats);
  }

  const scorePercent = Math.round((totalCorrect / questions.length) * 100);
  const passed = totalCorrect / questions.length >= EXAM_CONFIG.passingScore;

  // Find weakest domain
  let weakestDomain: Domain | null = null;
  let weakestScore = 1;
  for (const [domain, stats] of domainStats) {
    const pct = stats.correct / stats.total;
    if (pct < weakestScore) {
      weakestScore = pct;
      weakestDomain = domain;
    }
  }

  // Track quiz completion once on mount
  useEffect(() => {
    // Build domain breakdown for analytics
    const domainBreakdown: Record<string, { correct: number; total: number }> = {};
    for (const [domain, stats] of domainStats) {
      domainBreakdown[domain] = { correct: stats.correct, total: stats.total };
    }

    window.posthog?.capture('quiz_completed', {
      total_questions: questions.length,
      correct_answers: totalCorrect,
      score_percent: scorePercent,
      passed,
      elapsed_seconds: elapsedSeconds,
      weakest_domain: weakestDomain,
      domain_breakdown: domainBreakdown,
    });
  // Intentionally fire only once when results screen mounts — deps are stable at that point
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetakeClick = () => {
    window.posthog?.capture('quiz_retake_clicked', {
      previous_score_percent: scorePercent,
      previous_passed: passed,
    });
    onRetake();
  };

  const handleOTelTrackClick = () => {
    window.posthog?.capture('otel_track_cta_clicked', {
      score_percent: scorePercent,
      passed,
      source: 'quiz_results',
    });
  };

  const domains: Domain[] = [
    "fundamentals",
    "api-sdk",
    "collector",
    "debugging",
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score header */}
      <div className="text-center mb-8">
        <div
          className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4",
            passed
              ? "bg-green-500/10 border-2 border-green-500/30"
              : "bg-red-500/10 border-2 border-red-500/30"
          )}
        >
          {passed ? (
            <svg
              className="w-10 h-10 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {passed ? "You Passed!" : "Not Quite There"}
        </h1>
        <p className="text-white/60">
          Completed in {formatTime(elapsedSeconds)}
        </p>
      </div>

      {/* Score display */}
      <div className="bg-telemetria-dark/50 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-4xl font-bold">
              {totalCorrect}
              <span className="text-xl text-white/40">/{questions.length}</span>
            </div>
            <div className="text-sm text-white/60">correct answers</div>
          </div>
          <div className="text-right">
            <div
              className={cn(
                "text-4xl font-bold",
                passed ? "text-green-400" : "text-red-400"
              )}
            >
              {scorePercent}%
            </div>
            <div className="text-sm text-white/60">
              {EXAM_CONFIG.passingScore * 100}% required to pass
            </div>
          </div>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              passed ? "bg-green-500" : "bg-red-500"
            )}
            style={{ width: `${scorePercent}%` }}
          />
          {/* Passing threshold marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/40"
            style={{ left: `${EXAM_CONFIG.passingScore * 100}%` }}
          />
        </div>
        <div
          className="text-xs text-white/40 mt-1"
          style={{
            paddingLeft: `${EXAM_CONFIG.passingScore * 100 - 2}%`,
          }}
        >
          75%
        </div>
      </div>

      {/* Per-domain breakdown */}
      <div className="bg-telemetria-dark/50 border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Domain Breakdown</h2>
        <div className="space-y-4">
          {domains.map((domain) => {
            const stats = domainStats.get(domain);
            if (!stats) return null;
            const pct = Math.round((stats.correct / stats.total) * 100);
            const isWeakest = domain === weakestDomain;
            return (
              <div key={domain}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span
                    className={cn(
                      "flex items-center gap-2",
                      isWeakest ? "text-telemetria-orange" : "text-white/80"
                    )}
                  >
                    {DOMAIN_LABELS[domain]}
                    {isWeakest && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-telemetria-orange/10 border border-telemetria-orange/20 rounded-full text-telemetria-orange">
                        Needs focus
                      </span>
                    )}
                  </span>
                  <span className="text-white/60 font-mono">
                    {stats.correct}/{stats.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      pct >= 75 ? "bg-green-500/70" : "bg-red-500/70"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-telemetria-dark/50 border border-telemetria-orange/20 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">
          {passed ? "Ready to go beyond the OTCA?" : "Strengthen Your Knowledge"}
        </h2>
        <p className="text-white/70 text-sm mb-4">
          {passed
            ? "You're on track! The OTel Track covers architecture, migration, observability culture, AI for observability, and more — topics that go well beyond certification."
            : "The OTel Track covers all four OTCA domains in depth, with 80+ lessons that build your understanding from fundamentals to advanced topics."}
        </p>
        <a
          href={OTEL_TRACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOTelTrackClick}
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-telemetria-orange text-telemetria-dark hover:bg-telemetria-orange/90 rounded-md transition-colors font-medium"
        >
          Explore the OTel Track
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>

      {/* Retake button */}
      <div className="text-center">
        <Button
          onClick={handleRetakeClick}
          variant="outline"
          className="border-white/10 text-white/70 hover:bg-white/5"
        >
          Retake Exam
        </Button>
        <p className="text-white/40 text-xs mt-2">
          A new set of 60 questions will be randomly selected.
        </p>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function OTCAQuiz() {
  const [screen, setScreen] = useState<Screen>("start");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Map<string, AnswerKey>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleStart = useCallback(() => {
    const selected = selectExamQuestions();
    setQuestions(selected);
    setAnswers(new Map());
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setTimerActive(true);
    setScreen("quiz");
    window.scrollTo({ top: 0 });

    // Track quiz start in PostHog
    window.posthog?.capture('quiz_started', {
      total_questions: selected.length,
      question_pool_size: quizQuestions.length,
    });
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, answer: AnswerKey) => {
      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(questionId, answer);
        return next;
      });
    },
    []
  );

  const handleNavigate = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [questions.length]
  );

  const handleSubmit = useCallback(() => {
    setTimerActive(false);
    setScreen("results");
    window.scrollTo({ top: 0 });
  }, []);

  const handleRetake = useCallback(() => {
    setScreen("start");
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="py-12 px-4">
      {screen === "start" && <StartScreen onStart={handleStart} />}
      {screen === "quiz" && (
        <QuestionScreen
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          elapsedSeconds={elapsedSeconds}
          onAnswer={handleAnswer}
          onNavigate={handleNavigate}
          onSubmit={handleSubmit}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          questions={questions}
          answers={answers}
          elapsedSeconds={elapsedSeconds}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}
