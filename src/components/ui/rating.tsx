"use client";

import * as React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  size?: number;
  className?: string;
}

export function Rating({ value, size = 20, className }: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="fill-yellow-500 text-yellow-500"
        />
      ))}
      {hasHalfStar && (
        <div className="relative" style={{ width: size, height: size }}>
          <Star size={size} className="text-yellow-500" />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: "50%", height: size }}
          >
            <Star size={size} className="fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-muted-foreground"
        />
      ))}
    </div>
  );
}
