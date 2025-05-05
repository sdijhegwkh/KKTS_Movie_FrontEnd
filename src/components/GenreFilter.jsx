"use client";

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }) => {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            selectedGenre === null
              ? "bg-orange-500 text-white"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Tất cả
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedGenre === genre.id
                ? "bg-orange-500 text-white"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
