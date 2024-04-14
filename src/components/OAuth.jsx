import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate } from 'react-router';

function OAuth() {
  const navigate = useNavigate();
  async function handleGoogleSignIn() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // check if user is new or existing
      const docREf = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docREf);
      if (!docSnap.exists()) {
        await setDoc(docREf, {
          fullName: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('could not sign in with google');
      console.error(error);
    }
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-700 hover:bg-red-500 text-white text-sm uppercase font-bold py-2 px-4 rounded-full flex items-center justify-center"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign in with Google
        </button>
      </div>
    </>
  );
}

export default OAuth;
