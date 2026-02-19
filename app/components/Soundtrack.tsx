"use client";
// This file provides a simple React audio player for background soundtrack
import React, { useEffect, useRef } from "react";

interface SoundtrackProps {
  src: string;
}

const Soundtrack: React.FC<SoundtrackProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      // Try to autoplay (may require user interaction)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [src]);

  return (
    <audio ref={audioRef} src={src} loop autoPlay style={{ display: "none" }} />
  );
};

export default Soundtrack;
