"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import HeroCarousel from "../components/HeroCarousel";
import GenreFilter from "../components/GenreFilter";
import MovieCardWithTrailer from "../components/MovieCardWithTrailer";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [featuredMovies, setFeaturedMovies] = useState([]);
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

  // Fetch movies
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

        // Fetch upcoming movies
        const upcomingResponse = await fetch(
          "https://api.themoviedb.org/3/movie/upcoming?api_key=e9e9d8da18ae29fc430845952232787c&language=vi-VN&page=1"
        );
        const upcomingData = await upcomingResponse.json();
        setUpcomingMovies(upcomingData.results?.slice(0, 5) || []);

        // Set featured movies for carousel (movies with backdrop)
        if (nowPlayingData.results && nowPlayingData.results.length > 0) {
          const moviesWithBackdrop = nowPlayingData.results
            .filter((movie) => movie.backdrop_path)
            .slice(0, 5);
          setFeaturedMovies(moviesWithBackdrop);
        }

        // Fetch trailers for all movies
        const allMovies = [
          ...(nowPlayingData.results || []),
          ...(upcomingData.results || []),
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

  return (
    <MainLayout>
      {/* Hero Carousel */}
      <HeroCarousel movies={featuredMovies} trailerMap={trailerMap} />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm phim..."
          />
        </div>

        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Phim đang chiếu</h2>
          </div>

          {/* Genre Filter */}
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />

          {/* Movie Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
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
        </section>

        {/* Coming Soon Section */}
        <section className="mt-12 mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Phim sắp chiếu</h2>
          </div>

          {upcomingMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {upcomingMovies.map((movie) => (
                <MovieCardWithTrailer
                  key={movie.id}
                  movie={movie}
                  trailerKey={trailerMap[movie.id]}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Đón chờ những bom tấn sắp tới
              </h3>
              <p className="text-gray-300 mb-6">
                Cập nhật thông tin và đặt vé trước cho những bộ phim bom tấn sắp
                ra mắt.
              </p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
