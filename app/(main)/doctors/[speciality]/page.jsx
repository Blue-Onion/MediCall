"use client"
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const {speciality} = useParams();
  return (
    <div>
      speciality: {speciality}
    </div>
  )
}

export default page
