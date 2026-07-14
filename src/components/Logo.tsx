"use client";

import React, { useState } from "react";
import { Coffee } from "lucide-react";

const DEFAULT_LOCAL_LOGO = "../../logo.png";
const LOCAL_SOURCE = "local";
const EXTERNAL_SOURCE = "external";

export default function Logo({ className = "", alt = "Azuos Logo" }: { className?: string; alt?: string }) {
  const [hasError, setHasError] = useState(false);

  const source = process.env.NEXT_PUBLIC_AZUOS_LOGO_SOURCE || LOCAL_SOURCE;
  const localPath = process.env.NEXT_PUBLIC_AZUOS_LOGO_PATH || DEFAULT_LOCAL_LOGO;
  const externalUrl = process.env.NEXT_PUBLIC_AZUOS_LOGO_URL;

  const src = source === EXTERNAL_SOURCE && externalUrl ? externalUrl : localPath;
  const showImage = !!src && !hasError;

  if (!showImage) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#6CBED9] text-white rounded-full`}>
        <Coffee className="w-5 h-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
