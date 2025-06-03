import React from 'react'
import CircleIcon from '@mui/icons-material/Circle';
import { Link } from 'react-router-dom';

const MemberCard = ({ item }) => {
    return (
        <Link
            to={`/member/${item?._id}`}
            className='bg-white rounded-lg p-3 cursor-pointer group transition duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500'
        >
            <div className='w-28 h-28 flex justify-center relative items-center border-2 p-1 mx-auto rounded-full'>
                <img className='w-full h-full rounded-full' src='https://i.pinimg.com/564x/3c/66/72/3c6672d8def70a54f2b35025f9abb29f.jpg' alt='Profile pic' />
                <CircleIcon className='absolute top-0 left-0' sx={{ color: "greenyellow" }} />
            </div>

            <div className='mx-auto mt-5 text-center text-xl font-semibold font-mono'>
                {"_*_"}
            </div>

            <div className='mx-auto mt-2 text-center text-xl font-mono'>
                {"+977" + "9xxxxxxxx"}
            </div>

            <div className='mx-auto mt-2 text-center text-xl font-mono'>
                Next Bill Date : {"2082-12-30"}
            </div>
        </Link>
    )
}

export default MemberCard