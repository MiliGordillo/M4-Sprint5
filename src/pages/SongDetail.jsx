import React, { useContext, useEffect, useState } from "react";
import { SongContext } from "../context/SongContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function SongDetail() {
  const { id } = useParams();
  const { getSong, deleteSong } = useContext(SongContext);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loadingDelete) return;
    (async () => {
      try {
        const data = await getSong(id, false);
        setSong(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [id, getSong, loadingDelete]);

  if (loading) return <p className="p-4">loading...</p>;
  if (!song && !loadingDelete) return <p className="p-4">No results</p>;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center pb-8">
      {/* Imagen superior */}
      <div className="w-full relative">
        <img
          src={song.cover || "https://via.placeholder.com/300"}
          alt={song.title}
          className="w-full h-64 object-cover object-center rounded-b-3xl shadow-lg"
        />
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black/60 text-white rounded-full p-2 text-lg hover:bg-black/80"
        >
          ←
        </button>
      </div>

      {/* Info principal */}
      <div className="w-full max-w-md px-4 -mt-12 relative z-10">
        <div className="bg-neutral-900 rounded-2xl shadow-xl p-4 flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-2 text-white text-center drop-shadow-lg">{song.title}</h2>
          <p className="text-base text-neutral-300 font-semibold mb-2 text-center">{song.artist}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-neutral-800 text-white text-xs font-bold px-3 py-1 rounded-full">{song.year ?? "—"}</span>
            <span className="bg-neutral-800 text-white text-xs font-bold px-3 py-1 rounded-full">{song.genre ?? "—"}</span>
          </div>
          {song.audioUrl && (
            <audio controls src={song.audioUrl} className="w-full mt-2" />
          )}
        </div>
        {/* Botones de acción */}
        <div className="flex gap-3 mt-6 justify-center">
          <Link
            to={`/songs/${song.id}/edit`}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#1ED760] text-black font-semibold shadow hover:bg-[#19b954] transition"
          >
            Edit
          </Link>
          <button
            onClick={async () => {
              setLoadingDelete(true);
              try {
                await deleteSong(song.id);
                navigate("/songs");
              } finally {
                setLoadingDelete(false);
              }
            }}
            disabled={loadingDelete}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition ${loadingDelete ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loadingDelete ? "eliminating..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

