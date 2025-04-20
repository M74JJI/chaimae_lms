"use client";

import React from "react";
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Grip, Plus, Trash2 } from "lucide-react";

interface ClickToAddInputsProps {
  details: string[];
  setDetails: React.Dispatch<React.SetStateAction<string[]>>;
  minInputs?: number;
}

const ClickToAddInputs: React.FC<ClickToAddInputsProps> = ({
  details,
  setDetails,
  minInputs = 1,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = details.findIndex(
        (_, idx) => `item-${idx}` === active.id
      );
      const newIndex = details.findIndex((_, idx) => `item-${idx}` === over.id);
      setDetails((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...details];
    updated[index] = value;
    setDetails(updated);
  };

  const handleAddAt = (index: number) => {
    const updated = [...details];
    updated.splice(index + 1, 0, "");
    setDetails(updated);
  };

  const handleRemove = (index: number) => {
    if (details.length <= minInputs) return;
    const updated = details.filter((_, i) => i !== index);
    setDetails(updated);
  };

  const visibleInputsCount = Math.max(details.length, minInputs);
  const items = Array.from(
    { length: visibleInputsCount },
    (_, i) => details[i] || ""
  );
  const handleAdd = () => setDetails((prev) => [...prev, ""]);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((_, index) => `item-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("flex flex-col gap-y-4 px-4")}>
          {items.map((value, index) => (
            <SortableInputItem
              key={`item-${index}`}
              id={`item-${index}`}
              index={index}
              value={value}
              onChange={handleChange}
              onAdd={handleAddAt}
              onRemove={handleRemove}
              disableRemove={details.length <= minInputs}
            />
          ))}
          <Button
            variant="outline"
            onClick={handleAdd}
            className="w-full justify-center"
          >
            <Plus className="mr-2" size={16} /> Add more to your response
          </Button>
        </div>
      </SortableContext>
    </DndContext>
  );
};

interface SortableInputItemProps {
  id: string;
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
  disableRemove: boolean;
}

const SortableInputItem: React.FC<SortableInputItemProps> = ({
  id,
  index,
  value,
  onChange,
  onAdd,
  onRemove,
  disableRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-md shadow-sm transition-transform"
      )}
      {...attributes}
      {...listeners}
    >
      <Input
        value={value}
        placeholder="Enter value"
        onChange={(e) => onChange(index, e.target.value)}
      />
      <div className="cursor-pointer border rounded-md p-1 bg-main-hover">
        <Grip />
      </div>
      {!disableRemove && <RemoveButton onClick={() => onRemove(index)} />}
    </div>
  );
};

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <div
    className="cursor-pointer border rounded-md p-1 hover:bg-red-500"
    onClick={onClick}
  >
    <Trash2 />
  </div>
);

export default ClickToAddInputs;
