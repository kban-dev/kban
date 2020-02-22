import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Icon from '@mdi/react';
import { mdiOpenInNew } from '@mdi/js';

import NavBar from '../../components/navbar';
import Footer from '../../components/footer';

import { API_URL } from '../../api';

type Props = {
  sources: any[];
};

const Docs: NextPage<Props> = ({ sources }) => {
  return (
    <div className="App">
      <Head>
        <title>KBAN</title>
      </Head>

      <NavBar />

      <div className="flex min-h-screen">
        <div className="container mx-auto pl-6">
          <h1 className="text-2xl mt-12">Docs</h1>
          <div className="flex flex-col mt-12">
            <div id="about" className="w-5/6 mb-8">
              <h2 className="text-xl">About KBAN</h2>
              <p className="my-2">
                KBAN aims to be a simple, open computational knowledge
                infrastructure, in a way comparable to CPAN, PyPI, RubyGems, CKAN,
                etc. KBAN is under development at{' '}
                <a
                  href="https://github.com/kban-dev/kban"
                  className="text-blue-600 underline"
                >
                  the GitHub repository
                </a>
                .
              </p>
              <p>
                We plan to:
                <ul className="list-disc list-inside py-2">
                  <li>(really) archive knowledge bases with versioning</li>
                  <li>provide a CLI package manager for knowledge bases</li>
                  <li>integrate Linked Data Fragments architecture</li>
                </ul>
                and so on.
              </p>
            </div>
            <div id="publish" className="w-5/6 mb-8">
              <h2 className="text-xl">Publish</h2>
              <div>
                <p className="my-2">
                  For now, please make a suggestion on{' '}
                  <a
                    href="https://github.com/kban-dev/kban"
                    className="text-blue-600 underline"
                  >
                    GitHub Issues
                </a>
                  .
                </p>
              </div>
            </div>
            <div id="sources" className="w-5/6 mb-8">
              <h2 className="text-xl">Sources</h2>
              {sources?.map((v) => (
                <div className="my-4">
                  <p className="inline-flex items-center mb-1">
                    <span className="font-bold">{v.source_id}</span>
                    <a href={v.source_website} target="_blank" className="ml-1">
                      <Icon
                        className="inline-block"
                        path={mdiOpenInNew}
                        size={0.7}
                      />
                    </a>, licensed under {v.source_license}
                  </p>
                  <pre className="bg-gray-200 p-4 rounded text-sm">
                    {JSON.stringify(v, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-gray-200 relative inset-x-0 bottom-0 mt-4">
        <Footer />
      </div>
    </div>
  );
};

Docs.getInitialProps = async () => {
  const res = await fetch(`${API_URL}/kb/metadata/sources`);
  const sources = await res.json();
  return { sources: sources };
};

export default Docs;
