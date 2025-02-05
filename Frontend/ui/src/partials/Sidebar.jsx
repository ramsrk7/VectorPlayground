// src/partials/Sidebar.jsx

//V2

import React, { useEffect, useRef } from "react";
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

    // Since sidebar is always expanded, no need for sidebarExpanded state
    const sidebarExpanded = true;

    // Close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [sidebarOpen, setSidebarOpen]);

    // Since sidebarExpanded is always true, add 'sidebar-expanded' class once
    useEffect(() => {
        document.querySelector("body").classList.add("sidebar-expanded");
        // Optionally, set localStorage if needed
        localStorage.setItem("sidebar-expanded", "true");
    }, []);

    // Remove the useEffect that handles window resize
    // The sidebar will no longer auto-collapse or expand based on screen size

    return (
        <div className="min-w-fit">
            {/* Sidebar backdrop (mobile only) */}
            <div
                className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                aria-hidden="true"
                onClick={() => setSidebarOpen(false)} // Add onClick handler here
            ></div>

            {/* Sidebar */}
            <div
                id="sidebar"
                ref={sidebar}
                className={`flex flex-col absolute z-50 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar bg-red-50 dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } ${variant === 'v2'
                        ? 'border-r border-gray-200 dark:border-gray-700/60'
                        : 'rounded-r-2xl shadow-sm'
                    } w-64`} // Always set width to w-64 since sidebarExpanded is always true
            >
                {/* Sidebar header */}
                <div className="flex justify-between my-5 mb-10 pr-3 sm:px-2 sm-hidden">
                    {/* Logo or Brand Name */}
                    <NavLink to="/" className="flex items-center">
                        {/* Replace with your logo or brand name */}
                        <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-mono">
                            Vector Playground
                        </span>
                    </NavLink>
                </div>

                {/* Links */}
                <div className="space-y-8 flex-grow">
                    <ul className="mt-3">
                        {/* Vector Comparison */}
                        <li
                            className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname === "/" &&
                                "from-red-500/[0.42] dark:from-red-500/[0.44] to-red-500/[0.44]"
                                }`}
                        >
                            <NavLink
                                end
                                to="/"
                                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname === "/" ? "" : "hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <svg
                                        className={`shrink-0 fill-current ${pathname === "/" || pathname.includes("vector") ? "text-red-500" : "text-gray-400 dark:text-gray-500"
                                            }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                    >
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="10"
                                            fontFamily="Brush Script MT, cursive"
                                            fill="currentColor"
                                        >
                                            VC
                                        </text>
                                    </svg>

                                    <span className="text-sm font-mono font-medium ml-4 duration-200">
                                        Vector Comparison
                                    </span>
                                </div>
                            </NavLink>
                        </li>

                        {/*Naive RAG*/}
                        <li
                            className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("naiverag") &&
                                "from-red-500/[0.42] dark:from-red-500/[0.44] to-red-500/[0.44]"
                                }`}
                        >
                            <NavLink
                                end
                                to="/naiverag"
                                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("naiverag") ? "" : "hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <svg
                                        className={`shrink-0 fill-current ${pathname === "/naiverag" || pathname.includes("naiverag") ? "text-red-500" : "text-gray-400 dark:text-gray-500"
                                            }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                    >
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="10"
                                            fontFamily="Brush Script MT, cursive"
                                            fill="currentColor"
                                        >
                                            NR
                                        </text>
                                    </svg>

                                    <span className="text-sm font-medium font-mono ml-4 duration-200">
                                        Naive RAG
                                    </span>
                                </div>
                            </NavLink>
                        </li>

                        {/* About */}
                        <li
                            className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("about") &&
                                "from-red-500/[0.42] dark:from-red-500/[0.44] to-red-500/[0.44]"
                                }`}
                        >
                            <NavLink
                                end
                                to="/about"
                                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("about") ? "" : "hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <svg
                                        className={`shrink-0 fill-current ${pathname === "/about" || pathname.includes("about") ? "text-red-500" : "text-gray-400 dark:text-gray-500"
                                            }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                    >
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="10"
                                            fontFamily="Brush Script MT, cursive"
                                            fill="currentColor"
                                        >
                                            Ab
                                        </text>
                                    </svg>

                                    <span className="text-sm font-medium font-mono ml-4 duration-200">
                                        About
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );

}

export default Sidebar;
