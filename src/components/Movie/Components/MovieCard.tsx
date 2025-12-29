import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


export interface MovieProp {
  id: number;
  title: string;
  release_date: string;
  rating: number;
  poster_url: string;
  description: string;
  genres: string[];
}

export default function MovieCard({ movie }: { movie: MovieProp }) {

  const navigate = useNavigate();
 
  return (
      <div onClick={() => navigate(`/movies/${movie.id}`)} className="flex flex-row lg:flex-col gap-4 bg-black rounded-xl p-4">
        <img
          className="rounded-xl w-32 lg:w-full h-auto"
          src={movie.poster_url}
          alt=""
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-white">{movie.title}</h1>
          <p className="flex gap-2 font-medium  text-gray-400">
            {movie.release_date}
          </p>
          <p className="flex items-center gap-1 text-yellow-300">
            <FaStar /> {movie.rating}
          </p>
        </div>
      </div>
    
  );
}
