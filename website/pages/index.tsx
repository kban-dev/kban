import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Link from 'next/link';

import NavBar from '../components/navbar';
import SearchBox from '../components/searchbox';
import Footer from '../components/footer';

import { API_URL } from '../api';

const Home: NextPage<any> = ({ total_count }) => {
  return (
    <div className="App relative min-h-screen">
      <Head>
        <title>KBAN</title>
      </Head>

      <NavBar hideSearch={true} />

      <div className="flex">
        <div className="container mx-auto text-center px-2">
          <h1 className="text-4xl mt-12">
            Find, install, and publish knowledge.
          </h1>
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="lg:w-2/5">
              <SearchBox />
            </div>
            <div className="lg:w-2/5 mt-10">
              <p className="text-lg">{total_count} Knowledge Bases Indexed</p>
              <p className="mt-4">
                <Link href="/search">
                  <a className="text-blue-600 underline">Browse All...</a>
                </Link>
              </p>
            </div>
          </div>
          {/* <div className="flex justify-start mt-4 h-24">
            <div>New Knowledge Bases</div>
          </div>
          <div className="flex justify-start mt-4 h-24">
            <div>New Identities</div>
          </div> */}
        </div>
      </div>

      <div className="flex justify-center bg-gray-200 absolute inset-x-0 bottom-0 mt-4">
        <Footer />
      </div>
    </div>
  );
};

Home.getInitialProps = async () => {
  const res = await fetch(`${API_URL}/kb/metadata/total_count`);
  const data = await res.json();
  return { total_count: data.total_count };
};

export default Home;
