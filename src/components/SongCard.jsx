import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SongCard({ song, onDelete }) {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    }
    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Delete Song?',
      text: `${song.title} — ${song.artist}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      background: '#18181b',
      color: '#fff',
    });
    if (result.isConfirmed) {
      onDelete(song.id);
    }
  };

  return (
    <article 
      className="bg-neutral-800 rounded-xl shadow-lg p-2 sm:p-4 flex flex-col items-center hover:bg-neutral-700 transition-colors duration-200 w-full min-h-[180px] max-w-[160px] mx-auto relative"
    >
      <img 
        src={song.cover || "https://via.placeholder.com/100"} 
        alt={song.title} 
        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg mb-2" 
      />
      <div className="w-full text-center">
        <h3 className="font-bold text-white text-base truncate">{song.title}</h3>
        <p className="text-xs text-neutral-400 truncate">{song.artist} — {song.album}</p>
      </div>
      {/* Botón de menú */}
      <button
        className="absolute top-2 right-2 text-neutral-400 hover:text-white text-xl p-1 rounded-full focus:outline-none"
        onClick={() => setMenuVisible((v) => !v)}
        aria-label="Opciones"
      >
        ⋮
      </button>
      {/* Menú */}
      {menuVisible && (
        <div
          ref={menuRef}
          className="absolute top-10 right-2 bg-neutral-900 rounded-lg shadow-xl p-2 z-10 flex flex-col min-w-[110px] border border-neutral-700"
        >
          <Link to={`/songs/${song.id}`} className="block text-xs text-white hover:bg-[#1ED760] p-2 rounded transition">See</Link>
          <button onClick={() => { setMenuVisible(false); navigate(`/songs/${song.id}/edit`); }} className="block text-xs text-white hover:bg-[#1ED760] p-2 rounded transition text-left">Edit</button>
          <button onClick={() => { setMenuVisible(false); handleDelete(); }} className="block text-xs text-white hover:bg-[#1ED760] p-2 rounded transition text-left">Delete</button>
        </div>
      )}
    </article>
  );
}
