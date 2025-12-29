import { useEffect, useState } from "react";
import type { MovieProp } from "./Components/MovieCard";
import MovieCard from "./Components/MovieCard";
import { FetchMovie } from "./Data/MovieService";
import SearchBar from "./Components/SearchBar";

export default function MoviePage() {
  const [movies, setMovie] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  let filteredMovies ;

  useEffect(() => {
    LoadData();
  }, []);

  const LoadData = async () => {
    const temp = await FetchMovie();
    setMovie(temp);
  };

  if(searchQuery !== ""){
    filteredMovies = movies.filter((movie : MovieProp)=>{
      return movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }else{
    filteredMovies = movies
  }

  return (
    <div className="min-h-screen w-full bg-gray-900">
  <div className="max-w-5xl mx-auto px-4">
    <nav className="sticky top-0 z-10 flex justify-between items-center py-2 bg-gray-900/80 backdrop-blur-sm">
      <h1 className="text-4xl text-white font-bold">Movies</h1>
      <SearchBar searchValue={searchQuery} onSearch={setSearchQuery}/>
    </nav>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
      {filteredMovies.map((movieData: MovieProp) => (
        <MovieCard key={movieData.id} movie={movieData} />
      ))}
    </div>
  </div>
</div>
  );
}
