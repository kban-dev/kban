import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/router';
import { request } from 'graphql-request';

import NavBar from '../../components/navbar';
import KBCard from '../../components/kbcard';
import Footer from '../../components/footer';

import { API_URL } from '../../api';

const fetcher = (query) => request(`${API_URL}/graphql`, query);

const Detail: NextPage = () => {
  const router = useRouter();

  const uid = router.query.uid
    ? (router.query.uid as string[]).join('/')
    : null;

  const { data, error } = useSWR(
    `{
          knowledgeBase(uid: "${uid}") {
            uid
            name
            shortname
            website
            description
            license
            lastUpdated
            tags
            sources
          }
        }
      `,
    fetcher,
  );

  return (
    <div className="App">
      <Head>
        <title>KBAN</title>
      </Head>

      <NavBar />

      <div className="flex min-h-screen">
        <div className="flex-auto px-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            {data && <KBCard item={data.knowledgeBase} />}
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-gray-200 relative inset-x-0 bottom-0 mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Detail;
