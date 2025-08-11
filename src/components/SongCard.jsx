import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SongCard({ song, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar canción?',
      text: `${song.title} — ${song.artist}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      onDelete(song.id);
    }
  };

  return (
    <article className="bg-neutral-800 rounded-xl shadow-lg p-2 sm:p-4 flex flex-col items-center hover:bg-neutral-700 transition-colors duration-200 w-full min-h-[180px] max-w-[160px] mx-auto">
      <img src={song.cover || "https://via.placeholder.com/100"} alt={song.title} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg mb-2" />
      <div className="w-full text-center">
        <h3 className="font-bold text-white text-base truncate">{song.title}</h3>
        <p className="text-xs text-neutral-400 truncate">{song.artist} — {song.album}</p>
        <div className="mt-3 flex justify-center gap-2">
          <Link to={`/songs/${song.id}`} className="text-xs px-2 py-1 rounded bg-neutral-900 text-white hover:bg-neutral-700">Ver</Link>
          <button onClick={() => navigate(`/songs/${song.id}/edit`)} className="text-xs px-2 py-1 rounded bg-neutral-900 text-white hover:bg-neutral-700">Editar</button>
          <button onClick={handleDelete} className="text-xs px-2 py-1 rounded bg-red-700 text-white hover:bg-red-800">Eliminar</button>
        </div>
      </div>
    </article>
  );
}
