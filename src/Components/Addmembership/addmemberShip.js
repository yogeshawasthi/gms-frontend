import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

const AddmemberShip = ({ handleClose }) => {

    const [inputField, setInputField] = useState({ months: "", price: "" });
    const [membership, setMembership] = useState([]);


    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value })
    }
    console.log(inputField)

    const fetchMembership = async () => {
        await axios.get("http://localhost:4000/plans/getMembership", {
            params: inputField,
            withCredentials: true
        }).then((res) => {
            setMembership(res.data.membership); 
            toast.success(res.data.membership.length + " Memberships Fetched", {
              toastId: "membership-fetch-success"
            });
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
            toast.error("Error fetching membership details");
        });
    }

    useEffect(() => {
        fetchMembership()
    }, [])

    const handleAddmembership = async () => {
        try {
            const response = await axios.post('http://localhost:4000/plans/add-membership', inputField, { withCredentials: true });
            toast.success(response.data.message)
            // handleClose();
            fetchMembership(); // Refresh the list
        } catch (err) {
            console.log(err);
            toast.error("Something wrong Happen");
        }
    }

    return (
        <div className='text-black'>
            <div className='flex flex-wrap gap-5 items-center justify-center'>
                {
                    membership.map((item, index) => {
                        return (
                            <div key={item._id} className='relative flex items-start'>
                                {/* Cross icon absolutely positioned outside the card */}
                                <span
                                    className="absolute -top-3 -right-3 z-20 cursor-pointer text-red-500 hover:text-red-700 bg-white rounded-full shadow"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (window.confirm("Are you sure you want to delete this membership?")) {
                                            try {
                                                await axios.delete(`http://localhost:4000/plans/delete-membership/${item._id}`, { withCredentials: true });
                                                toast.success("Membership deleted!");
                                                fetchMembership();
                                            } catch (err) {
                                                toast.error("Failed to delete membership");
                                            }
                                        }
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </span>
                                <div className='text-lg bg-slate-900 text-white border-2 pl-2 pr-2 flex-col gap-3 justify-between cursor-pointer pt-1 pb-1 rounded-xl font-semibold hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-w-[180px]'>
                                    <div>{item.months} months Membership</div>
                                    <div>RS {item.price}</div>
                                </div>
                            </div>
                        )
                    })
                }



            </div>

            <hr className='mt-10 mb-10' />
            <div className='flex gap-10 mb-10'>

                <input value={inputField.months} onChange={(event) => handleOnChange(event, "months")} className='border-2 rounded-lg text-lg w-1/3 h-1/2 p-2' type='number' placeholder="Add No. of Months" />

                <input value={inputField.price} onChange={(event) => handleOnChange(event, "price")} className='border-2 rounded-lg text-lg w-1/3 h-1/2 p-2' type='number' placeholder="Add Price" />

                <div onClick={() => { handleAddmembership() }} className='text-lg border-2 p-1 w-auto mt-0 rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'> Add +</div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default AddmemberShip