"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Heart,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { HeaderLogo } from "../icon/Headerlogo";

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

export const Header = () => {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const genreRef = useRef(null);

  const router = useRouter();

  const api_token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";

  // =========================
  // SEARCH MOVIES
  // =========================

  const searchMovies = async () => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          search.trim(),
        )}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${api_token}`,
          },
        },
      );

      const data = await response.json();

      setSuggestions(data.results?.slice(0, 5) || []);
    } catch (error) {
      console.error("SEARCH ERROR:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // =========================
  // SEARCH DEBOUNCE
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // OUTSIDE CLICK
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedSearch =
        searchRef.current && searchRef.current.contains(event.target);

      const clickedGenre =
        genreRef.current && genreRef.current.contains(event.target);

      if (!clickedSearch && !clickedGenre) {
        setSuggestions([]);
        setIsGenreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // THEME
  // =========================

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // =========================
  // WATCHLIST COUNT
  // =========================

  useEffect(() => {
    const updateWatchlistCount = () => {
      try {
        const saved = localStorage.getItem("moviez:watchlist");

        if (!saved) {
          setWatchlistCount(0);
          return;
        }

        const list = JSON.parse(saved);

        setWatchlistCount(Array.isArray(list) ? list.length : 0);
      } catch {
        setWatchlistCount(0);
      }
    };

    updateWatchlistCount();

    window.addEventListener("watchlistChanged", updateWatchlistCount);

    return () => {
      window.removeEventListener("watchlistChanged", updateWatchlistCount);
    };
  }, []);

  // =========================
  // THEME TOGGLE
  // =========================

  const handleThemeToggle = () => {
    setIsDark((prev) => {
      const next = !prev;

      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return next;
    });
  };

  // =========================
  // OPEN MOBILE SEARCH
  // =========================

  const handleOpenMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setIsGenreOpen(false);
  };

  // =========================
  // CLOSE MOBILE SEARCH
  // =========================

  const handleCloseMobileSearch = () => {
    setSearch("");
    setSuggestions([]);
    setIsGenreOpen(false);
    setIsMobileSearchOpen(false);
  };

  // =========================
  // OPEN MOVIE
  // =========================

  const handleMovieClick = (movie) => {
    setSearch("");
    setSuggestions([]);
    setIsMobileSearchOpen(false);
    setIsGenreOpen(false);

    router.push(`/detail/${movie.id}`);
  };

  // =========================
  // ENTER SEARCH
  // =========================

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search/${encodeURIComponent(search.trim())}`);

      setSearch("");
      setSuggestions([]);
      setIsMobileSearchOpen(false);
      setIsGenreOpen(false);
    }
  };

  return (
    <header className="relative z-50 w-full bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="relative flex h-9 items-center justify-between">
          {/* ========================= */}
          {/* LOGO */}
          {/* ========================= */}

          <div
            onClick={() => router.push("/")}
            className={`
              flex
              shrink-0
              cursor-pointer
              items-center
              gap-2
              ${isMobileSearchOpen ? "hidden md:flex" : "flex"}
            `}
          >
            <HeaderLogo />

            <span className="text-xl font-bold italic text-[#4338CA]">
              MovieZ
            </span>
          </div>

          {/* ========================= */}
          {/* CENTER CONTROLS */}
          {/* ========================= */}

          <div
            className={`
              flex
              items-center
              gap-2

              ${isMobileSearchOpen ? "absolute inset-0 w-full" : "ml-auto"}

              md:absolute
              md:left-1/2
              md:top-1/2
              md:w-auto
              md:-translate-x-1/2
              md:-translate-y-1/2
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ========================= */}
            {/* MOBILE SEARCH ICON */}
            {/* ========================= */}

            {!isMobileSearchOpen && (
              <button
                type="button"
                onClick={handleOpenMobileSearch}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-[#E4E4E7]
                  text-[var(--foreground)]
                  md:hidden
                "
              >
                <Search size={16} strokeWidth={2} />
              </button>
            )}

            {/* ========================= */}
            {/* GENRE */}
            {/* ========================= */}

            <div
              ref={genreRef}
              className={`
                relative
                shrink-0

                ${isMobileSearchOpen ? "flex" : "hidden md:flex"}
              `}
            >
              <button
                type="button"
                onClick={() => setIsGenreOpen((prev) => !prev)}
                className="
                  flex
                  h-9
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-[#E4E4E7]
                  bg-[var(--background)]
                  px-2.5
                  text-[var(--foreground)]
                  md:px-4
                "
              >
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`
                    transition-transform
                    duration-200
                    ${isGenreOpen ? "rotate-180" : ""}
                  `}
                />

                <span className="hidden md:inline">Genre</span>
              </button>

              {/* ========================= */}
              {/* GENRE DROPDOWN */}
              {/* ========================= */}

              {isGenreOpen && (
                <div
                  className="
                    absolute
                    left-0
                    top-full
                    z-[9999]
                    mt-2
                    w-[320px]
                    max-w-[calc(100vw-32px)]
                    rounded-lg
                    border
                    border-[#E4E4E7]
                    bg-[var(--background)]
                    p-5
                    text-[var(--foreground)]
                    shadow-xl

                    md:left-1/2
                    md:w-[577px]
                    md:-translate-x-1/2
                  "
                >
                  <h3 className="text-lg font-semibold">Genres</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    See lists of movies by genre
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
                    {genres.map((genre) => (
                      <button
                        type="button"
                        key={genre.id}
                        onClick={() => {
                          setIsGenreOpen(false);
                          router.push(`/genre/${genre.id}`);
                        }}
                        className="
                          flex
                          h-5
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-[var(--foreground)]
                          px-2.5
                          py-0.5
                          text-xs
                          font-bold
                          text-[var(--foreground)]
                          transition-colors
                          hover:border-[#4338CA]
                          hover:text-[#4338CA]
                        "
                      >
                        <span>{genre.name}</span>

                        <ChevronRight size={14} strokeWidth={2} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ========================= */}
            {/* SEARCH */}
            {/* ========================= */}

            <div
              ref={searchRef}
              className={`
                relative

                ${isMobileSearchOpen ? "flex min-w-0 flex-1" : "hidden md:flex"}

                md:w-94.75
              `}
            >
              <div
                className="
                  relative
                  flex
                  w-full
                "
              >
                <Search
                  size={16}
                  strokeWidth={2}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[var(--foreground)]
                  "
                />

                <input
                  autoFocus={isMobileSearchOpen}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search..."
                  className="
                    h-9
                    w-full
                    rounded-lg
                    border
                    border-[#E4E4E7]
                    bg-[var(--background)]
                    pl-10
                    pr-9
                    text-sm
                    text-[var(--foreground)]
                    outline-none
                    placeholder:text-gray-500
                  "
                />

                {/* ========================= */}
                {/* CLOSE MOBILE SEARCH */}
                {/* ========================= */}

                {isMobileSearchOpen && (
                  <button
                    type="button"
                    onClick={handleCloseMobileSearch}
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      -translate-y-1/2
                      items-center
                      justify-center
                      text-gray-500
                      md:hidden
                    "
                  >
                    <X size={16} />
                  </button>
                )}

                {/* ========================= */}
                {/* SEARCH SUGGESTIONS */}
                {/* ========================= */}

                {search.trim() && (
                  <div
                    className="
                      absolute
                      left-0
                      top-11
                      z-[10000]
                      w-full
                      overflow-hidden
                      rounded-lg
                      border
                      border-[#E4E4E7]
                      bg-[var(--background)]
                      text-[var(--foreground)]
                      shadow-lg
                    "
                  >
                    {isSearching ? (
                      <div className="p-3 text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((movie) => (
                        <button
                          type="button"
                          key={movie.id}
                          onClick={() => handleMovieClick(movie)}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            p-2
                            text-left
                            transition
                            hover:bg-gray-100
                            dark:hover:bg-white/10
                          "
                        >
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : "/placeholder.png"
                            }
                            alt={movie.title}
                            className="
                              h-12
                              w-8
                              shrink-0
                              rounded
                              object-cover
                            "
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {movie.title}
                            </p>

                            <p className="text-xs text-gray-500">
                              {movie.release_date
                                ? movie.release_date.slice(0, 4)
                                : "Unknown"}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-500">
                        No movies found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ========================= */}
            {/* WATCHLIST */}
            {/* ========================= */}

            <button
              type="button"
              onClick={() => router.push("/watchlist")}
              className={`
                relative
                h-9
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-[#E4E4E7]
                bg-[var(--background)]
                px-3
                text-[var(--foreground)]
                transition
                hover:border-red-500
                hover:text-red-500

                ${isMobileSearchOpen ? "hidden" : "flex"}

                md:flex
              `}
              title="Watchlist"
            >
              <Heart size={17} strokeWidth={2} />

              <span className="hidden text-sm font-medium md:inline">
                Watchlist
              </span>

              {watchlistCount > 0 && (
                <span
                  className="
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>

          {/* ========================= */}
          {/* THEME */}
          {/* ========================= */}

          <button
            type="button"
            onClick={handleThemeToggle}
            className={`
              flex
              h-9
              w-10
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-md
              border
              border-[#E4E4E7]
              bg-[var(--background)]
              text-[var(--foreground)]

              ${isMobileSearchOpen ? "hidden" : "flex"}

              md:flex
              md:w-12
            `}
          >
            {isDark ? (
              <Sun size={16} strokeWidth={2} />
            ) : (
              <Moon size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
