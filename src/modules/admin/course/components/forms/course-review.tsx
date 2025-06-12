"use client";

import { FC, useState } from "react";
import { CourseStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SubmittedCourseType } from "../../types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCourseDuration } from "@/modules/course/utils";

interface CourseReviewProps {
  course: SubmittedCourseType;
  onStatusChange?: (
    status: CourseStatus,
    rejectionReason?: string
  ) => Promise<void>;
}

const CourseReview: FC<CourseReviewProps> = ({ course, onStatusChange }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    details: true,
    curriculum: false,
    objectives: false,
    requirements: false,
    media: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePublish = async () => {
    if (!onStatusChange) return;
    setIsLoading(true);
    try {
      await onStatusChange(CourseStatus.PUBLISHED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!onStatusChange) return;
    if (showRejectionInput && !rejectionReason) return;

    setIsLoading(true);
    try {
      await onStatusChange(CourseStatus.DRAFT, rejectionReason);
      setShowRejectionInput(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (course.status) {
      case CourseStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case CourseStatus.SUBMITTED:
        return (
          <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
        );
      case CourseStatus.PUBLISHED:
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case CourseStatus.ARCHIVED:
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] overflow-y-auto">
      {/* Scrollable Content */}
      <div className="flex-1 space-y-4 p-4">
        {/* Header */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold max-w-[480px] break-words">
              {course.title}
            </h2>
            <p className="text-muted-foreground text-sm max-w-[480px] break-words">
              {course.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full  justify-end">
            {getStatusBadge()}
            <span className="text-xs text-muted-foreground">
              {new Date(course.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {/* Course Media */}
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection("media")}
          >
            <CardTitle className="text-base">Course Media</CardTitle>
            {expandedSections.media ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </CardHeader>
          {!expandedSections.media && (
            <CardContent className="pt-0 space-y-3">
              <div>
                <Label className="text-sm">Thumbnail</Label>
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt="Course thumbnail"
                    className="mt-1 rounded-md object-cover w-full h-64"
                  />
                ) : (
                  <div className="mt-1 flex items-center justify-center h-32 bg-muted rounded-md">
                    <span className="text-xs text-muted-foreground">
                      No thumbnail
                    </span>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm">Promotional Video</Label>
                {course.promotionalVideo ? (
                  <div className="mt-1 aspect-video bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      Video preview
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    No promotional video
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection("details")}
          >
            <CardTitle className="text-base">Course Details</CardTitle>
            {expandedSections.details ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </CardHeader>
          {expandedSections.details && (
            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Instructor</Label>
                  <p className="text-sm font-medium">
                    {course.instructorProfile?.user?.name || "-"}
                  </p>
                </div>
                <div></div>
                <div>
                  <Label className="text-sm">Category</Label>
                  <p className="text-sm font-medium">
                    {course.category?.name} /&nbsp;
                    {course.subcategory?.name || "None"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">Difficulty</Label>
                  <p className="text-sm font-medium">
                    {course.difficultyLevel}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">Duration</Label>
                  <p className="text-sm font-medium">
                    {course.duration > 0
                      ? formatCourseDuration(course.duration)
                      : 0}
                    &nbsp; hours ({course.numLectures} lectures)
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm">Description</Label>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                  {course.description || "No description provided"}
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Learning Objectives */}
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection("objectives")}
          >
            <CardTitle className="text-base">Learning Objectives</CardTitle>
            {expandedSections.objectives ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </CardHeader>
          {expandedSections.objectives && (
            <CardContent className="pt-0">
              {course.objectives?.length > 0 ? (
                <ul className="space-y-2">
                  {course.objectives.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No learning objectives provided
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection("requirements")}
          >
            <CardTitle className="text-base">Requirements</CardTitle>
            {expandedSections.requirements ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </CardHeader>
          {expandedSections.requirements && (
            <CardContent className="pt-0 space-y-3">
              <div>
                <Label className="text-sm">Intended Learners</Label>
                {course.intendedLearners?.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {course.intendedLearners.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No intended learners specified
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm">Prerequisites</Label>
                {course.prerequisites?.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {course.prerequisites.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No prerequisites specified
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>
        {/* Curriculum */}
        <Card>
          <CardHeader
            className="flex flex-row items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection("curriculum")}
          >
            <CardTitle className="text-base">Curriculum</CardTitle>
            {expandedSections.curriculum ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </CardHeader>
          {expandedSections.curriculum && (
            <CardContent className="pt-0">
              {course.sections?.length > 0 ? (
                <div className="space-y-3">
                  {course.sections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-3">
                      <h3 className="font-medium text-sm">{section.title}</h3>
                      {section.description && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {section.description}
                        </p>
                      )}
                      <div className="space-y-2">
                        {section.lectures?.map((lecture) => (
                          <div
                            key={lecture.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="w-5 h-5 flex items-center justify-center bg-muted rounded-full text-xs">
                              {lecture.order}
                            </span>
                            <span className="flex-1">{lecture.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {lecture.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No curriculum added yet
                </p>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Fixed Footer with Actions */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        {showRejectionInput ? (
          <div className="space-y-3">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide specific feedback for improvements..."
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectionInput(false)}
                className="flex-1"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeny}
                disabled={isLoading || !rejectionReason}
                className="flex-1"
                size="sm"
              >
                {isLoading ? "Sending..." : "Send Feedback"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRejectionInput(true)}
              disabled={isLoading}
              className="flex-1"
              size="sm"
            >
              Request Changes
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading}
              className="flex-1"
              size="sm"
            >
              {isLoading ? "Processing..." : "Approve Course"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReview;
