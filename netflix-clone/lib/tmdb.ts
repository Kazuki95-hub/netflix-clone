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

export function getApiKey() {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        throw new Error("TMDB_API_KEY is not set");
    }
    return apiKey;
}