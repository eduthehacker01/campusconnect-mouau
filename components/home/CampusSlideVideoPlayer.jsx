"use client";

import { useState, useEffect } from "react";

const ADMIN_BLOCK_IMG = "/mouau-admin-block.jpg";

const MOUAU_CAMPUS_SLIDES = [
  {
    title: "Michael Okpara University of Agriculture — Admin Block",
    image: ADMIN_BLOCK_IMG,
    video:
      "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-university-campus-41559-large.mp4",
  },
  {
    title: "MOUAU & ABSU Student Community",
    image: ADMIN_BLOCK_IMG,
    video:
      "https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-4519-large.mp4",
  },
  {
    title: "Campus Entrepreneurship & Opportunities",
    image: ADMIN_BLOCK_IMG,
    video:
      "https://assets.mixkit.co/videos/preview/mixkit-young-people-studying-together-outside-4527-large.mp4",
  },
];

export function CampusSlideVideoPlayer({ compact = false, hero = false }) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((i) => (i + 1) % MOUAU_CAMPUS_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const current = MOUAU_CAMPUS_SLIDES[slideIdx];
  const sizeCls = hero
    ? "h-72 sm:h-[380px] lg:h-[430px]"
    : compact
    ? "h-52 sm:h-64"
    : "h-60 sm:h-72";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-brand-700/60 bg-forest-950 shadow-2xl ${sizeCls}`}
    >
      <div key={slideIdx} className="video-slide-in relative h-full w-full">
        <img
          src={current.image}
          alt={current.title}
          className="ken-burns h-full w-full object-cover"
        />
        <video
          key={current.video}
          src={current.video}
          poster={current.image}
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
        />
      </div>
    </div>
  );
}
