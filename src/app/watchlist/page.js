"use client";

import { useEffect, useState } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "../features/Header";
import { Footer } from "../features/Footer";
import { MovieCard } from "../components/Moviecard";

export default function WatchlistPage() {
  const router = useRouter();

  const [watchlist, setWatchlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage-оос watchlist унших
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem("moviez:watchlist");

      if (savedWatchlist) {
        const parsed = JSON.parse(savedWatchlist);

        if (Array.isArray(parsed)) {
          const validMovies = parsed
            .filter((movie) => movie && movie.id)
            .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

          setWatchlist(validMovies);
        } else {
          setWatchlist([]);
        }
      } else {
        setWatchlist([]);
      }
    } catch (error) {
      console.error("WATCHLIST ERROR:", error);
      setWatchlist([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  // Watchlist-ийг localStorage-д хадгалах
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("moviez:watchlist", JSON.stringify(watchlist));
    } catch (error) {
      console.error("WATCHLIST SAVE ERROR:", error);
    }
  }, [watchlist, isLoaded]);

  // Heart дарахад movie устгах
  const handleRemove = (movieId) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  // Бүгдийг устгах
  const handleClearAll = () => {
    setWatchlist([]);
  };

  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-140px)] bg-[var(--background)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-10">
          {/* PAGE HEADER */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--foreground)]">
                Watchlist
              </h1>

              {isLoaded && (
                <p className="mt-1 text-sm text-gray-500">
                  {watchlist.length}{" "}
                  {watchlist.length === 1 ? "movie" : "movies"} saved
                </p>
              )}
            </div>

            {isLoaded && watchlist.length > 0 && (
              <button
                onClick={handleClearAll}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-red-500 hover:text-red-500"
              >
                Clear all
              </button>
            )}
          </div>

          {/* LOADING */}
          {!isLoaded && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="aspect-[229.73/340] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

                  <div className="mt-2 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

                  <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {isLoaded && watchlist.length === 0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <Heart size={40} strokeWidth={1.5} className="text-gray-400" />

              <h2 className="mt-4 text-lg font-bold text-[var(--foreground)]">
                Nothing saved yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tap the heart on any poster
              </p>

              <button
                onClick={() => router.push("/")}
                className="mt-5 flex h-10 items-center gap-2 rounded-lg bg-[#6C5CE7] px-5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <ArrowLeft size={16} />
                Browse movies
              </button>
            </div>
          )}

          {/* WATCHLIST GRID */}
          {isLoaded && watchlist.length > 0 && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {watchlist.map((movie) => (
                <div key={movie.id} className="relative">
                  {/* HEART */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(movie.id);
                    }}
                    className="absolute right-2 top-2 z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-white/15 bg-[#F43F5E] text-white transition hover:scale-110"
                    aria-label={`Remove ${movie.title} from watchlist`}
                  >
                    <Heart size={14} strokeWidth={2} fill="currentColor" />
                  </button>

                  {/* MOVIE */}
                  <div
                    onClick={() => router.push(`/detail/${movie.id}`)}
                    className="cursor-pointer"
                  >
                    <MovieCard
                    movie={movie}
                      image={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : movie.image
                      }
                      title={movie.title}
                      rating={
                        movie.vote_average !== undefined
                          ? Number(movie.vote_average).toFixed(1)
                          : movie.rating
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
