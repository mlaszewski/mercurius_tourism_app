'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { IoMapOutline, IoSearchOutline } from 'react-icons/io5';
import { FiBell } from 'react-icons/fi';
import Link from 'next/link';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { signOut, useSession } from 'next-auth/react';
import stylesGlobal from 'app/styles/global.module.scss';
import styles from './Searchbar.module.scss';
import Modal from '../ui/Modal';
import RouteDetailsCard from '../RouteDetailsCard';
import EditRouteModal from '../EditRouteModal';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState({ guides: [], routes: [], regions: [] });
  const [showModal, setShowModal] = useState(false);
  const [routeData, setRouteData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchInput.length < 2) {
      setSearchResults({ guides: [], routes: [], regions: [] });
      return;
    }
    setIsActive(true);
    axios.get(`/api/search/searchbar?query=${searchInput}`).then((res) => setSearchResults(res.data.result));
  }, [searchInput]);

  const handleUserMenuClick = () => {
    setIsOpen(!isOpen);
  };

  if (status === 'authenticated' && session) {
    return (
      <div className={styles.headerContainer}>
        <form
          className={styles.searchBarContainer}
          onSubmit={(e) => {
            e.preventDefault();
            if (
              searchInput.length < 2 ||
              (searchResults.regions.length === 0 && searchResults.guides.length === 0 && searchResults.routes.length === 0)
            )
              return;
            window.location.href = `/home/search?query=${searchInput}`;
          }}
        >
          <div className={styles.inputWrapper}>
            <IoSearchOutline className={styles.icon} />
            <input
              type="text"
              className={styles.input}
              placeholder="Szukaj..."
              onFocus={() => setIsActive(true)}
              onBlur={() => {
                if (searchInput.length < 2) setIsActive(false);
              }}
              onChange={(e) => {
                // setIsActive(true);
                setSearchInput(e.target.value);
              }}
            />
            {isActive && (
              <div className={styles.suggestions} ref={suggestionsRef}>
                {searchResults.guides.length > 0 && (
                  <div className={styles.userSection}>
                    <h2>Przewodnicy</h2>
                    {searchResults.guides.map((guide) => (
                      <div
                        className={styles.guide}
                        key={guide?._id}
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            searchInput.length < 2 ||
                            (searchResults.regions.length === 0 && searchResults.guides.length === 0 && searchResults.routes.length === 0)
                          )
                            return;
                          window.location.href = `/home/search?filterType=guide&filterValue=${guide._id}`;
                        }}
                      >
                        <img
                          src={guide?.photo || '/icons/user-icon-placeholder.png'}
                          alt={`${guide.email}`}
                          className={styles.guidePhoto}
                        />
                        <span className={styles.guideName}>{guide?.profile?.name ?? guide?.email}</span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.routes.length > 0 && (
                  <div className={styles.routeSection}>
                    <h2>Trasy</h2>
                    {searchResults.routes.map((route) => (
                      <div
                        className={styles.route}
                        key={route?._id}
                        onClick={() => {
                          setRouteData(route);
                          setShowModal(true);
                        }}
                      >
                        <img
                          src={route?.photos[0] || '/icons/route.svg'}
                          alt={route?.name}
                          className={route?.photos[0] ? styles.routePhoto : styles.routeIcon}
                        />

                        <div className={styles.routeInfo} data-cy="routeInfo">
                          <div className={styles.routeName}>{route?.name}</div>
                          <div className={styles.routeLocality}>
                            {route.addressInformation?.voivodeship?.name}, {route?.addressInformation?.county?.name},{' '}
                            {route?.addressInformation?.city?.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.regions.length > 0 && (
                  <div className={styles.regionSection}>
                    <h2>Regiony</h2>
                    {searchResults.regions.map((region) => (
                      <div
                        className={styles.region}
                        key={region}
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            searchInput.length < 2 ||
                            (searchResults.regions.length === 0 && searchResults.guides.length === 0 && searchResults.routes.length === 0)
                          )
                            return;
                          window.location.href = `/home/search?filterType=region&filterValue=${region}`;
                        }}
                      >
                        <IoMapOutline size={40} />
                        <div className={styles.regionInfo}>
                          <div className={styles.regionLocality}>{region}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {status === 'unauthenticated' ? (
            <button className={stylesGlobal.primaryButton} onClick={() => redirect('/login')}>
              Sign in
            </button>
          ) : (
            <div className={styles.rightSection}>
              <Link href="/home/activity">
                <FiBell className={styles.bellIcon} />
              </Link>
              <div className={styles.line} />
              <div className={styles.userMenu} onClick={handleUserMenuClick} ref={userMenuRef} data-cy="user-menu">
                <img src="/icons/user-icon-placeholder.png" alt="User" className={styles.userIcon} />
                <span className={styles.userName}>{session?.user?.profile?.name || session?.user?.email}</span>
                <MdOutlineKeyboardArrowDown className={styles.arrowDown} onClick={() => setIsOpen(!isOpen)} />
                {isOpen && (
                  <div ref={dropdownRef} className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''}`}>
                    <div data-cy="userMenu">
                      <a href="/profileEdit" className={styles.signOutLink}>
                        Profil
                      </a>
                    </div>
                    <div>
                      <a
                        href="/login"
                        className={styles.signOutLink}
                        onClick={(e) => {
                          e.preventDefault();
                          signOut({ callbackUrl: '/login' });
                          setIsOpen(false);
                        }}
                      >
                        Wyloguj
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
        {showModal && (
          <Modal
            title={<h2>Szczegóły trasy</h2>}
            onHide={(e) => {
              e.stopPropagation();
              setShowModal(false);
            }}
          >
            {isEditMode ? (
              <EditRouteModal
                routeData={routeData}
                closeModals={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                }}
              />
            ) : (
              <RouteDetailsCard route={routeData} onEdit={() => setIsEditMode(true)} />
            )}
          </Modal>
        )}
      </div>
    );
  }
  return null;
};

export default SearchBar;
