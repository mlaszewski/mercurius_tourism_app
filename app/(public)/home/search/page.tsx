'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import RouteCard from 'app/components/RouteCard';
import { IoMapOutline } from 'react-icons/io5';
import styles from './search.module.scss';

export default function Component() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState<any>('');
  const [searchResults, setSearchResults] = useState<any>({ guides: [], routes: [], regions: [] });

  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('query');
    setQuery(query ?? '');
    const filterType = searchParams.get('filterType');
    setFilterType(filterType ?? 'all');
    const filterValue = searchParams.get('filterValue');
    setFilterValue(filterValue ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (filterType === 'all') {
      axios.get(`/api/search/searchbar?query=${query}`).then((res) => setSearchResults(res.data.result));
    }
    if (filterType === 'guide') {
      axios
        .get(`/api/guide/${filterValue}`)
        .then((res) => setSearchResults({ guides: [res.data.result.guide], regions: [], routes: [...res.data.result.routes] }));
    }
    if (filterType === 'region') {
      axios.get(`/api/route?filterType=${filterType}&filterValue=${filterValue}`).then((res) => {
        setSearchResults({ guides: [], regions: [filterValue], routes: res.data.result });
      });
    }
  }, [query, filterType, filterValue]);

  if (status === 'authenticated' && session) {
    return (
      <div className={styles.mainContent}>
        {filterType === 'all' && (
          <div className={styles.allFeed}>
            <h1 className={styles.searchH1}>
              <strong>
                Wyniki wyszukiwania dla: <span className={styles.highlight}>{query}</span>
              </strong>
            </h1>
            <div>
              <h2 className={styles.searchH2}>Trasy</h2>
              <div className={styles.routes}>
                {searchResults.routes.map((route: any) => (
                  <RouteCard route={route} key={route?._id} />
                ))}
              </div>
            </div>
            <div>
              <h2 className={styles.searchH2}>Przewodnicy</h2>
              <div className={styles.guides}>
                {searchResults.guides.map((guide: any) => (
                  <Link href={`/home/search?filterType=guide&filterValue=${guide._id}`} key={guide._id} className={styles.guideLink}>
                    <div className={styles.guideSearch}>
                      <img src={guide?.photo || '/icons/user-icon-placeholder.png'} alt="profile" className={styles.guidePhotoSearch} />
                      <div className={styles.guideNameSearch}>{guide.profile?.name ?? guide.email}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className={styles.searchH2}>Regiony</h2>
              <div className={styles.regions}>
                {searchResults.regions.map((region: any) => (
                  <Link href={`/home/search?filterType=region&filterValue=${region}`} key={region} className={styles.regionLink}>
                    <div className={styles.region}>
                      {region?.photo ? (
                        <img src={region?.photo} alt={region?.name} className={styles.regionPhoto} />
                      ) : (
                        <IoMapOutline size={30} />
                      )}
                      <div className={styles.regionInfo}>
                        <div className={styles.regionLocality}>{region}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        {filterType === 'guide' && (
          <div className={styles.guideFeed}>
            <div className={styles.guideProfile}>
              <img src={searchResults.guides[0]?.photo ?? '/images/guy.svg'} alt="profile" className={styles.guidePhoto} />
              <h2 className={styles.guideName}>{searchResults.guides[0]?.profile?.name ?? searchResults.guides[0]?.email}</h2>
              <p className={styles.guideInfo}>{searchResults.guides[0]?.profile?.contact?.phone}</p>
              <p className={styles.guideInfo}>{searchResults.guides[0]?.profile?.contact?.email}</p>
              <p className={styles.guideBio}>{searchResults.guides[0]?.profile?.bio}</p>
            </div>
            <div className={styles.guideRoutes}>
              {searchResults.routes.map((route: any) => (
                <RouteCard route={route} key={route?._id} cardType="horizontal" />
              ))}
            </div>
          </div>
        )}
        {filterType === 'region' && (
          <div className={styles.regionFeed}>
            <div className={styles.regionProfile}>
              <h1 className={styles.searchH1}>{searchResults.regions[0]}</h1>
            </div>
            <div className={styles.regionRoutes}>
              {searchResults.routes.map((route: any) => (
                <RouteCard route={route} key={route?._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
