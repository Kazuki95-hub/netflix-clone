const BASE_URL = "https://api.themoviedb.org/3";

export type Movie = {
    id: string;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
}

export type TMDBResponse = {
    results: Movie[];
}

export type MovieCategory = {
    title: string;
    url: string;
}