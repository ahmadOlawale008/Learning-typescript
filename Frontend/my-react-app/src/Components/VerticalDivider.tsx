import React from 'react'

const VerticalDivider = ({text}:{text:string}) => {
  return (
      <div className='flex my-5 text-sm text-center mx-auto tracking-widest items-center after:ml-6 before:mr-6 after:bg-neutral-300 before:bg-neutral-300 before:rounded-md after:rounded-md after:flex-grow after:content-[""] after:h-[2px] before:flex-grow before:content-[""] before:h-[2px]'>
      {text}
    </div>
  )
}

export default VerticalDivider
