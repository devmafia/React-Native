import axios from "axios";
import { API_KEY } from "../constants";

const apiBaseUrl = "https://api.themoviedb.org/3";
const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${API_KEY}`;
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${API_KEY}`;
const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${API_KEY}`;

const movieDetailsEndpoint = (id:any)=> `${apiBaseUrl}/movie/${id}?api_key=${API_KEY}`;
const movieCreditsEndpoint = (id:any)=> `${apiBaseUrl}/movie/${id}/credits?api_key=${API_KEY}`;
const movieSimilarEndpoint = (id:any)=> `${apiBaseUrl}/movie/${id}/similar?api_key=${API_KEY}`;
const searchMoviesEndpoint = `${apiBaseUrl}/search/movie?api_key=${API_KEY}`;

const personDetailsEndpoint =(id:any)=> `${apiBaseUrl}/person/${id}?api_key=${API_KEY}`;
const personMoviesEndpoint = (id:any)=> `${apiBaseUrl}/person/${id}/movie_credits?api_key=${API_KEY}`;

export const image500 = (path:string) => path? `https://image.tmdb.org/t/p/w500${path}` : "https://via.placeholder.com/500";
export const image342 = (path:string) => path? `https://image.tmdb.org/t/p/w342${path}` : "https://via.placeholder.com/500";
export const image185 = (path:string) => path? `https://image.tmdb.org/t/p/w185${path}` : "https://via.placeholder.com/500";

const apiCall = async (endpoint: string, params?: object) => {
    const options = {
        method: "GET",
        url: endpoint,
        params: params? params : {}
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log("error: ", error);
        return {}
    }
}

export const fetchTrendingMovies = () => {
    return apiCall(trendingMoviesEndpoint);
}

export const fetchUpcomingMovies = () => {
    return apiCall(upcomingMoviesEndpoint);
}

export const fetchTopRatedMovies = () => {
    return apiCall(topRatedMoviesEndpoint);
}

export const fetchSimilarMovies = (id:any) => {
    return apiCall(movieSimilarEndpoint(id));
}

export const fetchMovieCredits = (id:any) => {
    return apiCall(movieCreditsEndpoint(id));
}

export const fetchMovieDetails = (id:any) => {
    return apiCall(movieDetailsEndpoint(id));
}

export const fetchPersonDetails = (id:any) => {
    return apiCall(personDetailsEndpoint(id));
}

export const fetchPersonMovies = (id:any) => {
    return apiCall(personMoviesEndpoint(id));
}

export const searchMovies = (params:any) => {
    return apiCall(searchMoviesEndpoint, params);
}


