import axios from "../../axios";

export const Row = ({ fetchUrl }: { fetchUrl: string }) => {
    async function fetchData() {
        const request = await axios.get(fetchUrl);
    }

    fetchData();

    return <div className="Row"></div>
}