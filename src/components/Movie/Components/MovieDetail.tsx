import { useState, useEffect } from "react";
import type { MovieProp } from "./MovieCard";
import { fetchMovieById } from "../Data/MovieService";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";

export default function MovieDetail() {
  const [movie, setMovie] = useState<MovieProp | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovie = async () => {
      if (id) {
        const data = await fetchMovieById(parseInt(id));
        setMovie(data);
      }
    };
    loadMovie();
  }, [id]);

  if (!movie) return <div className="flex flex-col justify-center items-center text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 md:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full">
                <FaStar className="text-yellow-400" />
                <span className="font-bold">{movie.rating.toFixed(1)}/10</span>
              </div>
              <span className="text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {movie.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/50 p-6 rounded-xl">
              <div>
                <h3 className="text-gray-400 text-sm">Release Date</h3>
                <p className="text-xl">
                  {new Date(movie.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Rating</h3>
                <p className="text-xl">{movie.rating.toFixed(1)} / 10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
