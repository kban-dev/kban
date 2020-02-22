import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@mdi/react';
import {
  mdiUpdate,
  mdiLicense,
  mdiInformationOutline,
  mdiDotsHorizontal,
  mdiDirectionsFork,
  mdiAlertCircleOutline,
  mdiCheckCircleOutline,
} from '@mdi/js';

const KBCard = ({ item }: { item?: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    item && (
      <div className="border bg-white rounded-lg px-6 py-4">
        <div>
          {item?.shortname && (
            <span className="text-lg font-medium mr-1">{item?.shortname}</span>
          )}
          <Link href="/kb/[...id]" as={`/kb/${item?.uid}`}>
            <a>
              <span>{item?.name}</span>
            </a>
          </Link>
        </div>
        <div className="text-xs text-gray-600">
          <a href={item?.website} target="_blank">
            {item?.website}
          </a>
        </div>
        <div className="tags py-2 flex flex-wrap">
          {item?.tags &&
            (typeof item?.tags === 'string'
              ? JSON.parse(item?.tags)
              : item?.tags
            ).map((tag: string) => (
              <span className="text-xs py-1 px-2 mr-2 mb-1 border align-middle rounded truncate max-w-xs">
                {tag}
              </span>
            ))}
        </div>
        <p className="my-2">{item?.description}</p>
        <div className="mt-4 text-sm inline-flex align-middle">
          <div className="inline-flex items-center">
            <Icon
              className="mr-1"
              title="Updated"
              path={mdiUpdate}
              size={0.7}
            />
            <span>{item?.lastUpdated ?? '–'}</span>
          </div>
          <span className="mx-2"></span>
          <div className="inline-flex items-center">
            <Icon
              className="mr-1"
              title="License"
              path={mdiLicense}
              size={0.7}
            />
            <span>{item?.license ?? '–'}</span>
          </div>
          <span className="mx-2"></span>
          <div className="inline-flex items-center">
            <Icon
              className="mr-1"
              title="Not archived"
              path={mdiAlertCircleOutline}
              size={0.7}
            />
          </div>
          {/* <span className="mx-2"></span>
        <div className="inline-flex items-center">
          <Icon className="mr-1" path={mdiInformationOutline} size={0.7} />
        </div> */}
          <span className="mx-2"></span>
          <div className="inline-flex items-center relative">
            <span className="mr-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }}
              >
                <Icon path={mdiDotsHorizontal} size={0.7} />
              </a>
            </span>
            {isOpen && (
              <div className="absolute left-0 ml-8 mt-4 py-2 w-64 bg-white rounded border">
                <a
                  href="https://github.com/kban-dev/kban"
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  target="_blank"
                >
                  Edit/Report Package on GitHub
                </a>
              </div>
            )}
          </div>
          <span className="mx-2"></span>
          <div className="inline-flex items-center">
            <Icon
              className="mr-1"
              title="Sources"
              path={mdiDirectionsFork}
              size={0.7}
              color="gray"
            />
            <span className="text-gray-600">
              {item?.sources
                ? (typeof item?.sources === 'string'
                    ? JSON.parse(item?.sources)
                    : item?.sources
                  ).map((v) => (
                    <span className="mr-1">
                      <Link href="/docs#sources">
                        <a target="_blank">{v}</a>
                      </Link>
                    </span>
                  ))
                : '–'}
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default KBCard;
