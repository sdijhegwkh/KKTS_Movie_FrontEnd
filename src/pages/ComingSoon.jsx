"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import MovieCardWithTrailer from "../components/MovieCardWithTrailer";
import GenreFilter from "../components/GenreFilter";
import SearchBar from "../components/SearchBar";
import HeroCarousel from "../components/HeroCarousel";

const ComingSoon = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerMap, setTrailerMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN"
        );
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch upcoming movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Fetch upcoming movies
        const upcomingResponse = await fetch(
          "https://api.themoviedb.org/3/movie/upcoming?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN&page=1"
        );
        const upcomingData = await upcomingResponse.json();
        setUpcomingMovies(upcomingData.results || []);

        // Set featured movies for carousel (movies with backdrop)
        if (upcomingData.results && upcomingData.results.length > 0) {
          const moviesWithBackdrop = upcomingData.results
            .filter((movie) => movie.backdrop_path)
            .slice(0, 5);
          setFeaturedMovies(moviesWithBackdrop);
        }

        // Fetch trailers for all movies
        const trailerData = {};
        await Promise.all(
          upcomingData.results.map(async (movie) => {
            try {
              const videoResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=e9e9d8da18ae29fc430845952232787c`
              );
              const videoData = await videoResponse.json();
              const trailer = videoData.results?.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
              );
              if (trailer) {
                trailerData[movie.id] = trailer.key;
              }
            } catch (error) {
              console.error(
                `Error fetching trailer for movie ${movie.id}:`,
                error
              );
            }
          })
        );

        setTrailerMap(trailerData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies by genre and search query
  const filteredMovies = upcomingMovies
    .filter((movie) =>
      selectedGenre ? movie.genre_ids.includes(selectedGenre) : true
    )
    .filter((movie) =>
      searchQuery
        ? movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (movie.overview &&
            movie.overview.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    );

  return (
    <MainLayout>
      {/* Hero Carousel */}
      <HeroCarousel movies={featuredMovies} trailerMap={trailerMap} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Sắp ra mắt</h2>
          <p className="text-gray-400">
            Những bộ phim sắp được công chiếu tại rạp
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm phim..."
          />
        </div>

        {/* Genre Filter */}
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Upcoming Movies Grid */}
            <div className="mb-12">
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCardWithTrailer
                      key={movie.id}
                      movie={movie}
                      trailerKey={trailerMap[movie.id]}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    Không tìm thấy phim phù hợp.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ComingSoon;
