"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Grip,
  Video,
  HelpCircle,
  Dumbbell,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Edit,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseSectionType } from "../types";
import { createId } from "@paralleldrive/cuid2";
import { Lecture, Section } from "@prisma/client";

interface SectionManagerProps {
  courseId: string;
  sections: CourseSectionType[];
  setSections: React.Dispatch<React.SetStateAction<CourseSectionType[]>>;
  handleSave: () => Promise<void>;
  loading: boolean;
  deletedSections: { id: string }[];
  setDeletedSections: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
  deletedLectures: { id: string }[];
  setDeletedLectures: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
}

type LectureTypeEnum = "VIDEO" | "QUIZ" | "EXERCISE";

export const SectionManager: React.FC<SectionManagerProps> = ({
  courseId,
  sections,
  setSections,
  handleSave,
  loading,
  setDeletedSections,
  setDeletedLectures,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleSectionDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex).map(
      (section, index) => ({
        ...section,
        order: index,
      })
    );
    setSections(reordered);
  };

  const handleLectureDragEnd = (sectionId: string, event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const oldIndex = section.lectures.findIndex((l) => l.id === active.id);
        const newIndex = section.lectures.findIndex((l) => l.id === over.id);
        const reorderedLectures = arrayMove(
          section.lectures,
          oldIndex,
          newIndex
        ).map((lecture, idx) => ({ ...lecture, order: idx }));

        return { ...section, lectures: reorderedLectures };
      })
    );
  };

  const handleSectionChange = (
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addNewSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: createId(),
        courseId: courseId,
        title: "",
        description: "",
        order: prev.length,
        createdAt: new Date(),
        updatedAt: new Date(),
        lectures: [],
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-y-3">
            {sections.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                onChange={handleSectionChange}
                onLectureDragEnd={handleLectureDragEnd}
                setSections={setSections}
                setDeletedSections={setDeletedSections}
                setDeletedLectures={setDeletedLectures}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        onClick={addNewSection}
        variant="outline"
        className="w-full border-dashed border-2 hover:border-solid group transition-all duration-200"
      >
        <Plus className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span className="text-muted-foreground group-hover:text-primary">
          Add Section
        </span>
      </Button>
    </div>
  );
};

interface SortableSectionItemProps {
  section: CourseSectionType;
  onChange: (id: string, field: "title" | "description", value: string) => void;
  onLectureDragEnd: (sectionId: string, event: any) => void;
  setSections: React.Dispatch<React.SetStateAction<CourseSectionType[]>>;
  setDeletedSections: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
  setDeletedLectures: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  section,
  onChange,
  onLectureDragEnd,
  setSections,
  setDeletedSections,
  setDeletedLectures,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLectureOptions, setShowLectureOptions] = useState(false);

  const addLecture = (type: LectureTypeEnum) => {
    setShowLectureOptions(false);
    if (type === "QUIZ") {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== section.id) return s;
          return {
            ...s,
            lectures: [
              ...s.lectures,
              {
                id: createId(),
                title: "",
                description: "",
                order: s.lectures.length,
                type,
                quizLecture: {
                  id: createId(),
                  title: "",
                  description: "",
                  questions: [],
                },
              },
            ],
          };
        })
      );
    } else {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== section.id) return s;
          return {
            ...s,
            lectures: [
              ...s.lectures,
              {
                id: createId(),
                title: type === "VIDEO" ? "" : "",
                description: "",
                order: s.lectures.length,
                type,
              },
            ],
          };
        })
      );
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
    setDeletedSections((prev) => [...prev, { id: sectionId }]);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-lg border bg-card shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between bg-secondary/50 p-4 border-b">
        <div className="flex items-center gap-3 flex-1">
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <EditableText
            value={section.title}
            onChange={(value) => onChange(section.id, "title", value)}
            className="text-base font-medium"
            placeholder="Section title"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => handleDeleteSection(section.id)}
          >
            <Trash2 size={16} />
          </Button>
          <button
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
            {...attributes}
            {...listeners}
          >
            <Grip size={18} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <EditableText
            value={section.description}
            onChange={(value) => onChange(section.id, "description", value)}
            className="text-sm text-muted-foreground"
            placeholder="Section description"
            textarea
          />

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => onLectureDragEnd(section.id, event)}
          >
            <SortableContext
              items={section.lectures.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {section.lectures.map((lecture) => (
                  <SortableLectureItem
                    key={lecture.id}
                    lecture={lecture}
                    setSections={setSections}
                    sectionId={section.id}
                    setDeletedLectures={setDeletedLectures}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="pt-2">
            {!showLectureOptions ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLectureOptions(true)}
                className="gap-2 w-full"
              >
                <Plus size={16} />
                <span>Add Lecture</span>
              </Button>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLecture("VIDEO")}
                  className="gap-2 flex-1"
                >
                  <Video size={16} className="text-blue-500" />
                  <span>Video</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLecture("QUIZ")}
                  className="gap-2 flex-1"
                >
                  <HelpCircle size={16} className="text-purple-500" />
                  <span>Quiz</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLecture("EXERCISE")}
                  className="gap-2 flex-1"
                >
                  <Dumbbell size={16} className="text-emerald-500" />
                  <span>Exercise</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLectureOptions(false)}
                  className="text-muted-foreground"
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  textarea?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className,
  placeholder,
  textarea = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [hasContent, setHasContent] = useState(!!value);

  const handleSave = () => {
    if (editValue.trim()) {
      onChange(editValue);
      setIsEditing(false);
      setHasContent(true);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setHasContent(!!value);
  };

  // Start editing when there's no content
  useEffect(() => {
    if (!hasContent) {
      setIsEditing(true);
    }
  }, [hasContent]);

  if (isEditing || !hasContent) {
    return (
      <div className="flex items-center gap-2 w-full">
        {textarea ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={cn(
              "flex-1 bg-background border rounded-md p-2 text-sm",
              className
            )}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={cn("flex-1 bg-background", className)}
            placeholder={placeholder}
            autoFocus
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={handleSave}
          disabled={!editValue.trim()}
        >
          <Check size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleCancel}
        >
          <X size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center group w-full">
      <div className={cn("flex-1", className)}>{value}</div>
      <button
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground ml-2 transition-opacity"
        onClick={() => {
          setEditValue(value);
          setIsEditing(true);
        }}
      >
        <Edit size={16} />
      </button>
    </div>
  );
};

interface SortableLectureItemProps {
  lecture: Lecture;
  setSections: React.Dispatch<React.SetStateAction<CourseSectionType[]>>;
  sectionId: string;
  setDeletedLectures: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
}

const SortableLectureItem: React.FC<SortableLectureItemProps> = ({
  lecture,
  setSections,
  sectionId,
  setDeletedLectures,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lecture.id });
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field: "title" | "description", value: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lectures: section.lectures.map((l) =>
            l.id === lecture.id ? { ...l, [field]: value } : l
          ),
        };
      })
    );
  };

  const handleDeleteLecture = (sectionId: string, lectureId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lectures: section.lectures
            .filter((lecture) => lecture.id !== lectureId)
            .map((lecture, index) => ({ ...lecture, order: index })),
        };
      })
    );
    setDeletedLectures((prev) => [...prev, { id: lectureId }]);
  };

  const handleAddQuestion = (lectureId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lectures: section.lectures.map((lecture) =>
            lecture.id === lectureId
              ? {
                  ...lecture,
                  quizLecture: {
                    ...lecture.quizLecture,
                    questions: [
                      ...lecture.quizLecture?.questions,
                      {
                        id: createId(),
                        question: "",
                        options: [],
                      },
                    ],
                  },
                }
              : lecture
          ),
        };
      })
    );
  };

  const handleAddOption = (
    lectureId: string,
    questionId: string,
    newOption: string
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        lectures: section.lectures.map((lecture) =>
          lecture.id === lectureId
            ? {
                ...lecture,
                quizLecture: {
                  ...lecture.quizLecture!,
                  questions: lecture.quizLecture!.questions.map((q) =>
                    q.id === questionId
                      ? { ...q, options: [...q.options, newOption] }
                      : q
                  ),
                },
              }
            : lecture
        ),
      }))
    );
  };

  const handleChangeQuestion = ({
    sectionId,
    lectureId,
    questionId,
    field,
    value,
    optionIndex,
  }: {
    sectionId: string;
    lectureId: string;
    questionId: string;
    field: "question" | "options";
    value: string;
    optionIndex?: number;
  }) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lectures: section.lectures.map((lecture) => {
            if (lecture.id !== lectureId) return lecture;
            return {
              ...lecture,
              quizLecture: {
                ...lecture.quizLecture!,
                questions: lecture.quizLecture!.questions.map((question) => {
                  if (question.id !== questionId) return question;

                  if (field === "options" && optionIndex !== undefined) {
                    return {
                      ...question,
                      options: question.options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                      ),
                    };
                  }

                  return {
                    ...question,
                    [field]: value,
                  };
                }),
              },
            };
          }),
        };
      })
    );
  };

  const handleDeleteOption = ({
    sectionId,
    lectureId,
    questionId,
    optionIndex,
  }: {
    sectionId: string;
    lectureId: string;
    questionId: string;
    optionIndex: number;
  }) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lectures: section.lectures.map((lecture) => {
            if (lecture.id !== lectureId) return lecture;
            return {
              ...lecture,
              quizLecture: {
                ...lecture.quizLecture!,
                questions: lecture.quizLecture!.questions.map((question) => {
                  if (question.id !== questionId) return question;
                  return {
                    ...question,
                    options: question.options.filter(
                      (_, idx) => idx !== optionIndex
                    ),
                  };
                }),
              },
            };
          }),
        };
      })
    );
  };

  const getLectureTypeBadge = (type: string) => {
    const baseClasses =
      "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1";

    switch (type) {
      case "VIDEO":
        return (
          <span
            className={cn(
              baseClasses,
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            )}
          >
            <Video size={14} />
            Video
          </span>
        );
      case "QUIZ":
        return (
          <span
            className={cn(
              baseClasses,
              "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            )}
          >
            <HelpCircle size={14} />
            Quiz
          </span>
        );
      case "EXERCISE":
        return (
          <span
            className={cn(
              baseClasses,
              "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
            )}
          >
            <Dumbbell size={14} />
            Exercise
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="border rounded-md bg-card overflow-hidden"
      {...attributes}
    >
      <div className="flex items-center justify-between bg-secondary/30 p-3">
        <div className="flex items-center gap-3 flex-1">
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className="flex items-center gap-2 flex-1">
            <EditableText
              value={lecture.title}
              onChange={(value) => handleChange("title", value)}
              className="flex-1 text-sm font-medium"
              placeholder="Lecture title"
            />
            {getLectureTypeBadge(lecture.type)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => handleDeleteLecture(sectionId, lecture.id)}
          >
            <Trash2 size={16} />
          </Button>
          <button
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
            {...listeners}
          >
            <Grip size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <EditableText
            value={lecture.description}
            onChange={(value) => handleChange("description", value)}
            className="text-sm text-muted-foreground"
            placeholder="Lecture description"
            textarea
          />

          {lecture.type === "VIDEO" && (
            <div className="border border-dashed border-border rounded-md p-6 text-center bg-secondary/20">
              <div className="mx-auto bg-secondary p-3 rounded-full w-max">
                <Video className="h-8 w-8 text-blue-500" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Upload video content
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                <Button variant="outline" size="sm">
                  Select File
                </Button>
              </div>
            </div>
          )}

          {lecture.type === "QUIZ" && (
            <div className="space-y-4">
              {lecture.quizLecture?.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border rounded-md p-4 bg-secondary/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">
                      Question {index + 1}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSections((prev) =>
                          prev.map((section) => {
                            if (section.id !== sectionId) return section;
                            return {
                              ...section,
                              lectures: section.lectures.map((l) => {
                                if (l.id !== lecture.id) return l;
                                return {
                                  ...l,
                                  quizLecture: {
                                    ...l.quizLecture!,
                                    questions: l.quizLecture!.questions.filter(
                                      (q) => q.id !== question.id
                                    ),
                                  },
                                };
                              }),
                            };
                          })
                        );
                      }}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </Button>
                  </div>
                  <Input
                    value={question.question}
                    placeholder={`Question ${index + 1}`}
                    onChange={(e) =>
                      handleChangeQuestion({
                        sectionId: sectionId,
                        lectureId: lecture.id,
                        questionId: question.id,
                        field: "question",
                        value: e.target.value,
                      })
                    }
                    className="mb-3 bg-background"
                  />
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSections((prev) =>
                              prev.map((section) => {
                                if (section.id !== sectionId) return section;
                                return {
                                  ...section,
                                  lectures: section.lectures.map((l) => {
                                    if (l.id !== lecture.id) return l;
                                    return {
                                      ...l,
                                      quizLecture: {
                                        ...l.quizLecture!,
                                        questions: l.quizLecture!.questions.map(
                                          (q) => {
                                            if (q.id !== question.id) return q;
                                            return {
                                              ...q,
                                              correctIndex: optIndex,
                                            };
                                          }
                                        ),
                                      },
                                    };
                                  }),
                                };
                              })
                            );
                          }}
                          className="flex-shrink-0"
                        >
                          {question.correctIndex === optIndex ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />
                          )}
                        </button>
                        <Input
                          value={option}
                          placeholder={`Option ${optIndex + 1}`}
                          onChange={(e) =>
                            handleChangeQuestion({
                              sectionId: sectionId,
                              lectureId: lecture.id,
                              questionId: question.id,
                              field: "options",
                              value: e.target.value,
                              optionIndex: optIndex,
                            })
                          }
                          className="flex-1 bg-background"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            handleDeleteOption({
                              sectionId: sectionId,
                              lectureId: lecture.id,
                              questionId: question.id,
                              optionIndex: optIndex,
                            })
                          }
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleAddOption(lecture.id, question.id, "New option")
                      }
                      className="mt-2 w-full"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={() => handleAddQuestion(lecture.id)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus size={14} className="mr-1" />
                Add Question
              </Button>
            </div>
          )}

          {lecture.type === "EXERCISE" && (
            <div className="border border-dashed border-border rounded-md p-6 text-center bg-secondary/20">
              <div className="mx-auto bg-secondary p-3 rounded-full w-max">
                <Dumbbell className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Add exercise content
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                <Button variant="outline" size="sm">
                  Code Exercise
                </Button>
                <Button variant="outline" size="sm">
                  Text Exercise
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
