import React, { useState, useEffect } from 'react';

import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';

import axios from 'axios';

import NavBar from '../components/navbar';
import KBCard from '../components/kbcard';
import Footer from '../components/footer';

import { API_URL } from '../api';

async function searchFetcher(params: { q: string; skip: number }) {
  const res = await axios.get(`${API_URL}/search`, {
    params: params,
  });
  const data = await res.data;
  return data;
}

const Search: NextPage = () => {
  const router = useRouter();

  const [searchType, setSearchType] = useState(router.query.type ?? 'kb');
  const [query, setQuery] = useState(router.query.q ?? '');
  const [skip, setSkip] = useState(
    parseInt((router.query.skip ?? '0') as string, 10),
  );
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    setQuery(router.query.q ?? '');
    setSkip(parseInt((router.query.skip ?? '0') as string, 10));
    window.scrollTo(0, 0);
    if (data?.hits.length === 0) {
      setReachedEnd(true);
    } else {
      setReachedEnd(false);
    }
    // setSearchType(router.query.type ?? 'kb');
  });

  const paginate = (skip) => {
    router.push({
      pathname: '/search',
      query: { q: query, skip: skip },
    });
  };

  // console.log(query, skip);

  const { data, error } = useSWR([query, skip], (query, skip) =>
    searchFetcher({ q: query, skip }),
  );

  if (error) {
    console.error(error);
    return <div></div>;
  }
  // if (!data) return <div></div>;

  return (
    <div className="App">
      <Head>
        <title>KBAN</title>
      </Head>

      <NavBar />

      <div className="flex min-h-screen">
        {/* <div className="flex-initial border-r" style={{ width: '400px' }}>Side</div> */}
        <div className="flex-auto px-6 py-4">
          <div className="mb-4">
            <ul className="flex">
              <li className="mr-3">
                <a
                  className={`inline-block text-blue-500 py-1 px-3 ${searchType ===
                    'kb' && 'border-b border-blue-500'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchType('kb');
                  }}
                  href="#"
                >
                  Knowledge Bases
                </a>
              </li>
              {/* <li className="mr-3">
                <a
                  className={`inline-block text-blue-500 py-1 px-3 ${searchType ===
                    'id' && 'border-b border-blue-500'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchType('id');
                  }}
                  href="#"
                >
                  Everything
                </a>
              </li> */}
            </ul>
          </div>
          {/* {data && (
            <div className="mb-4 flex text-lg">
              <div>{`${data?.hits?.length} results` ?? ''}</div>
            </div>
          )} */}
          <div className="grid grid-cols-1 gap-4">
            {data?.hits?.map((v: any) => (
              <KBCard item={v} />
            ))}
          </div>
          {data && (
            <div className="my-8 flex justify-center">
              <div className="inline-flex">
                <button
                  disabled={skip < 10}
                  className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(skip < 10 ? 0 : skip - 10);
                  }}
                >
                  Prev
                </button>
                <button
                  disabled={reachedEnd}
                  className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                  onClick={(e) => {
                    e.preventDefault();
                    !reachedEnd && paginate(skip + 10);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center bg-gray-200 relative inset-x-0 bottom-0 mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Search;
