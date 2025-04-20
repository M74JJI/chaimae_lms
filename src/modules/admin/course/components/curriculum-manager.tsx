"use client";

import React, { useState } from "react";
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
import { Grip, Video, HelpCircle, Dumbbell } from "lucide-react";
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleSectionDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-y-6">
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
          <Button onClick={addNewSection}>+ Add Section</Button>
        </div>
      </SortableContext>
    </DndContext>
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

  const addLecture = (type: LectureTypeEnum) => {
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
            },
          ],
        };
      })
    );
  };
  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
    setDeletedSections((prev) => [...prev, { id: sectionId }]); // Track deleted section
  };
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-lg border shadow-sm p-4"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2 mb-2">
        <Input
          value={section.title}
          placeholder="Section title"
          onChange={(e) => onChange(section.id, "title", e.target.value)}
        />
        <Button
          size="icon"
          variant="destructive"
          onClick={() => handleDeleteSection(section.id)}
        >
          ✖
        </Button>
        <div className="cursor-pointer border rounded-md p-1 bg-main-hover">
          <Grip />
        </div>
      </div>
      <Input
        value={section.description || ""}
        placeholder="Section description"
        onChange={(e) => onChange(section.id, "description", e.target.value)}
        className="mb-4"
      />

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => onLectureDragEnd(section.id, event)}
      >
        <SortableContext
          items={section.lectures.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
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

      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={() => addLecture("VIDEO")}>
          {" "}
          <Video className="mr-2 h-4 w-4" /> Video{" "}
        </Button>
        <Button variant="outline" onClick={() => addLecture("QUIZ")}>
          {" "}
          <HelpCircle className="mr-2 h-4 w-4" /> Quiz{" "}
        </Button>
        <Button variant="outline" onClick={() => addLecture("EXERCISE")}>
          {" "}
          <Dumbbell className="mr-2 h-4 w-4" /> Exercise{" "}
        </Button>
      </div>
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
    setDeletedLectures((prev) => [...prev, { id: lectureId }]); // Track deleted lecture
  };
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex flex-col gap-2 border p-2 rounded-md shadow-sm"
      {...attributes}
    >
      <div className="flex items-center gap-x-2">
        <Input
          value={lecture.title}
          placeholder="Lecture title"
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <Button
          size="icon"
          variant="destructive"
          onClick={() => handleDeleteLecture(sectionId, lecture.id)}
        >
          ✖
        </Button>
        <div
          className="cursor-pointer border rounded-md p-1 bg-main-hover"
          {...listeners}
        >
          <Grip />
        </div>
      </div>
      <Input
        value={lecture.description || ""}
        placeholder="Lecture description"
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <div className="text-sm text-gray-500">Type: {lecture.type}</div>
      {lecture.type === "VIDEO" && (
        <div className="text-blue-600">[Video Upload Button Placeholder]</div>
      )}
      {lecture.type === "QUIZ" && (
        <div className="text-green-600">[Quiz Questions Setup Placeholder]</div>
      )}
      {lecture.type === "EXERCISE" && (
        <div className="text-purple-600">[Exercise Content Placeholder]</div>
      )}
    </div>
  );
};
