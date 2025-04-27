"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud, FileVideo } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LectureVideoUploadProps {
  onUploadSuccess: (url: string, name: string) => void;
  onRemove: () => void;
  currentVideoUrl?: string;
}

export const LectureVideoUpload: React.FC<LectureVideoUploadProps> = ({
  onUploadSuccess,
  onRemove,
  currentVideoUrl,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoName, setVideoName] = useState("");

  const handleUpload = (result: any, widget: any) => {
    if (result.event === "success") {
      setUploadProgress(100);
      onUploadSuccess(result.info.secure_url, result.info.original_filename);
      setVideoName(result.info.original_filename);
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } else if (result.event === "progress") {
      setUploadProgress(result.progress);
      setIsUploading(true);
    }
  };

  return (
    <div className="border border-dashed border-border rounded-md p-6 bg-secondary/20 w-full">
      {currentVideoUrl ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 bg-secondary p-2 rounded-full">
            <FileVideo className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">
              {videoName || "lecture-video.mp4"}
            </span>
          </div>
          <video
            src={currentVideoUrl}
            controls
            className="w-full max-w-[640px] h-auto rounded-md"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onRemove();
              setVideoName("");
            }}
            className="mt-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Video
          </Button>
        </div>
      ) : (
        <CldUploadWidget
          onSuccess={handleUpload}
          uploadPreset="ufb48euh" // Replace with your actual upload preset
          options={{
            sources: ["local"],
            resourceType: "video",
            multiple: false,
            clientAllowedFormats: ["mp4", "mov", "avi", "mkv"],
            maxFileSize: 104857600, // 100MB
            showAdvancedOptions: false,
            styles: {
              palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#0078FF",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#0078FF",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#0078FF",
                complete: "#20B832",
                sourceBg: "#E4EBF1",
              },
              fonts: {
                default: {
                  active: true,
                },
              },
            },
          }}
        >
          {({ open }) => (
            <div className="flex flex-col items-center space-y-4">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Drag and drop your video file here, or
                </p>
                <Button
                  variant="outline"
                  onClick={() => open()}
                  disabled={isUploading}
                >
                  Select Video File
                </Button>
              </div>
              {isUploading && (
                <div className="w-full max-w-md space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Supported formats: MP4, MOV, AVI, MKV (max 100MB)
              </p>
            </div>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
};
