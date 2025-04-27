import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Addmembers = () => {
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

  const uploadImage = async (event) => {
    setImageLoader(true);
    console.log("Image Uploading")
    const files = event.target.files;
    const data = new FormData();
    data.append('file', files[0]);

    // mashhuudanny

    data.append('upload_preset', 'gym-management');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/mashhuudanny/image/upload',
        data
      );
      const imageUrl = response.data.url;
      setInputField({ ...inputField, profilePic: imageUrl });
      setImageLoader(false);
    } catch (err) {
      console.error(err);
      setImageLoader(false);
    }
  };

  const fetchMembership = async () => {
    try {
      const response = await axios.get('http://localhost:4000/plans/get-membership', {
        withCredentials: true,
      });
      setMembershipList(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while fetching membership plans');
    }
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  const handleOnChangeSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setInputField({ ...inputField, membership: value });
  };

  const handleRegisterButton = async () => {
    try {
      // Add your registration logic here
      console.log('Registering member:', inputField);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong during registration');
    }
  };

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
        <input type="file" onChange={uploadImage} />
        <div className="w-1/4">
          <img src={inputField.profilePic} alt="Profile" className="w-full h-auto" />
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