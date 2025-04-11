"use client";

import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

/**
 * CaptchaBtnLoader
 *
 * Displays a small spinner alongside a security check message,
 * typically used during CAPTCHA or verification-related actions.
 */
export default function CaptchaBtnLoader() {
  return (
    <div className="flex items-center justify-center gap-x-1">
      <ClipLoader size={16} color="#444" />
      Performing Security Check...
    </div>
  );
}
