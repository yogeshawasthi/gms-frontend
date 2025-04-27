import React from 'react'
import Login from '../../Components/Login/login'
import SignUp from '../../Components/Login/Signup/signUp'

const Home = () => {
    return (
        <div className='w-full h-[100vh]'>

            <div className='boredr-2 border-slate-800 bg-slate-800 text-white p-5 font-semibold text-xl'>
                Welcome To Gym Managment System
            </div>
            <div className='w-full bg-cover flex justify-center h-[100%] bg-[url("https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")]'>
            <div className='w-full lg:flex gap-40'>

               <Login />
               <SignUp />
        </div>
          
    </div>
        
     </div>   
    )
}
export default Home