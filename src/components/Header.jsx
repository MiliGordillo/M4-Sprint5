import React, { useState, useContext } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaHome, FaBell, FaUserCircle } from "react-icons/fa";
import { FaMusic, FaPlus } from "react-icons/fa";
import SongContext from "../context/SongContextContext";

export default function Header() {
  const [search, setSearch] = useState("");
  const { searchSongs } = useContext(SongContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchSongs(value);
  };

  // Función para abrir/cerrar sidebar en móviles
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Sidebar móvil (drawer)
  return (
    <>
      <header className="w-full h-16 bg-neutral-900 flex items-center justify-between px-4 sm:px-8 border-b border-neutral-800 sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Botón hamburguesa solo en móviles */}
          <button
            className="sm:hidden text-white text-2xl focus:outline-none"
            aria-label="Abrir menú"
            onClick={handleSidebarToggle}
          >
            <FaBars />
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <input
            className="w-40 xs:w-56 sm:w-96 px-2 sm:px-4 py-2 rounded-full bg-neutral-800 text-white placeholder:text-neutral-400 focus:outline-none text-sm sm:text-base"
            type="text"
            placeholder="Search songs"
            value={search}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <FaUserCircle size={28} className="text-white" />
        </div>
      </header>
      {/* Sidebar Drawer para móviles */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 sm:hidden" onClick={handleSidebarToggle}>
          <div
            className="absolute top-0 left-0 h-full w-64 bg-neutral-900 shadow-lg flex flex-col justify-center items-center border-r border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Contenido del Sidebar */}
            <nav className="w-full">
              <ul className="flex flex-col gap-6 items-center justify-center h-full">
                <li>
                  <Link to="/" className="flex flex-col items-center text-neutral-400 hover:text-white text-xs" onClick={handleSidebarToggle}>
                    <FaHome size={22} />
                    <span className="mt-1">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/songs" className="flex flex-col items-center text-neutral-400 hover:text-white text-xs" onClick={handleSidebarToggle}>
                    <FaMusic size={22} />
                    <span className="mt-1">Songs</span>
                  </Link>
                </li>
                <li>
                  <Link to="/songs/create" className="flex flex-col items-center text-neutral-400 hover:text-white text-xs" onClick={handleSidebarToggle}>
                    <FaPlus size={22} />
                    <span className="mt-1">Add</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
