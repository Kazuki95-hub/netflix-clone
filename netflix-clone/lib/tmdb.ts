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

export async function fetchMovies(url: string): Promise<Movie[]> {
    const response = await fetch(url);

    if (!response.ok) {
        let errorMessage = `Failed to fetch movies: ${response.statusText} (${response.status})`;

        try {
            const errorText = await response.text();
            const errorData = JSON.parse(errorText);
            if (errorData.status_message) {
                errorMessage = `TMDB API Error: ${errorData.status_message} (${response.status})`;
            }
        } catch {
            // JSONパースに失敗した場合はデフォルトメッセージを使用
        }

        throw new Error(errorMessage);
    }

    const data: TMDBResponse = await response.json();
    return data.results.filter((movie) => movie.poster_path || movie.backdrop_path)
        .map((movie) => ({
            id: String(movie.id),
            name: movie.name || "",
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            overview: movie.overview || "",
        }));
}