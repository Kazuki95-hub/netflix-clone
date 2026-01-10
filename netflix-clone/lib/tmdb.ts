import axios from "axios";

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

export async function fetchMoviesById(movieId: string): Promise<Movie | null> {
    const API_KEY = getApiKey();

    const response = await fetch(
        `${BASE_URL}/tv/${movieId}?api_key=${API_KEY}&language=ja-JP`
    )

    if (!response.ok) {
        {
            return null;
        }
    }

    const data = await response.json();
    return {
        id: String(data.id),
        name: data.name || "",
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        overview: data.overview || "",
    }
}

export async function fetchNetflixOriginals(): Promise<Movie[]> {
    const categories = getMovieCategories();
    const category = categories.find((category) => category.title === "NETFLIX ORIGINALS");
    if (!category) {
        throw new Error("NETFLIX ORIGINALS category not found");
    }
    return fetchMovies(category.url);
}

export async function fetchRandomMovie(): Promise<Movie | null> {
    const movies = await fetchNetflixOriginals();
    const moviesWithBackdrop = movies.filter((movie) => movie.backdrop_path);
    if (moviesWithBackdrop.length === 0) {
        return null;
    }
    return moviesWithBackdrop[Math.floor(Math.random() * moviesWithBackdrop.length)];
}

export async function fetchMovieVideos(movieId: string): Promise<string | null> {
    const API_KEY = getApiKey();

    let response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/videos?api_key=${API_KEY}`);

    if (!response.ok) {
        response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
        );
    }

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    const trailer = data.results?.find(
        (video: any) =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            (video.name?.toLowerCase().includes("trailer") ||
                video.name?.toLowerCase().includes("トレイラー") ||
                video.name?.toLowerCase().includes("予告"))
    );
    const youtubeTrailer = data.results?.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );

    const youtubeVideo = data.results?.find(
        (video: any) => video.site === "YouTube"
    );

    return trailer?.key || youtubeTrailer?.key || youtubeVideo?.key || null;
}