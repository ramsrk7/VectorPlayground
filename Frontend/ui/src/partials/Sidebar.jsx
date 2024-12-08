import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Handle sidebar expansion state
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } ${
          variant === 'v2'
            ? 'border-r border-gray-200 dark:border-gray-700/60'
            : 'rounded-r-2xl shadow-sm'
        } ${
          sidebarExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button (for mobile) */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo or Brand Name */}
          <NavLink to="/" className="flex items-center">
            {/* Replace with your logo or brand name */}
            <span className={`text-xl font-semibold text-gray-800 dark:text-gray-100 ${sidebarExpanded ? 'block' : 'hidden'}`}>
              MyApp
            </span>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8 flex-grow">
          <ul className="mt-3">
            {/* Vector Comparison */}
            <li
              className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${
                pathname === "/" &&
                "from-red-500/[0.42] dark:from-red-500/[0.44] to-red-500/[0.44]"
              }`}
            >
              <NavLink
                end
                to="/"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  pathname === "/" ? "" : "hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <svg
                    className={`shrink-0 fill-current ${
                      pathname === "/" || pathname.includes("dashboard") ? "text-red-500" : "text-gray-400 dark:text-gray-500"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                    <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                  </svg>

                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Vector Comparison
                  </span>
                </div>
              </NavLink>
            </li>

            {/* About */}
            <li
              className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${
                pathname.includes("about") &&
                "from-blue-500/[0.12] dark:from-blue-500/[0.24] to-blue-500/[0.04]"
              }`}
            >
              <NavLink
                end
                to="/about"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                  pathname.includes("about") ? "" : "hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <svg
                    className={`shrink-0 fill-current ${
                      pathname.includes("about") ? "text-blue-500" : "text-gray-400 dark:text-gray-500"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.01 5.5 12.51 3 9.5 3S4 5.5 4 9.5 6.51 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>

                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    About
                  </span>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Expand / Collapse Button */}
        <div className="pt-3 flex justify-end">
          <button
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            <span className="sr-only">Expand / collapse sidebar</span>
            {/* Icon changes based on sidebar state */}
            <svg
              className={`w-6 h-6 fill-current transform transition-transform duration-200 ${
                sidebarExpanded ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
