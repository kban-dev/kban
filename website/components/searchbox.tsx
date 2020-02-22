import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';

import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

const SearchBox = () => {
  const router = useRouter();

  const [query, setQuery] = useState(router.query.q ?? '');

  useEffect(() => {
    query === '' && !router.query.q && setQuery(router.query.q ?? '');
  });

  // console.log(router.query.q);

  const handleSearch = (e) => {
    if (!e.key || e.key == 'Enter') {
      e.preventDefault();
      router.push({
        pathname: '/search',
        query: { q: query, skip: 0 },
      });
      e.target.blur();
    }
  };

  return (
    <div className="inline-flex items-center relative w-full">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleSearch}
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      ></input>
      <span className="mx-2 absolute right-0">
        <button onClick={handleSearch}>
          <Icon
            className="inline-block"
            path={mdiMagnify}
            size={1}
            color="gray"
          ></Icon>
        </button>
      </span>
    </div>
  );
};

export default SearchBox;
