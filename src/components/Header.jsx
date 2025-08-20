import React, { useState, useContext } from "react";
import { FaBars, FaHome, FaMusic, FaPlus, FaUserCircle, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SongContext } from "../context/SongContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const { searchSongs } = useContext(SongContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchSongs(value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/songs?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleClear = () => {
    setSearch("");
    searchSongs("");
    if (location.pathname === "/songs") {
      navigate("/songs");
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <header className="w-full h-16 bg-neutral-900 flex items-center justify-between px-4 sm:px-8 border-b border-neutral-800 sticky top-0 z-20">
        {/* Botón hamburguesa solo móvil */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="sm:hidden text-white text-xl focus:outline-none p-1"
            aria-label="Abrir menú"
            onClick={handleSidebarToggle}
          >
            <FaBars />
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex-1 flex justify-center px-2 relative">
          <div className="relative w-full max-w-[250px] sm:max-w-md">
            <input
              className="w-full px-3 py-2 rounded-full bg-neutral-800 text-white placeholder:text-neutral-400 focus:outline-none text-sm sm:text-base pr-8"
              type="text"
              placeholder="Search songs"
              value={search}
              onChange={handleChange}
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-base p-1 rounded-full focus:outline-none"
                onClick={handleClear}
                aria-label="Limpiar búsqueda"
                type="button"
                tabIndex={0}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Drawer móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 sm:hidden"
          onClick={handleSidebarToggle}
        >
          <div
            className="absolute top-0 left-0 h-full w-15 bg-neutral-900 shadow-lg flex flex-col justify-center items-center border-r border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="w-full">
              <ul className="flex flex-col gap-4 items-center justify-center h-full">
                <li>
                  <Link
                    to="/"
                    className="flex flex-col items-center text-neutral-400 hover:text-white text-xs"
                    onClick={handleSidebarToggle}
                  >
                    <FaHome size={18} />
                    <span className="mt-1">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/songs"
                    className="flex flex-col items-center text-neutral-400 hover:text-white text-xs"
                    onClick={handleSidebarToggle}
                  >
                    <FaMusic size={18} />
                    <span className="mt-1">Songs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/songs/create"
                    className="flex flex-col items-center text-neutral-400 hover:text-white text-xs"
                    onClick={handleSidebarToggle}
                  >
                    <FaPlus size={18} />
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

