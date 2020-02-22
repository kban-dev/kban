import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
// import { useRouter } from 'next/router';

import SearchBox from '../components/searchbox';

const NavBar = (props: { hideSearch?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <nav className="navbar lg:px-6">
      <div className="inline-block lg:hidden">
        <button onClick={() => { setIsMenuOpen(!isMenuOpen) }} className="flex items-center px-2 mr-3 py-2 text-gray-600 hover:text-gray-800">
          <Icon
            path={mdiMenu}
            size={0.9}
            className="text-gray-600 hover:text-gray-800"
          />
        </button>
      </div>
      <div className="flex items-center flex-shrink-0 lg:mr-6">
        <a href="/">
          <span className="font-semibold text-xl tracking-tight">KBAN</span>
        </a>
      </div>
        <div className={`${isMenuOpen ? 'hidden' : 'inline-block'} w-full md:inline-block flex-grow lg:flex lg:items-center lg:w-auto`}>
          <div className="lg:flex-grow mt-3 md:mt-auto">
            {props.hideSearch !== true && (
              <div className="max-w-lg">
                <SearchBox />
              </div>
            )}
          </div>
          <div className="text-sm">
            <a
              href="/docs#publish"
              className="block mt-4 lg:inline-block lg:mt-0 mr-4 text-gray-600 hover:text-gray-800"
            >
              Publish
            </a>
            <Link href="/docs">
              <a className="block mt-4 lg:inline-block lg:mt-0 mr-4 text-gray-600 hover:text-gray-800">
                Docs
              </a>
            </Link>
            <a
              href="https://github.com/kban-dev/kban"
              className="block mt-4 lg:inline-block lg:mt-0 mr-4 text-gray-600 hover:text-gray-800"
            >
              Join
            </a>
          </div>
        </div>
    </nav>
  );
};

export default NavBar;
