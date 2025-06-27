import React from 'react'

const layout = ({children}) => {
  return (
    <div className='mx-auto container px-4 py-12'>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export default layout
