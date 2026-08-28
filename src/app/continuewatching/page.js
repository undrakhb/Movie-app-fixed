"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const timeAgo = (timestamp) => {
  const diff = Date.now() - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)} minutes ago`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)} hours ago`;
  }

  if (diff < 2 * day) {
    return "Yesterday";
  }

  return `${Math.floor(diff / day)} days ago`;
};

export default function ContinueWatching() {
  const router = useRouter();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("moviez:recent");

      if (!saved) {
        setRecent([]);
        return;
      }

      const list = JSON.parse(saved);

      if (Array.isArray(list)) {
        setRecent(list.slice(0, 5));
      } else {
        setRecent([]);
      }
    } catch {
      setRecent([]);
    }
  }, []);

  const clearRecent = () => {
    localStorage.removeItem("moviez:recent");
    setRecent([]);
  };

  if (recent.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold uppercase">Continue Watching</h2>

        <button
          type="button"
          onClick={clearRecent}
          className="text-[13px] font-semibold text-[#9A9AA6] transition-colors hover:text-[#FAFAFA]"
        >
          Clear
        </button>
      </div>

      {/* MOVIES */}
      <div className="flex justify-center gap-[10px] sm:justify-start sm:gap-6">
        {recent.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => router.push(`/detail/${movie.id}`)}
            className={`
              w-[157.5px]
              shrink-0
              cursor-pointer
              transition-transform
              duration-200
              hover:scale-105

              ${index >= 2 ? "hidden sm:block" : ""}

              sm:w-[180px]
            `}
          >
            {/* POSTER */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="
                  h-[233.1px]
                  w-[157.5px]
                  rounded-lg
                  object-cover

                  sm:h-[270px]
                  sm:w-[180px]
                "
              />

              {/* PROGRESS */}
              <div className="absolute bottom-0 left-0 h-[8px] w-full bg-[#26262E]">
                <div
                  className="h-full bg-[#6C5CE7]"
                  style={{
                    width: `${movie.progress || 0}%`,
                  }}
                />
              </div>
            </div>

            {/* TITLE */}
            <h3 className="mt-2 truncate text-[15px] font-semibold">
              {movie.title}
            </h3>

            {/* TIME */}
            <p className="mt-1 text-xs font-medium text-[#9A9AA6]">
              {timeAgo(movie.openedAt)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
