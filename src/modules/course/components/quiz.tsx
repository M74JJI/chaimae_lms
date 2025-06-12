"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { Icons } from "@/components/icons";
import { saveQuizProgress } from "@/modules/course/actions/progress";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface QuizProps {
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[];
  lectureId: string;
  courseId: string;
  userId: string;
  initialData: {
    score: number;
    answers: { questionId: string; answerIndex: number; isCorrect: boolean }[];
    completed: boolean;
  } | null;
}

export function Quiz({
  questions,
  lectureId,
  courseId,
  userId,
  initialData,
}: QuizProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(initialData?.score || 0);
  const [isCompleted, setIsCompleted] = useState(
    initialData?.completed || false
  );
  const [answers, setAnswers] = useState(initialData?.answers || []);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // If quiz was already completed, show results
  useEffect(() => {
    if (initialData?.completed) {
      setIsCompleted(true);
    }
  }, [initialData]);

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted && !isCompleted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        answerIndex: selectedOption,
        isCorrect,
      },
    ];

    setIsSubmitted(true);
    setScore(newScore);
    setAnswers(newAnswers);

    // If this is the last question, save results
    if (currentQuestionIndex === questions.length - 1) {
      setIsSaving(true);
      try {
        await saveQuizProgress({
          userId,
          courseId,
          lectureId,
          score: newScore,
          answers: newAnswers,
          completed: true,
        });
        setIsCompleted(true);
        toast.success("Quiz completed! Results saved.");
      } catch (error) {
        toast.error("Failed to save quiz results");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const handleContinueCourse = () => {
    router.push(`/course/${courseId}`);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
              <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground mb-8">
              You scored {score} out of {questions.length}
            </p>

            <div className="mb-8">
              {score === questions.length ? (
                <div className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2 text-lg font-medium">
                  Perfect score! Excellent work!
                </div>
              ) : score >= questions.length * 0.7 ? (
                <div className="text-blue-600 dark:text-blue-400">
                  Well done! You passed with flying colors.
                </div>
              ) : score >= questions.length / 2 ? (
                <div className="text-yellow-600 dark:text-yellow-400">
                  Good effort! Review the material and try again.
                </div>
              ) : (
                <div className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                  <X className="h-5 w-5" />
                  Keep practicing! You'll get there.
                </div>
              )}
            </div>

            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-6">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${(score / questions.length) * 100}%` }}
              ></div>
            </div>

            <Button
              onClick={handleContinueCourse}
              className="px-8 py-4 text-lg"
            >
              Continue Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium">
              Score: {score}/{currentQuestionIndex}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              let optionClass =
                "p-4 border rounded-lg cursor-pointer transition-all";
              if (isSubmitted) {
                if (index === currentQuestion.correctIndex) {
                  optionClass +=
                    " bg-green-50 dark:bg-green-900/30 border-green-500";
                } else if (
                  index === selectedOption &&
                  index !== currentQuestion.correctIndex
                ) {
                  optionClass += " bg-red-50 dark:bg-red-900/30 border-red-500";
                }
              } else {
                optionClass +=
                  selectedOption === index
                    ? " bg-primary/10 border-primary"
                    : " hover:bg-secondary/30 border-transparent";
              }

              return (
                <div
                  key={index}
                  className={optionClass}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSubmitted
                          ? index === currentQuestion.correctIndex
                            ? "bg-green-500 border-green-500 text-white"
                            : index === selectedOption
                            ? "bg-red-500 border-red-500 text-white"
                            : "border-gray-300 dark:border-gray-600"
                          : selectedOption === index
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSubmitted ? (
                        index === currentQuestion.correctIndex ? (
                          <Check className="h-3 w-3" />
                        ) : index === selectedOption ? (
                          <X className="h-3 w-3" />
                        ) : null
                      ) : selectedOption === index ? (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      ) : null}
                    </div>
                    <div>{option}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {isSubmitted && currentQuestion.explanation && (
            <div className="p-4 bg-secondary/30 rounded-lg mb-8">
              <div className="font-medium mb-2">Explanation:</div>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-end">
            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-6 py-3"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="px-6 py-3"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : currentQuestionIndex < questions.length - 1 ? (
                  "Next Question"
                ) : (
                  "Finish Quiz"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
