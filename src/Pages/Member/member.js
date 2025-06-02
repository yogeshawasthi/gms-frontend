import React, { useState, useEffect } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MemberCard from '../../Components/MemberCard/memberCard';
import Modal from '../../Components/Modal/modal';
import ForgotPassword from '../../Components/Forgotpassword/forgotPassword';
import AddmemberShip from '../../Components/Addmembership/addmemberShip';
import Addmembers from '../../Components/Addmembers.js/addmembers';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const Member = () => {
  const [addMemberShip, setAddmemberShip] = useState(false);
  const [addMember, setAddmember] = useState(false)
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("")
  const [isSearchModeOn, setIsSearchModeOn] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [startFrom, setSTartFrom] = useState(0);
  const [endTo, setEndTo] = useState(9);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(9);



  const [noOfPage, setNoOfPage] = useState(0);

  useEffect(() => {
    fetchData(0, 9);


  }, [])

  const fetchData = async (skip, limits) => {
    // Fetching members data from the server
    await axios.get(`http://localhost:4000/members/all-member?skip=${skip}&limit=${limits}`, {
      withCredentials: true,
    }).then((response) => {
      console.log(response.data);

      let totalData = response.data.totalMembers;
      setTotalData(totalData);
      setData(response.data.members);


      let extraPage = totalData % limit === 0 ? 0 : 1;
      let totalPage = parseInt(totalData / limit) + extraPage;
      setNoOfPage(totalPage);

      if (totalData == 0) {
        setSTartFrom(-1);
        setEndTo(0)

      } else if (totalData < 10) {
        setSTartFrom(0);
        setEndTo(totalData);
      }
    }).catch(err => {
      toast.error("Something Technical Fault")
      console.log(err)
    })
  }


  const handleMemberShip = () => {
    setAddmemberShip(prev => !prev);
  }

  const handleMembers = () => {
    setAddmember(prev => !prev);
  }


  const handlePrev = () => {
    if (currentPage != 1) {
      let currPage = currentPage - 1;
      setCurrentPage(currPage);
      var from = (currPage - 1) * 9;
      var to = (currPage * 9);
      setSTartFrom(from)
      setEndTo(to);
      let skipValue = skip - 9
      setSkip(skipValue);
      fetchData(skipValue, 9);
    }
  }


  const handleNext = () => {
    if (currentPage !== noOfPage) {
      let currPage = currentPage + 1;
      setCurrentPage(currPage);
      var from = (currPage - 1) * 9;
      var to = (currPage * 9);
      if (to > totalData) {
        to = totalData;
      }
      setSTartFrom(from)
      setEndTo(to);
      let skipValue = skip + 9
      setSkip(skipValue);
      fetchData(skipValue, 9);

    }

  }
  const handleSearchData = async () => {
    if (search !== "") {
      setIsSearchModeOn(true);
      await axios.get(`http://localhost:4000/members/searched-member?searchTerm=${search}`, { withCredentials: true }).then((response) => {
        console.log(response)
        let members = response.data.membes;// members is not 
        if (!Array.isArray(members)) {
          members = members ? [members] : [];
        }
        setData(members);
        setTotalData(members.length);
        if (members.length > 0) {
          setSTartFrom(0);
          setEndTo(members.length);
        } else {
          setSTartFrom(0);
          setEndTo(0);
        }
        setNoOfPage(1);
        setCurrentPage(1);
      }).catch(err => {
        toast.error("Something Technical Fault")
        console.log(err)
      })
    }
  }


  return (
    <div className='text-black p-5 w-3/4 h-[100vh]'>

      {/* Block for banner */}
      <div className='border-2 bg-slate-900 flex justify-between w-full text-white rounded-lg p-3'>
        <div className='border-2 pl-3 pr-3 pt-1 pb-1 rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' onClick={() => handleMembers()}>Add Member</div>
        <div className='border-2 pl-3 pr-3 pt-1 pb-1 rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' onClick={() => handleMemberShip()}>Membership  <AddIcon /></div>
      </div>

      {/* Block for back to dashboard button */}
      <Link to={"/dashboard"}><ArrowBackIcon /> Back to Dashboard </Link>

      <div className='mt-5 w-1/2 flex gap-2'>
        <input type='text' value={search} onChange={(e) => { setSearch(e.target.value) }} className='border-2 w-full p-2 rounded-lg' placeholder='Search By Name or Mobile no' />
        <div onClick={() => { handleSearchData() }} className="bg-slate-900 p-3 border-2 text-white rounded-lg cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black">
          <SearchIcon />
        </div>
      </div>

      <div className='mt-5 text-xl flex justify-between text-slate-900'>
        <div>Total Members</div>
        {
          !isSearchModeOn ? <div className='flex gap-5'>
            <div>{startFrom + 1} -{endTo} of {totalData} Members</div>
            <div className={`w-8 h-8 cursor-pointer border-2 flex items-center justify-center hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : ''}`} onClick={() => { handlePrev(); }}><ChevronLeftIcon /></div>
            <div className={`w-8 h-8 cursor-pointer border-2 flex items-center justify-center hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${currentPage === noOfPage ? 'bg-gray-200 text-gray-400' : ''}`} onClick={() => { handleNext(); }}><ChevronRightIcon /></div>
          </div> : null
        }
      </div>

      <div className='bg-slate-100 p-5 mt-5 rounded-lg grid gap-2 grid-cols-3 overflow-x-auto h-[65%]'>
        {data.length === 0 ? (
          <div>No members found.</div>
        ) : (
          data.map((item, index) => (
            <div key={item._id || index}>
              
              <MemberCard item={item} />
            </div>
          ))
        )}
      </div>
      {addMemberShip && (
        <Modal
          header={"Add Membership"}
          handleClose={handleMemberShip}
          content={<AddmemberShip />}
        />
      )}

      {addMember && (
        <Modal
          header={"Add New Member"}
          handleClose={handleMembers}
          content={<Addmembers handleClose={handleMembers} />}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Member;