import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
const Modal = ({handleClose,content,header}) => {
  return (
    <div className='w-full h-[100vh] fixed bg-black bg-opacity-50 text-black top-0 left-0 flex justify-center  p-16 '>
        <div className='w-1/2 bg-white rounded-lg h-fit mt-16 p-2 '>
        <div className='flex justify-between  cursor-pointer'>
            <div className='text-2xl font-semibold pl-46'>{header}</div>
            <div onClick={()=>handleClose()}><CloseIcon sx={{fontSize:"22px"}} /></div>

        </div>
        <div className='mt-5'>
          {content}
        </div>
        </div>
    </div>
  )
}

export default Modal






