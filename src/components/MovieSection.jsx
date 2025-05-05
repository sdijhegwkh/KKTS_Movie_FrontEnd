import MovieCardWithTrailer from "./MovieCardWithTrailer";

const MovieSection = ({ title, movies, trailerMap = {} }) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {movies.length > 5 && (
          <a
            href="#"
            className="text-orange-500 hover:text-orange-400 font-medium"
          >
            Xem tất cả
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCardWithTrailer
            key={movie.id}
            movie={movie}
            trailerKey={trailerMap[movie.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieSection;
