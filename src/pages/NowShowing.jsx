"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import GenreFilter from "../components/GenreFilter";
import MovieCardWithTrailer from "../components/MovieCardWithTrailer";
import SearchBar from "../components/SearchBar";
import HeroCarousel from "../components/HeroCarousel";

const NowShowing = () => {
  const [movies, setMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
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

  // Fetch now playing movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Fetch now playing movies
        const nowPlayingResponse = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN&page=1"
        );
        const nowPlayingData = await nowPlayingResponse.json();
        setMovies(nowPlayingData.results || []);

        // Set featured movies for carousel (movies with backdrop)
        if (nowPlayingData.results && nowPlayingData.results.length > 0) {
          const moviesWithBackdrop = nowPlayingData.results
            .filter((movie) => movie.backdrop_path)
            .slice(0, 5);
          setFeaturedMovies(moviesWithBackdrop);
        }

        // Fetch popular movies
        const popularResponse = await fetch(
          "https://api.themoviedb.org/3/movie/popular?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN&page=1"
        );
        const popularData = await popularResponse.json();
        setPopularMovies(popularData.results?.slice(0, 10) || []);

        // Fetch top rated movies
        const topRatedResponse = await fetch(
          "https://api.themoviedb.org/3/movie/top_rated?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN&page=1"
        );
        const topRatedData = await topRatedResponse.json();
        setTopRatedMovies(topRatedData.results?.slice(0, 10) || []);

        // Fetch trailers for all movies
        const allMovies = [
          ...(nowPlayingData.results || []),
          ...(popularData.results || []),
          ...(topRatedData.results || []),
        ];
        const uniqueMovieIds = [...new Set(allMovies.map((movie) => movie.id))];

        const trailerData = {};
        await Promise.all(
          uniqueMovieIds.map(async (movieId) => {
            try {
              const videoResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=e9e9d8da18ae29fc430845952232787c`
              );
              const videoData = await videoResponse.json();
              const trailer = videoData.results?.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
              );
              if (trailer) {
                trailerData[movieId] = trailer.key;
              }
            } catch (error) {
              console.error(
                `Error fetching trailer for movie ${movieId}:`,
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
  const filteredMovies = movies
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

  // Filter popular movies by genre and search query
  const filteredPopularMovies = popularMovies
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

  // Filter top rated movies by genre and search query
  const filteredTopRatedMovies = topRatedMovies
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
          <h1 className="text-4xl font-bold text-white mb-2">
            Phim đang chiếu
          </h1>
          <p className="text-gray-400">
            Khám phá các bộ phim đang được chiếu tại rạp
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
            {/* Xem nhiều nhất */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Xem nhiều nhất
                </h2>
              </div>

              {filteredPopularMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredPopularMovies.map((movie) => (
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

            {/* Đánh giá cao */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Đánh giá cao</h2>
              </div>

              {filteredTopRatedMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredTopRatedMovies.map((movie) => (
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

            {/* Tất cả phim đang chiếu */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Tất cả phim đang chiếu
                </h2>
              </div>

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

export default NowShowing;
