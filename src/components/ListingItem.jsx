import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing, id }) {
  return (
    <li className='flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
        <Link className='contents' to={`/category/${listing.type}/${id}`}>
            <img className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in' loading='lazy' src={listing.imgUrls[0]} alt="" />
            <div className="w-full p-[10px]">
                <div className="flex items-center space-x-1">
                    <MdLocationOn className='h-4 w-4 text-green-800' />
                    <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
                </div>
                <p className='font-semibold text-xl truncate'>{listing.name}</p>
                <p className='font-semibold mt-2 text-fuchsia-900'>
                    ${listing.offer ? listing.Dprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {listing.offer && <span className="text-red-500 ml-2">Offer</span>}
                    {listing.type == "rent" && <span className="text-green-500 ml-2">Rent / Month </span>}
                    {listing.type == "sale" && <span className="text-blue-500 ml-2">Sale</span>}
                </p>
                <div className="flex items-center mt-[10px] space-x-3">
                    <div className="flex items-center space-x-1">
                        <p className='font-bold text-sm'>{listing.bed > 1 ? `${listing.bed} Beds` : "1 Bed"}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <p className='font-bold text-sm'>{listing.bath > 1 ? `${listing.bath} Baths` : "1 Bath"}</p>
                    </div>
                </div>
            </div>
        </Link>
    </li>
  )
}
