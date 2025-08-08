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
    await axios.get(`${REACT_APP_API_URL}/plans/getMembership`, {
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
      const res = await axios.post(`${REACT_APP_API_URL}/members/register-member`, inputField, { withCredentials: true });
      toast.success("Added Successfully");

      // Find selected plan details
      const plan = membershipList.find(m => m._id === inputField.membership);

      // Generate PDF invoice
      generateInvoicePDF(inputField, plan);
      toast.success("Invoice Generated Successfully");

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

    // Colors
    const primary = [37, 99, 235]; // blue-600
    const accent = [16, 185, 129]; // green-500
    const light = [239, 246, 255]; // blue-50
    const yellow = [251, 191, 36]; // yellow-400

    // Header
    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Gym Joining Invoice", 105, 18, { align: "center" });

    let y = 38;

    // Card background first
    doc.setFillColor(...light);
    doc.roundedRect(10, y, 190, 80, 5, 5, "F");

    // Draw profile picture as a circle avatar, overlapping the card
    function drawAvatarAndContent() {
      if (member.profilePic) {
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(2);
        // Draw white circle border for avatar
        doc.circle(180, y + 15, 18, "S");
        doc.addImage(member.profilePic, "JPEG", 162, y - 3, 36, 36, undefined, "FAST");
      }
      drawContent();
    }

    function drawContent() {
      // Member Info
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Member Details", 18, y + 10);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(`Name:`, 18, y + 22);
      doc.setFont("helvetica", "bold");
      doc.text(`${member.name}`, 45, y + 22);

      doc.setFont("helvetica", "normal");
      doc.text(`Mobile No:`, 18, y + 32);
      doc.setFont("helvetica", "bold");
      doc.text(`${member.mobileNo}`, 45, y + 32);

      doc.setFont("helvetica", "normal");
      doc.text(`Address:`, 18, y + 42);
      doc.setFont("helvetica", "bold");
      doc.text(`${member.address}`, 45, y + 42);

      doc.setFont("helvetica", "normal");
      doc.text(`Joining Date:`, 18, y + 52);
      doc.setFont("helvetica", "bold");
      doc.text(`${member.joiningDate}`, 45, y + 52);

      doc.setFont("helvetica", "normal");
      doc.text(`Membership Plan:`, 18, y + 62);
      doc.setFont("helvetica", "bold");
      doc.text(`${plan.months} Months`, 60, y + 62);

      // Price and Next Bill Date Highlights (side by side, with gap)
      const priceBoxX = 18;
      const boxY = y + 85; // Increased Y for more space below details
      const boxH = 18;
      const boxW = 75;
      const gap = 12; // Gap between boxes
      const nextBillBoxX = priceBoxX + boxW + gap;

      // Price Box
      doc.setFillColor(16, 185, 129); // accent
      doc.roundedRect(priceBoxX, boxY, boxW, boxH, 4, 4, "F");
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(`Price: ${plan.price}`, priceBoxX + boxW / 2, boxY + 12, { align: "center" });

      // Next Bill Date Box
      const joinDate = new Date(member.joiningDate);
      const nextBillDate = new Date(joinDate.setMonth(joinDate.getMonth() + plan.months));
      doc.setFillColor(251, 191, 36); // yellow-400
      doc.roundedRect(nextBillBoxX, boxY, boxW, boxH, 4, 4, "F");
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`Next Bill: ${nextBillDate.toLocaleDateString()}`, nextBillBoxX + boxW / 2, boxY + 12, { align: "center" });

      // Footer
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 280, 210, 17, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for joining our gym! Stay healthy, stay fit.", 105, 290, { align: "center" });

      doc.save(`${member.name}_invoice.pdf`);
      // toast.success("Invoice PDF downloaded!");
    }

    // Load avatar image if present, else just draw content
    if (member.profilePic) {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = member.profilePic;
      img.onload = function () {
        member.profilePic = img;
        drawAvatarAndContent();
      };
      img.onerror = function () {
        drawContent();
      };
    } else {
      drawContent();
    }
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
            toast.error("Name must contain only letters and spaces");
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
          // Joining date validation: must not be in the past
          if (!inputField.joiningDate) {
            toast.error("Joining date is required");
            return;
          }
          const today = new Date();
          today.setHours(0, 0, 0, 0);
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