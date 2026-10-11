'use client'
import React from 'react';
import { BiSolidErrorAlt } from 'react-icons/bi';
import { useRouter } from 'next/navigation';


const GoogleError: React.FC = () => {
  const router = useRouter();
 
  return (
    <div className='font-bold bg-slate-950 h-screen py-32'>
        <div className='flex justify-center items-center  mt-3'>
        <div className='flex flex-col text-red-500 rounded-xl p-10 border-4'>
        <button className='flex justify-center  m-1 p-1'><BiSolidErrorAlt size={100} /></button>
          <button className='text-xl lg:text-3xl p-1 m-1'>Something went wrong</button>
          <button className='text-xl lg:text-3xl p-1 m-1 '>Authentication failed please try again.</button>
           <button onClick={() => router.push('/#contact')}
            className='text-xl p-1 m-1 rounded-full  text-white bg-blue-900'>
            Contact Support Center</button>
        </div>
        </div>
      </div>
  );

};

export default GoogleError;
