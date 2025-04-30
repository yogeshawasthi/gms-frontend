import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { ToastContainer, toast } from "react-toastify";

const MemberDetail = () => {
  const [status, setStatus] = useState("Pending");
  const [renew, setRenew] = useState(false);
  const navigate = useNavigate();

  const handleSwitchBtn = () => {
    let newStatus = status === "Active" ? "Pending" : "Active";
    setStatus(newStatus);
    console.log(`Status changed to: ${newStatus}`);
  };

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
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtrnHUFH3hZsJtvAagjwbZrxdx-1z8sLklTg&s"
              }
              className="w-full mx-auto"
              alt="Member"
            />
          </div>
          <div className="w-2/3 mt-5 text-xl p-5">
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Name: Baba Tillu
            </div>
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Mobile: +9779876735747
            </div>
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Address: FurFuri Nagari
            </div>

            <div className="mt-1 mb-2 text-2xl font-semibold">
              Joined Date: 10-11-2025
            </div>
            <div className="mt-1 mb-2 text-2xl font-semibold">
              Next Bill Date: 10-11-2025
            </div>

            <div className="mt-1 mb-2 flex gap-4 text-2xl font-semibold">
              Status:
              <Switch
                onColor="#6366F1"
                checked={status === "Active"}
                onChange={handleSwitchBtn}
              />
            </div>

            <div
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
            </div>
            {
              renew && status === "Active" ? (
                <div className='rounded-lg p-3 mt-5  mb-5 h-fit bg-slate-50 md:w-[100%]'>
                  <div className=" w-full ">
                    <div className="my-5" >
                      <div >Membership</div>
                      <select className="border-2   w-full p-2 rounded-lg">
                        <option >1 Month Membership </option>
                        <option > 2 Month Membership</option>
                        <option >3 Month Membership </option>
                        <option> Membership </option>
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