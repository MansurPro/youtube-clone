import axios from "axios";

// Points at our own proxy, not RapidAPI directly — the key lives server-side
// (netlify/functions/youtube.js in production, the Vite dev proxy locally).
const BASE_URL = '/api/youtube';

const options = {
    params: {
      maxResults: '50',
    },
};

export const fetchFromAPI = async (url) => {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);

    return data;
}
