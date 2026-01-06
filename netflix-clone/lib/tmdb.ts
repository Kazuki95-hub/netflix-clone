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

    const cleanedKey = apiKey.trim();
    if (!cleanedKey) {
        throw new Error("TMDB_API_KEY is empty after trimming")
    }
    return apiKey;
}

export function getMovieCategories(): MovieCategory[] {
    const API_KEY = getApiKey();

    return [
        {
            title: "NETFLIX ORIGINALS",
            url: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213&watch_region=JP&language=ja`,
        },
        {
            title: "Trending Movies",
            url: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&watch_region=JP&language=ja-JP`,
        },
        {
            title: "Action Movies",
            url: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10759&watch_region=JP&language=ja-JP`,
        },
        {
            title: "News Movies",
            url: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10763&watch_region=JP&language=ja-JP`,
        },
        {
            title: "Kids Movies",
            url: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10762&watch_region=JP&language=ja-JP`,
        },
        {
            title: "Romance Movies",
            url: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10749&watch_region=JP&language=ja-JP`,
        },
        {
            title: "Documentaries",
            url: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=99&watch_region=JP&language=ja-JP`,
        },
    ]
}