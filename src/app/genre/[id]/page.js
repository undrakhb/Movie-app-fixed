"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Header } from "../../features/Header";
import { Footer } from "../../features/Footer";
import { MovieCard } from "../../components/Moviecard";
import { MovieSkeleton } from "../../components/MovieSkeleton";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

// TMDB caps discover pagination at 500 pages.
const MAX_PAGE = 500;

export default function GenrePage() {
  const { id } = useParams();
  const router = useRouter();

  // Genre IDs from the URL (comma separated, URL-encoded as %2C).
  const selectedGenreIds = id
    ? decodeURIComponent(String(id))
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  const genreKey = selectedGenreIds.join(",");

  const selectedGenres = genres.filter((genre) =>
    selectedGenreIds.includes(String(genre.id)),
  );

  const handleGenreClick = (genreId) => {
    const idString = String(genreId);

    const next = selectedGenreIds.includes(idString)
      ? selectedGenreIds.filter((value) => value !== idString)
      : [...selectedGenreIds, idString];

    router.push(`/genre/${next.length === 0 ? "28" : next.join("%2C")}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <h2 className="text-3xl font-semibold">Search Filter</h2>

        <div className="mt-6 flex flex-col gap-8 border-t border-gray-200 pt-6 md:flex-row md:gap-10">
          {/* GENRES */}
          <aside className="shrink-0 md:w-48">
            <h3 className="mb-2 text-lg font-semibold">Genres</h3>

            <p className="mb-4 text-xs text-gray-500">
              See lists of movies by genre
            </p>

            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => {
                const active = selectedGenreIds.includes(String(genre.id));

                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleGenreClick(genre.id)}
                    className={`flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold transition ${
                      active
                        ? "border-[#4338CA] bg-[#4338CA] text-white"
                        : "border-gray-200 text-[var(--foreground)] hover:border-[#4338CA] hover:text-[#4338CA]"
                    }`}
                  >
                    <span>{genre.name}</span>

                    <ChevronRight size={10} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Remount on genre change so pagination resets to page 1. */}
          <GenreResults
            key={genreKey}
            genreParam={selectedGenreIds.join("%2C")}
            genreNames={selectedGenres.map((genre) => genre.name).join(", ")}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function GenreResults({ genreParam, genreNames }) {
  const router = useRouter();

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=${genreParam}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${api_token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Movie API error");
        }

        const data = await response.json();

        if (ignore) return;

        setMovies(data.results || []);
        setTotalResults(data.total_results || 0);
        setTotalPages(Math.min(data.total_pages || 1, MAX_PAGE));
      } catch (error) {
        if (ignore) return;

        console.error(error);
        setErrorMessage("MOVIE API ERROR");
        setMovies([]);
        setTotalResults(0);
        setTotalPages(1);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      ignore = true;
    };
  }, [genreParam, currentPage]);

  const getPageNumbers = () => {
    const last = totalPages;

    if (last <= 7) {
      return Array.from({ length: last }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", last];
    }

    if (currentPage >= last - 3) {
      return [1, "...", last - 4, last - 3, last - 2, last - 1, last];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      last,
    ];
  };

  const headingText = loading
    ? "Loading..."
    : `${totalResults.toLocaleString()} titles${
        genreNames ? ` in "${genreNames}"` : ""
      }`;

  return (
    <section className="min-w-0 flex-1">
      <h3 className="mb-5 text-xl font-semibold">{headingText}</h3>

      {loading ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, index) => (
            <MovieSkeleton key={index} />
          ))}
        </div>
      ) : errorMessage ? (
        <p className="py-10 text-center text-sm text-red-500">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          No movies found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => router.push(`/detail/${movie.id}`)}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                <MovieCard
                  movie={movie}
                  image={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.png"
                  }
                  title={movie.title}
                  rating={
                    movie.vote_average !== undefined
                      ? movie.vote_average.toFixed(1)
                      : "0.0"
                  }
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 py-2 text-sm text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-10 rounded-md border px-3 py-2 text-sm transition ${
                      currentPage === page
                        ? "border-[#4338CA] bg-[#4338CA] text-white"
                        : "hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
