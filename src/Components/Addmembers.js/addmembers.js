import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

const Addmembers = ({}) => {
  const [inputField, setInputField] = useState({
    name: '',
    mobileNo: '',
    address: '',
    membership: '',
    profilePic: 'https://th.bing.com/th/id/OIP.gj6t3grz5no6UZ03uIluiwHaHa?rs=1&pid=ImgDetMain',
    joiningDate: '',
  });
  const [imageLoader, setImageLoader] = useState(false);
  const [membershipList, setMembershipList] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };


  const fetchMembership = async () => {
    await axios.get('http://localhost:4000/plans/getMembership', {
      withCredentials: true,
    })
      .then((response) => {
        setMembershipList(response.data.membership);
        toast.success(`${response.data.membership.length} Memberships Fetched`, {
          toastId: 'membership-fetch-success',
        });
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error fetching membership details');
      });
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  const handleOnChangeSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setInputField({ ...inputField, membership: value });
  };

  console.log(inputField)

  const handleRegisterButton = async () => {
    // Calculate age from DOB
    const dob = new Date(inputField.joiningDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      toast.error("You must be at least 18 years old to register for the gym.");
      return;
    }

    try {
      // Add your registration logic here
      console.log('Registering member:', inputField);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong during registration');
    }
  };

  const uploadImage = async (event) => {
    setImageLoader(true);

    console.log("Image Uploading")
    const files = event.target.files;
    const data = new FormData();
    data.append('file', files[0]);

    // dnbtfydel

    data.append('upload_preset', 'gym-management');

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dnbtfydel/image/upload", data);
      console.log(response)
      const imageUrl = response.data.url;
      setInputField({ ...inputField, ['profilePic']: imageUrl })
      setImageLoader(false)
    } catch (err) {
      console.log(err)
      setImageLoader(false)
    }

  }


  return (
    <div className="text-black">
      <div className="grid gap-5 grid-cols-2 text-lg">
        <input
          value={inputField.name}
          onChange={(event) => handleOnChange(event, 'name')}
          placeholder="Name of the Joinee"
          type="text"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.mobileNo}
          onChange={(event) => handleOnChange(event, 'mobileNo')}
          placeholder="Mobile No"
          type="text"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.address}
          onChange={(event) => handleOnChange(event, 'address')}
          placeholder="Enter Address"
          type="text"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.joiningDate}
          onChange={(event) => handleOnChange(event, 'joiningDate')}
          type="date"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <select
          value={selectedOption}
          onChange={handleOnChangeSelect}
          className="border-2 w-[90%] h-12 pt-2 pb-2 border-slate-400 rounded-md placeholder:text-gray"
        >
          {membershipList.length > 0 ? (
            membershipList.map((item, index) => (
              <option key={index} value={item._id}>
                {item.months} Months Membership
              </option>
            ))
          ) : (
            <option disabled>No Membership Plans Available</option>
          )}
        </select>
        <input type="file" onChange={(e) => uploadImage(e)} />
        <div className="w-[100px] h-[100px]">
          <img src={inputField.profilePic} alt="Profile" className="w-full h-full rounded-full border border-pink-950" />
          {
                imageLoader && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                    <LinearProgress color="secondary" />
                </Stack>
            }

        </div>

      </div>
      <button
        onClick={handleRegisterButton}
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Register
      </button>
      <ToastContainer />
    </div>
  );
};

export default Addmembers;