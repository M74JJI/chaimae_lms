import {
  DifficultyLevel,
  ExerciseLecture,
  Prisma,
  Question,
  QuizLecture,
  Section,
  VideoLecture,
} from "@prisma/client";

export type CourseDataType = {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  thumbnail: string;
  promotionalVideo: string;
  status: CourseStatusType;
  difficultyLevel: DifficultyLevelType;
  intendedLearners: string[];
  prerequisites: string[];
  objectives: string[];
  categoryId: string;
  subcategoryId: string;
  languageId: string;
};
export type CourseStatusType = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type DifficultyLevelType =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT"
  | "ALL";

export type CourseTabsStatus = {
  status: CourseStatusType;
  intendedLearners: boolean;
  objectives: boolean;
  prerequisites: boolean;
  curriculum: boolean;
  landing: boolean;
  pricing: boolean;
  messages: boolean;
};

export type CourseLandingType = {
  title: string;
  subtitle?: string;
  description?: string;
  languageId?: string;
  categoryId?: string;
  subcategoryId?: string;
  difficultyLevel?: DifficultyLevel;
  thumbnail?: string;
  promotionalVideo?: string;
};
export const DifficultyLevels: { label: string; value: DifficultyLevel }[] = [
  { label: "Beginner", value: DifficultyLevel.BEGINNER },
  { label: "Intermediate", value: DifficultyLevel.INTERMEDIATE },
  { label: "Advanced", value: DifficultyLevel.ADVANCED },
  { label: "Expert", value: DifficultyLevel.EXPERT },
  { label: "All Levels", value: DifficultyLevel.ALL },
];

// types.ts or wherever you define types

export type CourseSectionType = Prisma.SectionGetPayload<{
  include: {
    lectures: {
      include: {
        exerciseLecture: true;
        quizLecture: {
          include: {
            questions: true;
          };
        };
        videoLecture: true;
      };
    };
  };
}>;

export type QuizLectureWithQuestionsType = QuizLecture & {
  questions: Question[];
};
