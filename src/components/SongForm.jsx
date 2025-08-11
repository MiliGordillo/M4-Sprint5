import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function SongForm({ initial = {}, onSubmit, loading = false }) {
  const API_KEY = "5ad5ef65c83337287b2aa09442b0a072";

  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    genre: "",
    cover: "",
    audioUrl: "",
    ...initial
  });
  const [errors, setErrors] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Guardar valor anterior de initial para comparar
  const prevInitial = useRef(initial);

  useEffect(() => {
    // Solo actualizar si realmente cambió algo
    if (JSON.stringify(prevInitial.current) !== JSON.stringify(initial)) {
      setForm(prev => ({ ...prev, ...initial }));
      prevInitial.current = initial;
    }
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Título requerido";
    if (!form.artist.trim()) e.artist = "Artista requerido";
    if (form.year && isNaN(Number(form.year))) e.year = "Año inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Debounce para evitar buscar en cada tecla
  const debounceTimeout = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

    if ((name === "title" || name === "artist")) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        searchTracks({ ...form, [name]: value });
      }, 500); // Espera 500ms después de que el usuario deja de tipear
    }
  };

  const searchTracks = async (data) => {
    if (!data.title || !data.artist) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      // Buscar resultados para elegir
      const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
        params: {
          method: "track.search",
          api_key: API_KEY,
          track: data.title,
          artist: data.artist,
          format: "json",
          limit: 5
        }
      });
      const tracks = res.data?.results?.trackmatches?.track || [];
      setSearchResults(Array.isArray(tracks) ? tracks : [tracks]);

      // Buscar portada automáticamente si no hay ya una
      if (!form.cover) {
        await fetchCover(data.artist, data.title);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const fetchCover = async (artist, title) => {
    try {
      const infoRes = await axios.get("https://ws.audioscrobbler.com/2.0/", {
        params: {
          method: "track.getInfo",
          api_key: API_KEY,
          artist,
          track: title,
          format: "json"
        }
      });
      let images = infoRes.data?.track?.album?.image || infoRes.data?.track?.image;
      if (images?.length > 0) {
        const large = images.find(img => img.size === "extralarge") || images[images.length - 1];
        if (large && large["#text"] && !large["#text"].includes("noimage") && !large["#text"].includes("2a96cbd8b46e442fc41c2b86b821562e")) {
          setForm(f => ({ ...f, cover: large["#text"] }));
        }
      }
    } catch {
      // Si falla, no modificar cover
    }
  };

  const handleSelectTrack = async (track) => {
    let coverUrl = "";
    try {
      const infoRes = await axios.get("https://ws.audioscrobbler.com/2.0/", {
        params: {
          method: "track.getInfo",
          api_key: API_KEY,
          artist: track.artist,
          track: track.name,
          format: "json"
        }
      });
      let images = infoRes.data?.track?.album?.image || infoRes.data?.track?.image;
      if (images?.length > 0) {
        const large = images.find(img => img.size === "extralarge") || images[images.length - 1];
        if (large && large["#text"] && !large["#text"].includes("noimage") && !large["#text"].includes("2a96cbd8b46e442fc41c2b86b821562e")) {
          coverUrl = large["#text"];
        }
      }
    } catch {}

    setForm(f => ({
      ...f,
      title: track.name || f.title,
      artist: track.artist || f.artist,
      cover: coverUrl || f.cover,
      album: track.album || f.album
    }));
    setSearchResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, year: form.year ? Number(form.year) : null };
    onSubmit(payload);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-neutral-900 rounded-2xl shadow-2xl p-4 sm:p-8 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Agregar / Editar Canción</h2>

        {/* Título y artista */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Título</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ej: Shape of You" autoComplete="off" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Artista</label>
            <input name="artist" value={form.artist} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ej: Ed Sheeran" autoComplete="off" />
            {errors.artist && <p className="text-red-500 text-xs mt-1">{errors.artist}</p>}
          </div>
        </div>

        {/* Resultados */}
        {searching && <div className="text-neutral-400 text-sm mb-2">Buscando canciones...</div>}
        {searchResults.length > 0 && (
          <div className="bg-neutral-800 rounded-lg shadow p-4 mb-4">
            <div className="text-neutral-300 text-sm mb-2">Elige una canción de los resultados:</div>
            <ul className="divide-y divide-neutral-700">
              {searchResults.map((track, idx) => (
                <li key={idx} className="py-2 flex items-center gap-3 cursor-pointer hover:bg-neutral-700 rounded transition" onClick={() => handleSelectTrack(track)}>
                  {track.image && track.image.length > 0 ? (
                    (() => {
                      const imgUrl = track.image.find(img => img.size === "medium")?.['#text'] || track.image[0]['#text'];
                      if (!imgUrl || imgUrl.includes('noimage') || imgUrl.includes('2a96cbd8b46e442fc41c2b86b821562e')) {
                        return <div className="w-10 h-10 flex items-center justify-center bg-neutral-700 rounded text-xs text-neutral-400">Sin portada</div>;
                      }
                      return <img src={imgUrl} alt="cover" className="w-10 h-10 object-cover rounded" />;
                    })()
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-neutral-700 rounded text-xs text-neutral-400">Sin portada</div>
                  )}
                  <div>
                    <div className="text-white font-semibold">{track.name}</div>
                    <div className="text-xs text-neutral-400">{track.artist}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resto del formulario */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Álbum</label>
            <input name="album" value={form.album} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ej: Divide" />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Año</label>
            <input name="year" value={form.year ?? ""} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ej: 2017" />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>
        </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Género</label>
            <input name="genre" value={form.genre} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ej: Pop" />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Audio (URL)</label>
            <input name="audioUrl" value={form.audioUrl} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="URL del audio" />
          </div>
        </div>

  <div className="flex flex-col items-center gap-2">
          <label className="block text-sm text-neutral-300 mb-1">Portada (URL)</label>
          <input name="cover" value={form.cover} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="URL de la portada" />
          {form.cover && (
            <img src={form.cover} alt="Portada" className="mt-2 rounded-lg shadow-lg w-32 h-32 object-cover border-2 border-green-500" />
          )}
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button type="submit" className="bg-gradient-to-r from-green-500 to-lime-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={() => window.history.back()} className="px-6 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
