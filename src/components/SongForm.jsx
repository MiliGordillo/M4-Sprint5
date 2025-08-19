import React, { useState, useEffect, useRef } from "react";

import { searchTracksLastfm, fetchTrackCoverLastfm } from "../service/api";
import Swal from "sweetalert2";

export default function SongForm({ initial = {}, onSubmit, loading = false }) {


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
      }, 500);
    }
  };

  const searchTracks = async (data) => {
    if (!data.title || !data.artist) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const tracks = await searchTracksLastfm({ title: data.title, artist: data.artist });
      setSearchResults(tracks);
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
    const coverUrl = await fetchTrackCoverLastfm(artist, title);
    if (coverUrl) {
      setForm(f => ({ ...f, cover: coverUrl }));
    }
  };

  const handleSelectTrack = async (track) => {
    const coverUrl = await fetchTrackCoverLastfm(track.artist, track.name);
    setForm(f => ({
      ...f,
      title: track.name || f.title,
      artist: track.artist || f.artist,
      cover: coverUrl || f.cover,
      album: track.album || f.album
    }));
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Comprobar si hay cambios respecto a initial SOLO en los campos relevantes
    const fields = ["title", "artist", "album", "year", "genre", "cover", "audioUrl"];
    let changed = false;
    for (const key of fields) {
      const initialValue = initial[key] ?? "";
      const formValue = key === "year"
        ? (form[key] ? Number(form[key]) : "")
        : (form[key] ?? "");
      if (initialValue !== formValue) {
        changed = true;
        break;
      }
    }
    if (!changed) {
      await Swal.fire({
        icon: "info",
        title: "No changes",
        text: "Cannot save because no changes were made.",
        confirmButtonColor: '#22c55e',
        background: '#18181b',
        color: '#fff',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'bg-green-500 text-black font-bold',
        }
      });
      return;
    }
    const payload = { ...form, year: form.year ? Number(form.year) : null };
    onSubmit(payload);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-neutral-900 rounded-2xl shadow-2xl p-4 sm:p-8 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

        {/* Título y artista */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ex: Shape of You" autoComplete="off" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Artist</label>
            <input name="artist" value={form.artist} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ex: Ed Sheeran" autoComplete="off" />
            {errors.artist && <p className="text-red-500 text-xs mt-1">{errors.artist}</p>}
          </div>
        </div>

        {/* Resultados */}
        {searching && <div className="text-neutral-400 text-sm mb-2">searching for songs...</div>}
        {searchResults.length > 0 && (
          <div className="bg-neutral-800 rounded-lg shadow p-4 mb-4">
            <div className="text-neutral-300 text-sm mb-2">Choose a song from the results.:</div>
            <ul className="divide-y divide-neutral-700">
              {searchResults.map((track, idx) => (
                <li key={idx} className="py-2 flex items-center gap-3 cursor-pointer hover:bg-neutral-700 rounded transition" onClick={() => handleSelectTrack(track)}>
                  {track.image && track.image.length > 0 ? (
                    (() => {
                      const imgUrl = track.image.find(img => img.size === "medium")?.['#text'] || track.image[0]['#text'];
                      if (!imgUrl || imgUrl.includes('noimage') || imgUrl.includes('2a96cbd8b46e442fc41c2b86b821562e')) {
                        return <div className="w-10 h-10 flex items-center justify-center bg-neutral-700 rounded text-xs text-neutral-400">no cover</div>;
                      }
                      return <img src={imgUrl} alt="cover" className="w-10 h-10 object-cover rounded" />;
                    })()
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-neutral-700 rounded text-xs text-neutral-400">no cover</div>
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
            <label className="block text-sm text-neutral-300 mb-1">Album</label>
            <input name="album" value={form.album} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ex: Divide" />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Year</label>
            <input name="year" value={form.year ?? ""} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ex: 2017" />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>
        </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Genre</label>
            <input name="genre" value={form.genre} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Ex: Pop" />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Audio (URL)</label>
            <input name="audioUrl" value={form.audioUrl} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Audio URL" />
          </div>
        </div>

  <div className="flex flex-col items-center gap-2">
          <label className="block text-sm text-neutral-300 mb-1">Cover(URL)</label>
          <input name="cover" value={form.cover} onChange={handleChange} className="w-full border-none rounded-lg px-4 py-2 bg-neutral-800 text-white focus:ring-2 focus:ring-green-500" placeholder="Cover URL" />
          {form.cover && (
            <img src={form.cover} alt="Portada" className="mt-2 rounded-lg shadow-lg w-32 h-32 object-cover border-2 border-green-500" />
          )}
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#1ED760] text-black font-semibold shadow hover:bg-[#19b954] transition ${loading ? "opacity-60 cursor-not-allowed" : "" }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
 
