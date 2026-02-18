"use client";

type SlideProgressProps = {
  currentSlide: number;
  totalSlides: number;
};

export default function SlideProgress({
  currentSlide,
  totalSlides,
}: SlideProgressProps) {
  const percentage =
    ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="w-full px-8 py-2">
      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Text */}
      <div className="text-sm text-center mt-1">
        Slide {currentSlide + 1} of {totalSlides}
      </div>
    </div>
  );
}
