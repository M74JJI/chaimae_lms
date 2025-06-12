"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { saveLectureProgress } from "@/modules/course/actions/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CoursePlayerProps {
  videoUrl: string;
  videoName: string;
  duration?: number;
  lectureId: string;
  courseId: string;
  userId: string;
  initialProgress: number;
}

export function CoursePlayer({
  videoUrl,
  videoName,
  duration,
  lectureId,
  courseId,
  userId,
  initialProgress,
}: CoursePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialProgress);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [isLoading, setIsLoading] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Save progress to database periodically
  useEffect(() => {
    const saveProgress = async () => {
      if (progress > 0 && progress < 100) {
        await saveLectureProgress({
          userId,
          courseId,
          lectureId,
          progress,
          completed: false,
        });
      } else if (progress >= 100) {
        await saveLectureProgress({
          userId,
          courseId,
          lectureId,
          progress: 100,
          completed: true,
        });
      }
    };

    const timer = setTimeout(saveProgress, 2000); // Debounce saving
    return () => clearTimeout(timer);
  }, [progress, userId, courseId, lectureId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoading(false);
    const handleTimeUpdate = () => {
      const newProgress = (video.currentTime / video.duration) * 100;
      setProgress(newProgress);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    // Set initial time based on progress
    if (initialProgress > 0 && video.readyState > 0) {
      video.currentTime = (initialProgress / 100) * video.duration;
    }

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [initialProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (Number(e.target.value) / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Number(e.target.value) / 100;
    video.volume = newVolume;
    setVolume(newVolume * 100);
    setIsMuted(newVolume === 0);
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain bg-black"
        onClick={togglePlay}
        autoPlay
      />

      {/* Overlay Controls */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={togglePlay}
          className="bg-black/50 rounded-full p-6 text-white hover:scale-110 transition-transform"
        >
          {isPlaying ? (
            <Icons.pause className="h-10 w-10" />
          ) : (
            <Icons.play className="h-10 w-10" />
          )}
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:bg-white/10 p-1 rounded-full"
              >
                {isPlaying ? (
                  <Icons.pause className="h-5 w-5" />
                ) : (
                  <Icons.play className="h-5 w-5" />
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMute}
                  className="text-white hover:bg-white/10 p-1 rounded-full"
                >
                  {isMuted || volume === 0 ? (
                    <Icons.volumeX className="h-5 w-5" />
                  ) : (
                    <Icons.volume2 className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>

              {/* Time Display */}
              <div className="flex items-center gap-1 text-white text-sm">
                <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
                <span>/</span>
                <span>
                  {formatTime(duration || videoRef.current?.duration || 0)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback Speed */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    {playbackRate}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-0">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={playbackRate === rate ? "bg-secondary" : ""}
                    >
                      {rate}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Quality Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    Quality: {quality}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-0">
                  {["auto", "1080p", "720p", "480p"].map((q) => (
                    <DropdownMenuItem
                      key={q}
                      onClick={() => setQuality(q)}
                      className={quality === q ? "bg-secondary" : ""}
                    >
                      {q}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/10 p-1 rounded-full"
              >
                {isFullscreen ? (
                  <Icons.minimize className="h-5 w-5" />
                ) : (
                  <Icons.maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
