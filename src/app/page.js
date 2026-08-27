"use client";

import { Header } from "./features/Header";
import { Hero } from "./features/Hero";
import { Footer } from "./features/Footer";
import { MovieSection } from "./components/Moviesection";
import { useEffect, useState } from "react";
import { MovieSectionSkeleton } from "./components/Moviesectionskeleton";
import { HeroSkeleton } from "./components/Heroskeleton";
import ContinueWatching from "./continuewatching/page";
const api_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTE3NjU2YzRhMTNjNGZkMTA4YTNkYWMxNTIzOWU1NSIsIm5iZiI6MTc4NjU4ODI2OS43MjIsInN1YiI6IjZhN2QyYzZkOTU1MmVlMmNjZTQ0MzI1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rkN9z-Gh6MuWPxngDLGJrOmaXCRatzzTuaHU0eopQl0";
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [upcomingData, setUpcomingData] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [topRatedData, setTopRatedData] = useState([]);

  const getData = async (type) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${api_token}`,
        },
      },
    );

    const jsonData = await response.json();

    return jsonData.results;
  };
  useEffect(() => {
    Promise.all([getData("upcoming"), getData("popular"), getData("top_rated")])
      .then(([upcoming, popular, topRated]) => {
        setUpcomingData(upcoming);
        setPopularData(popular);
        setTopRatedData(topRated);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("MOVIE API ERROR");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading && (
        <div>
          <Header />
<HeroSkeleton/>
          <section className="w-full px-20 py-10">
            <div className="mx-auto max-w-7xl">
              <MovieSectionSkeleton />
              <MovieSectionSkeleton />
              <MovieSectionSkeleton />
            </div>
          </section>

          <Footer />
        </div>
      )}

      {!loading && errorMessage && <div>{errorMessage}</div>}

      {!loading && !errorMessage && (
        <div>
          <Header />

          <Hero />

          <section className="w-full px-20 py-10">
            <div className="mx-auto max-w-7xl">
              {/* <ContinueWatching/> */}
              <MovieSection
                title="UPCOMING"
                movies={upcomingData.slice(0, 10)}
                path="/upcoming"
              />

              <MovieSection
                title="POPULAR"
                movies={popularData.slice(0, 10)}
                path="/popular"
              />

              <MovieSection
                title="TOP RATED"
                movies={topRatedData.slice(0, 10)}
                path="/top-rated"
              />
            </div>
          </section>

          <Footer />
        </div>
      )}
    </div>
  );
}
