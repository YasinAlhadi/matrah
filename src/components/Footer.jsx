import React from 'react'
import { IoIosContacts } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white py-5 mt-6'>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start">
                <h1 className='text-2xl font-bold'>Matrah</h1>
                <p className='mt-2'>Matrah is a real estate platform that connects buyers and sellers of properties in the UAE.</p>
            </div>
            <div className="flex flex-col items-center mt-5 md:mt-0">
                <h1 className='text-xl font-bold'>Contact Us</h1>
                <p className='mt-2 flex items-center space-x-2'>
                    <IoIosContacts className='h-6 w-6' />
                    <span>
                        123, Main Street, Dubai, UAE
                    </span>
                </p>
                <p className='mt-2 flex items-center space-x-2'>
                    <FaPhone className='h-6 w-6' />
                    <span>
                        +971 123 456 789
                    </span>
                </p>
                <p className='mt-2 flex items-center space-x-2'>
                    <FaWhatsapp className='h-6 w-6' />
                    <span>
                        +971 123 456 789
                    </span>
                </p>
            </div>
            <div className="flex flex-col items-center mt-5 md:mt-0">
                <h1 className='text-xl font-bold'>Follow Us</h1>
                <div className="flex items-center space-x-2 mt-2">
                    <FaFacebookF className='h-6 w-6' />
                    <FaTwitter className='h-6 w-6' />
                    <FaInstagram className='h-6 w-6' />
                </div>
            </div>
        </div>
    </footer>
  )
}
