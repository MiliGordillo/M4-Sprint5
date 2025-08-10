import React, { useContext, useEffect, useState } from "react";
import SongContext from "../context/SongContextContext";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function SongDetail() {
  const { id } = useParams();
  const { getSong, deleteSong } = useContext(SongContext);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getSong(id);
        setSong(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    })();
  }, [id, getSong]);

  if (loading) return <p className="p-4">Cargando...</p>;
  if (!song) return <p className="p-4">No encontrada</p>;

  return (
    <div className="container mx-auto p-8 flex justify-center animate-fade-in">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-8 flex flex-col md:flex-row gap-10 w-full max-w-3xl">
        <div className="flex flex-col items-center justify-center">
          <img
            src={song.cover || "https://via.placeholder.com/300"}
            alt={song.title}
            className="w-64 h-64 object-cover rounded-xl border-4 border-green-500 shadow-lg mb-4"
          />
          {song.audioUrl && (
            <audio controls src={song.audioUrl} className="w-56 mt-2" />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 via-green-600 to-lime-400 bg-clip-text text-transparent drop-shadow-lg">{song.title}</h2>
          <p className="text-lg text-neutral-300 font-semibold mb-2">{song.artist}</p>
          <div className="space-y-2 mb-6">
            <p><span className="font-bold text-neutral-400">Álbum:</span> <span className="text-white">{song.album || "—"}</span></p>
            <p><span className="font-bold text-neutral-400">Año:</span> <span className="text-white">{song.year ?? "—"}</span></p>
            <p><span className="font-bold text-neutral-400">Género:</span> <span className="text-white">{song.genre ?? "—"}</span></p>
          </div>
          <div className="flex gap-4 mt-4">
            <Link to={`/songs/${song.id}/edit`} className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition">Editar</Link>
            <button
              onClick={async () => {
                setLoadingDelete(true);
                try {
                  await deleteSong(song.id);
                  navigate("/songs");
                } catch (err) {
                  // El toast ya se muestra en SongContext
                }
                setLoadingDelete(false);
              }}
              className={`px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition ${loadingDelete ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loadingDelete}
            >
              {loadingDelete ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
