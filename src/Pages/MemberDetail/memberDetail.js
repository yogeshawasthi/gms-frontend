import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "react-switch";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const MemberDetail = () => {
  const [status, setStatus] = useState("Pending");
  const [renew, setRenew] = useState(false);
  const [member, setMember] = useState(null);
  const [data,setData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [membership,setMembership] = useState([]);
  const[planMember,setPlanMember] = useState("");

  useEffect(() => {
    fetchData();
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
      axios.get(`http://localhost:4000/plans/getMembership`, { withCredentials: true })
        .then((response) => {
          setMembership(response.data.membership);
          setPlanMember(response.data.membership[0].months);
          console.log("Membership data fetched successfully:", response.data.membership);
        }).catch((error) => {
          console.error("Error fetching membership data:", error);
          toast.error("Failed to fetch membership data.");
        });
    };

      

  const fetchData = async () => {
    console.log("fetchData called with id:", id); // Add this
    await axios
      .get(`http://localhost:4000/members/get-member/${id}`, { withCredentials: true })
      .then((response) => {
        console.log("API response:", response); // Add this
        setData(response.data.member)
        setMember(response.data.member || response.data);
        setStatus(response.data.member?.status || "Pending");
        toast.success(response.data.member.message || "Member data fetched successfully!");
      })
      .catch((error) => {
        console.error("Error fetching member data:", error);
        toast.error("Failed to fetch member data.");
      });
  };

  const handleSwitchBtn = () => {
    let newStatus = status === "Active" ? "Pending" : "Active";
    setStatus(newStatus);
    console.log(`Status changed to: ${newStatus}`);
  };


  const isDateInPast = (inputData) => {
    const today = new Date();
    const givenDate = new Date(inputData);
    return givenDate < today;
  }

  const handleOnChangeSelect = (event) => {
    let value = event.target.value;
    setPlanMember(value);
  }


  return (
    <div className="w-3/4 text-black p-5">
      <div
        onClick={() => {
          navigate(-1);
        }}
        className="border-2 w-fit text-xl font-sans text-white p-2 rounded-xl bg-slate-900 cursor-pointer"
      >
        <ArrowBackIcon /> Go Back
      </div>
      <div className="mt-10 p-2">
        <div className="w-[100%] h-fit flex">
          <div className="w-1/3 mx-auto">
            <img
              src={
                member?.profilePic ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtrnHUFH3hZsJtvAagjwbZrxdx-1z8sLklTg&s"
              }
              className="w-full mx-auto"
              alt="Member"
            />
          </div>
          <div className="w-2/3 mt-5 text-xl p-5">
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Name: {member?.name || "N/A"}
            </div>
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Mobile: {member?.mobileNo || "N/A"}
            </div>
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Address: {member?.address || "N/A"}
            </div>

            <div className="mt-1 mb-2 text-2xl font-semibold">
              Joined Date: {member?.createdAt ? member.createdAt.slice(0, 10).split('-').reverse().join('-') : "N/A"}
            </div>
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Next Bill Date: {member?.nextBillDate ? member.nextBillDate.slice(0, 10).split('-').reverse().join('-') : "N/A"}
            </div>

            <div className="mt-1 mb-2 flex gap-4 text-2xl font-semibold">
              Status:
              <Switch
                onColor="#6366F1"
                checked={status === "Active"}
                onChange={handleSwitchBtn}
              />
            </div>

            {isDateInPast(data?.nextBillDate) && <div
              onClick={() => {
                if (status === "Active") {
                  setRenew((prev) => !prev);
                } else {
                  toast.error("Cannot renew while status is not Active!");
                }
              }}
              className={`mt-1 rounded-lg p-3 border-2 border-slate-900 text-center ${status === "Active"
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } w-full md:w-1/2 cursor-pointer hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
            >
              Renew
            </div>}
            {
              renew && status === "Active" ? (
                <div className='rounded-lg p-3 mt-5  mb-5 h-fit bg-slate-50 md:w-[100%]'>
                  <div className=" w-full ">
                    <div className="my-5" >
                      <div >Membership</div>
                      <select value={planMember}  onChange={ handleOnChangeSelect } className="border-2 w-full p-2 rounded-lg">
                        {membership.map((item, index) => (
                          <option value={item._id} key={index}>{item.months} Months Membership</option>
                        ))}
                      </select>
                      <div className={'mt-3 rounded-lg p-3 border-2 border-slate-900 text-center w-1/2 mx-auto cursor-pointer hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}> Save</div>
                    </div>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MemberDetail;