// --- MOCKAPI ---
import axios from "axios";

const BASE_URL = "https://6897eb7cddf05523e55dc2d9.mockapi.io/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// --- LAST.FM API ---
const LASTFM_API_KEY = "5ad5ef65c83337287b2aa09442b0a072";
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function searchTracksLastfm({ title, artist }) {
  if (!title || !artist) return [];
  const res = await axios.get(LASTFM_BASE_URL, {
    params: {
      method: "track.search",
      api_key: LASTFM_API_KEY,
      track: title,
      artist,
      format: "json",
      limit: 5
    }
  });
  const tracks = res.data?.results?.trackmatches?.track || [];
  return Array.isArray(tracks) ? tracks : [tracks];
}

export async function fetchTrackCoverLastfm(artist, title) {
  if (!artist || !title) return "";
  try {
    const infoRes = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: "track.getInfo",
        api_key: LASTFM_API_KEY,
        artist,
        track: title,
        format: "json"
      }
    });
    let images = infoRes.data?.track?.album?.image || infoRes.data?.track?.image;
    if (images?.length > 0) {
      const large = images.find(img => img.size === "extralarge") || images[images.length - 1];
      if (large && large["#text"] && !large["#text"].includes("noimage") && !large["#text"].includes("2a96cbd8b46e442fc41c2b86b821562e")) {
        return large["#text"];
      }
    }
  } catch {
    // Si falla, retorna vacío
  }
  return "";
}

export default api;
