import dotenv from "dotenv";
dotenv.config();
import { getApiKey, getMovieCategories } from "./lib/tmdb.ts";
import { fetchMovies } from "./lib/tmdb.ts";

// console.log(
//     "API key loaded:",
//     getApiKey().slice(0, 4) + "****"
// );

async function main() {
    const categories = getMovieCategories();

    const netflix = categories[0];
    console.log(netflix.title);
    console.log(netflix.url);

    const movies = await fetchMovies(netflix.url);
    console.log("取得件数:", movies.length);
    console.log("最初の1件:", movies[0]);
}
main().catch((err) => {
    console.error("エラー:", err.message);
});
