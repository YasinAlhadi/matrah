import React, { useState } from 'react'

export default function CreateListing() {
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    beds: 1,
    baths: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: true,
    price: 0,
    Dprice: 0
  })
  const { type, name, beds, baths, parking, furnished, address, description, offer, price, Dprice } = formData
  function onChange(e) {
    console.log(e.target.value)
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
      <form action="">
        <p className='text-lg mt-6 font-semibold'>Sell or rent </p>
        <div className='flex'>
          <button type="button" id='type' value="sale" onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${type === 'rent' ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Sell
          </button>
          <button type="button" id='type' value="sale" onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${type === 'sale' ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            rent
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Name</p>
        <input type="text" id='name' value={name} onChange={onChange} placeholder='Name' maxLength="32" minLength="10" required className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
        <div className='flex space-x-6 mb-6'>
          <div>
            <p className='text-lg font-semibold'>Beds</p>
            <input type="number" id='beds' value={beds} onChange={onChange} minLength='1' maxLength='100' required className='w-full px-4 py-2 text-lg text-center text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
          <div>
            <p className='w-full text-lg font-semibold'>Baths</p>
            <input type="number" id='baths' value={baths} onChange={onChange} minLength='1' maxLength='100' required className='px-4 py-2 text-lg text-center text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
        </div>
        </div>
        <p className='text-lg mt-6 font-semibold'>Parking spot? </p>
        <div className='flex'>
          <button type="button" id='parking' value={true} onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Yes
          </button>
          <button type="button" id='parking' value={false} onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            No
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Furnished? </p>
        <div className='flex'>
          <button type="button" id='furnished' value={true} onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Yes
          </button>
          <button type="button" id='furnished' value={false} onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            No
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Address</p>
        <textarea type="text" id='address' value={address} onChange={onChange} placeholder='Address' required className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
        <p className='text-lg font-semibold'>Description</p>
        <textarea type="text" id='description' value={description} onChange={onChange} placeholder='Description' required className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
        <p className='text-lg font-semibold'>Offer? </p>
        <div className='flex mb-6'>
          <button type="button" id='offer' value={true} onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Yes
          </button>
          <button type="button" id='offer' value={false} onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            No
          </button>
        </div>
        <div className="flex space-x-3 items-center">
          <div>
            <p className='text-lg font-semibold'>Price</p>
            <input type="number" id='price' value={price} onChange={onChange} placeholder='Price' required nim="1" max="1000000000" className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
          {type === 'rent' && (
            <div>
            <p className='text-md w-full whitespace-nowrap'>$ / month</p>
          </div>
          )}
        </div>
        {offer && (
          <div>
            <p className='text-lg font-semibold'>Discounted Price</p>
            <input type="number" id='Dprice' value={Dprice} onChange={onChange} placeholder='Discounted Price' required min="1" max="1000000000" className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
        )}
        <div className='mb-6'>
          <p className='text-lg font-semibold'>Images</p>
          <p className='text-gray-600'>The first image will be the cover (max 6)</p>
          <input type="file" id="images" onChange={onChange} accept='.jpg,.png,.jpeg' multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out' />
        </div>
        <button type='submit' className='mb-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-out hover:shadow-lg'>
          Create Listing
        </button>
      </form>
    </main>
  )
}
