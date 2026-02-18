"use client";

import { memo } from "react";

type Slide = {
  title: string;
  content: string[];
};

type SlideRendererProps = {
  slide: Slide;
};

type LayoutType = "title" | "bullets" | "summary";

function getLayoutType(slide: Slide): LayoutType {
  if (!Array.isArray(slide.content) || slide.content.length === 0) {
    return "title";
  }
  if (slide.content.length <= 2) {
    return "summary";
  }
  return "bullets";
}

function SlideRendererComponent({ slide }: SlideRendererProps) {
  const layout = getLayoutType(slide);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-5xl aspect-[16/9] border rounded-lg bg-white p-10 flex">
        {layout === "title" && (
          <div className="flex flex-1 items-center justify-center">
            <h1 className="text-4xl font-bold text-center">
              {slide.title}
            </h1>
          </div>
        )}

        {layout === "bullets" && (
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">
              {slide.title}
            </h1>
            <ul className="list-disc ml-6 space-y-3 text-lg">
              {slide.content.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {layout === "summary" && (
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">
              {slide.title}
            </h1>
            <div className="space-y-4 text-xl">
              {slide.content.map((point, index) => (
                <p key={index}>• {point}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SlideRendererComponent);
