import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import { db } from '../../firebase.config';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentail = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: formData.fullName,
      });
      const user = userCredentail.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), formDataCopy);
      navigate('/');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJ1aWxkaW5nfGVufDB8fDB8fHww"
            alt="sign-in"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={handleSubmit}>
            <input
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6"
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <input
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6"
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              placeholder="Email Address"
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter Your Password"
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <IoIosEye className="absolute right-3 top-3 text-xl" />
                ) : (
                  <IoIosEyeOff className="absolute right-3 top-3 text-xl" />
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-lg">
              <p className="mb-6">
                Have an account?{' '}
                <Link
                  to="/sign-in"
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  Sign Up
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  Reset Password
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase transition duration-150 ease-out"
              type="submit"
            >
              Sign Up
            </button>
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-400 after:border-t after:flex-1 after:border-gray-400">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
