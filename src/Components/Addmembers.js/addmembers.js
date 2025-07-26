import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';


const Addmembers = ({ }) => {
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
        if (response.data.length == 0) {
          toast.error("No any Membership added yet", {
            className: "text-lg"
          });
        } else {



          let a = response.data.membership[0]._id;
          setSelectedOption(a)
          setInputField({...inputField,membership:a})


        }

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
   

    try {
      // Add your registration logic here
      await axios.post('http://localhost:4000/members/register-member', inputField, { withCredentials: true }).then((res) => {
        toast.success("Added Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
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
          onChange={(event) => {
            // Accept only numbers and max 10 digits
            const value = event.target.value.replace(/\D/g, '').slice(0, 10);// Ensure only numbers and limit to 10 digits
            setInputField({ ...inputField, mobileNo: value });
          }}
          placeholder="Mobile No"
          type="text"
          maxLength={10}
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