// import type MovieProp from './../Components/MovieCard'
const url = "http://localhost:3002/movies"

export const  FetchMovie = async ()=>{
    const movie = await fetch(url).then(res => res.json());  
    console.log(movie)  
    return movie;
}

export const fetchMovieById = async (id : number)=>{
    const movie = await fetch(`${url}/${id}`).then(res => res.json());  
    console.log(movie)  
    return movie;
}