"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";

interface CoursePlayerProps {
  videoUrl: string;
  videoName: string;
  duration?: number;
}

export function CoursePlayer({
  videoUrl,
  videoName,
  duration,
}: CoursePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

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
          className="bg-black/50 rounded-full p-4 text-white"
        >
          {isPlaying ? (
            <>{/* <Icons.pause className="h-8 w-8" /> */} Pause</>
          ) : (
            <Icons.play className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? (
              <>{/* <Icons.pause className="h-5 w-5" /> */} Pause</>
            ) : (
              <Icons.play className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-1 text-white text-sm">
            <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
            <span>/</span>
            <span>
              {formatTime(duration || videoRef.current?.duration || 0)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-white">
              {isMuted || volume === 0 ? (
                <>{/* <Icons.volumeX className="h-5 w-5" /> */}</>
              ) : (
                <>{/*  <Icons.volume2 className="h-5 w-5" /> */}</>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />

            <button onClick={toggleFullscreen} className="text-white">
              {isFullscreen ? (
                <>
                  {/*
                    <Icons.minimize className="h-5 w-5" />
                    */}
                </>
              ) : (
                <>
                  {/*
                <Icons.maximize className="h-5 w-5" />
                */}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
