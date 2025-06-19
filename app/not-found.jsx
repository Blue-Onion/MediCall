import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import FuzzyText from '@/components/Fuzzytext'
const NotFound = () => {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
  
  <FuzzyText 
    baseIntensity={0.2} 
    hoverIntensity={0.5} 
    enableHover={true}
    className="mb-10"
  >
    
    404


  </FuzzyText>
  <FuzzyText 
    baseIntensity={0.2} 
    hoverIntensity={0.5} 
    enableHover={true}
  >
    
    Page Not Found


  </FuzzyText>

<Link href={"/"}>
<Button variant={"outline"} className=" bg-emerald-400" >Return To Home Page</Button>
</Link>
    </div>
  )
}

export default NotFound