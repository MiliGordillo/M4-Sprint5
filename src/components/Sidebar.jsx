import React from "react";
import { FaHome, FaMusic, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="hidden sm:flex w-20 bg-neutral-900 fixed top-0 left-0 h-screen flex-col justify-center items-center border-r border-neutral-800 z-50">
      <nav className="w-full">
        <ul className="flex flex-col gap-4 lg:gap-6 items-center justify-center h-full">
          <li>
            <Link
              to="/"
              className="flex flex-col items-center text-neutral-400 hover:text-white text-xs"
            >
              <FaHome size={20} />
              <span className="mt-1">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/songs"
              className="flex flex-col items-center text-neutral-400 hover:text-white text-xs"
            >
              <FaMusic size={20} />
              <span className="mt-1">Songs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/songs/create"
              className="flex flex-col items-center text-neutral-400 hover:text-white text-xs"
            >
              <FaPlus size={20} />
              <span className="mt-1">Add</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

