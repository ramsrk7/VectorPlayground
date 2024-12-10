// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const About = () => {
  // Initialize state for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    console.log('sidebarOpen:', sidebarOpen);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Main Content */}
          <main className="flex-grow pb-4 px-4 bg-gray-100 pt-16">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-4 font-mono">
              <h1 className="text-2xl font-bold mb-4 text-center">About Vector Playground</h1>
              
              <p className="mb-3">
                <span className="font-bold">Vector Playground</span> is an open-source project designed to make learning about vector embeddings, vector search, recommendations, and related technologies both fun and engaging. Whether you're a beginner eager to grasp the fundamentals or an experienced developer looking to deepen your understanding, Vector Playground offers interactive tools and visualizations to enhance your learning journey.
              </p>
              
              <p className="mb-3">
                Our primary goal is to demystify how transformer models operate behind the scenes, especially within the framework of <span className="italic">Agentic AI</span>. By providing a hands-on environment, users can explore the intricate mechanisms of these sophisticated models, gaining valuable insights into their functionality and applications.
              </p>
              
              <p className="mb-4">
                As an open-source initiative, we warmly welcome contributions from the community. Whether you want to report issues, suggest features, or contribute code, your participation helps us improve and expand the platform, making it a richer resource for everyone interested in the field.
              </p>
              
              <div className="text-center">
                <a
                  href="https://github.com/ramsrk7/VectorPlayground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-lg"
                >
                  View the Source Code on GitHub
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default About;
