import { getDoctorById } from '@/action/appointment';
import { getAvailableSlots } from '@/action/doctor';
import React from 'react'

const page = async({params}) => {
  const id=await params.id;
  try {
    const{doctorData,slotData}=await Promise.all([
      getDoctorById(id),
      getAvailableSlots(id)
    ])
    return (
      <div>
        
      </div>
    )
  } catch (error) {
    console.log(error);
    
  }
}

export default page
