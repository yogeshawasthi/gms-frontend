import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';

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
  const [selectedOption, setSelectedOption] = useState(''); // default: none selected

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };


  const fetchMembership = async () => {
    await axios.get('http://localhost:4000/plans/getMembership', {
        withCredentials: true,
    })
        .then((response) => {
            setMembershipList(response.data.membership);
            // Do NOT set default selected plan here
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
    const res = await axios.post('http://localhost:4000/members/register-member', inputField, { withCredentials: true });
    toast.success("Added Successfully");

    // Find selected plan details
    const plan = membershipList.find(m => m._id === inputField.membership);

    // Generate PDF invoice
    generateInvoicePDF(inputField, plan);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (err) {
    console.error(err);
    toast.error(` Use Diffrent Mobile number`);
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

  const generateInvoicePDF = (member, plan) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Gym Joining Invoice', 20, 20);

    doc.setFontSize(16);
    // doc.text('Gym Name: Gym World', 20, 32);

    doc.setFontSize(12);
    doc.text(`Name: ${member.name}`, 20, 50);
    doc.text(`Mobile No: ${member.mobileNo}`, 20, 60);
    doc.text(`Address: ${member.address}`, 20, 70);
    doc.text(`Joining Date: ${member.joiningDate}`, 20, 80);
    doc.text(`Membership Plan: ${plan.months} Months`, 20, 90);

    // Print price clearly
    doc.setFontSize(14);
    doc.text(`Price: ${plan.price}`, 20, 100);

    doc.setFontSize(12);
    // Calculate next bill date
    const joinDate = new Date(member.joiningDate);
    const nextBillDate = new Date(joinDate.setMonth(joinDate.getMonth() + plan.months));
    doc.text(`Next Bill Date: ${nextBillDate.toLocaleDateString()}`, 20, 110);

    doc.save(`${member.name}_invoice.pdf`);
};

  return (
    <div className="text-black">
      <div className="grid gap-5 grid-cols-2 text-lg">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Name</label>
          <input
            value={inputField.name}
            onChange={(event) => handleOnChange(event, 'name')}
            placeholder="Name of the Joinee"
            type="text"
            className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Mobile No</label>
          <input
            value={inputField.mobileNo}
            onChange={(event) => {
              // Accept only numbers and max 10 digits
              const value = event.target.value.replace(/\D/g, '').slice(0, 10);
              setInputField({ ...inputField, mobileNo: value });
            }}
            placeholder="Mobile No"
            type="text"
            maxLength={10}
            className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Address</label>
          <input
            value={inputField.address}
            onChange={(event) => handleOnChange(event, 'address')}
            placeholder="Enter Address"
            type="text"
            className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Joining Date</label>
          <input
            value={inputField.joiningDate}
            onChange={(event) => handleOnChange(event, 'joiningDate')}
            type="date"
            className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Membership Plan</label>
          <select
            value={selectedOption}
            onChange={handleOnChangeSelect}
            className="border-2 w-[90%] h-12 pt-2 pb-2 border-slate-400 rounded-md placeholder:text-gray"
          >
            <option value="">Select  Plan</option>
            {membershipList.length > 0 ? (
              membershipList.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.months} Months plan
                </option>
              ))
            ) : (
              <option disabled>No  Plans Available</option>
            )}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Profile Picture</label>
          <input type="file" onChange={(e) => uploadImage(e)} />
          <div className="w-[100px] h-[100px] mt-2">
            <img src={inputField.profilePic} alt="Profile" className="w-full h-full rounded-full border border-pink-950" />
            {imageLoader && (
              <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                <LinearProgress color="secondary" />
              </Stack>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          // Name validation: must be non-empty and only letters/spaces
          if (!inputField.name.trim()) {
            toast.error("Name is required");
            return;
          }
          if (!/^[A-Za-z\s]+$/.test(inputField.name.trim())) {
            toast.error("Name must contain only letters");
            return;
          }
          // Mobile validation
          if (inputField.mobileNo.length !== 10) {
            toast.error("Mobile number should be 10 digits");
            return;
          }
          // Address validation
          if (!inputField.address.trim()) {
            toast.error("Address is required");
            return;
          }
          // Joining date validation
          if (!inputField.joiningDate) {
            toast.error("Joining date is required");
            return;
          }
          // Prevent past dates
          const today = new Date();
          today.setHours(0,0,0,0);
          const joiningDate = new Date(inputField.joiningDate);
          if (joiningDate < today) {
            toast.error("Joining date cannot be in the past");
            return;
          }
          // Membership validation
          if (!inputField.membership || inputField.membership === "") {
            toast.error("Please select a membership plan");
            return;
          }
          handleRegisterButton();
        }}
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Register
      </button>
      <ToastContainer />
    </div>
  );
};

export default Addmembers;