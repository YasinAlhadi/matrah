import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const [pageState, setPageState] = useState('Sign In');
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState('Profile');
      } else {
        setPageState('Sign In');
      }
    });
  }, [auth]);
  function matchRoute(route) {
    if (route == location.pathname) return true;
  }
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Matrah-logo" className="w-12 h-12" />{' '}
            <h1 className="self-center text-2xl font-semibold whitespace-nowrap">
              Matrah
            </h1>
          </a>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button
                  className={`font-semibold ${
                    matchRoute('/sign-up') ? 'text-blue-500' : ''
                  }`}
                  onClick={() => navigate('/')}
                >
                  Sign Up
                </button>
              </li>
              <li>
                <button
                  className={`font-semibold ${
                    matchRoute('/profile') ? 'text-blue-500' : ''
                  }`}
                  onClick={() => navigate('/profile')}
                >
                  {pageState}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
