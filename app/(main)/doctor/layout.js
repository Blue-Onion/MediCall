import PageHeader from '@/components/pageHeader'
import { Stethoscope } from 'lucide-react'
import React from 'react'

const layout = ({children}) => {
  return (
    <div className='container mx-auto'>
      <PageHeader title={"Doctor Dashboard"} icon={<Stethoscope/>} />
      {children}
    </div>
  )
}

export default layout
