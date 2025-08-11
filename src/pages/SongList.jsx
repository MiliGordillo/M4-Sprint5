import React, { useContext } from "react";
import SongContext from "../context/SongContextContext";
import SongCard from "../components/SongCard";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SongsList() {
  const { songs, loading, deleteSong, searchSongs } = useContext(SongContext);
  const location = useLocation();

  const handleDelete = async (id) => {
    try {
      await deleteSong(id);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    if (search) {
      searchSongs(search);
    }
  }, [location.search]);

  return (
    <div className="max-w-6xl mx-auto p-8">
  <h2 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-green-400 via-green-600 to-lime-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">Mis canciones Favoritas</h2>
      {loading ? <p className="text-neutral-400">Cargando...</p> : (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {songs.length === 0 && <p className="text-neutral-400">No hay canciones aún.</p>}
          {songs.map(s => <SongCard key={s.id} song={s} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  );
}
