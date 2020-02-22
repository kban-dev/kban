import React, { useState } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';

const NavBar = () => {
  const router = useRouter();

  const [query, setQuery] = useState(router.query?.q ?? '');

  return (
    <nav className="navbar">
      <div className="flex items-center flex-shrink-0 mr-6">
        <a href="/">
          <span className="font-semibold text-xl tracking-tight">KBAN</span>
        </a>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="lg:flex-grow">
          <div className="max-w-lg">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            ></input>
          </div>
        </div>
        <div className="text-sm">
          <a href="#docs" className="block mt-4 lg:inline-block lg:mt-0 mr-4">
            Docs
          </a>
          <a href="#github" className="block mt-4 lg:inline-block lg:mt-0 mr-4">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
