"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Icons } from "@/components/icons";

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
}

export function Quiz({ questions, lectureId, courseId, userId }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
      // Here you would typically save the quiz results to the database
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl font-bold mb-4">Quiz Complete!</div>
          <div className="text-2xl mb-6">
            You scored {score} out of {questions.length}
          </div>
          <div className="mb-8">
            {score === questions.length ? (
              <div className="text-green-500 flex items-center justify-center gap-2">
                <Check className="h-6 w-6" />
                Perfect score! Great job!
              </div>
            ) : score >= questions.length / 2 ? (
              <div className="text-yellow-500">
                Good effort! Review the questions you missed.
              </div>
            ) : (
              <div className="text-red-500 flex items-center justify-center gap-2">
                <X className="h-6 w-6" />
                Keep practicing! You'll get better.
              </div>
            )}
          </div>
          <Button>Continue Course</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium">
              Score: {score}/{currentQuestionIndex}
            </div>
          </div>

          <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              let optionClass = "p-4 border rounded-lg cursor-pointer";
              if (isSubmitted) {
                if (index === currentQuestion.correctIndex) {
                  optionClass +=
                    " bg-green-100 dark:bg-green-900 border-green-500";
                } else if (
                  index === selectedOption &&
                  index !== currentQuestion.correctIndex
                ) {
                  optionClass += " bg-red-100 dark:bg-red-900 border-red-500";
                }
              } else {
                optionClass +=
                  selectedOption === index
                    ? " bg-primary/10 border-primary"
                    : " hover:bg-secondary/30";
              }

              return (
                <div
                  key={index}
                  className={optionClass}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                        isSubmitted
                          ? index === currentQuestion.correctIndex
                            ? "bg-green-500 border-green-500 text-white"
                            : index === selectedOption
                            ? "bg-red-500 border-red-500 text-white"
                            : "border-gray-300"
                          : selectedOption === index
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300"
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
            <div className="p-4 bg-secondary/30 rounded-lg mb-6">
              <div className="font-medium mb-2">Explanation:</div>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-end">
            {!isSubmitted ? (
              <Button onClick={handleSubmit} disabled={selectedOption === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
