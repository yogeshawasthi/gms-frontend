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
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plans/getMembership`, {
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
        if (!inputField.months && !inputField.price) {
            toast.error("Please enter both Months and Price");
            return;
        }
        if (!inputField.months) {
            toast.error("Months field is required");
            return;
        }
        if (!inputField.price) {
            toast.error("Price field is required");
            return;
        }
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/plans/add-membership`, inputField, { withCredentials: true });
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
            <div className='flex flex-wrap gap-6 items-start justify-center mb-8'>
                {
                    membership.map((item, index) => (
                        <div key={item._id} className='relative'>
                            <span
                                className="absolute -top-3 -right-3 z-20 cursor-pointer text-red-500 hover:text-red-700 bg-white rounded-full shadow"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (window.confirm("Are you sure you want to delete this plan?")) {
                                        try {
                                            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/plans/delete-membership/${item._id}`, { withCredentials: true });
                                            toast.success("Plan deleted!");
                                            fetchMembership();
                                        } catch (err) {
                                            toast.error("Failed to delete plan");
                                        }
                                    }
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </span>
                            <div className='text-base bg-slate-900 text-white border-2 px-4 py-2 flex flex-col gap-1 justify-between cursor-pointer rounded-xl font-semibold hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-w-[120px] max-w-[150px] items-center'>
                                <div>{item.months} Month Plan</div>
                                <div>Rs. {item.price}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <hr className='mt-10 mb-10' />
            <div className='flex flex-wrap gap-6 mb-10 items-center justify-center'>
                <div className='flex flex-col items-start'>
                    <label className='text-lg font-semibold mb-2'>No. of Months</label>
                    <input
                        value={inputField.months}
                        onChange={(event) => handleOnChange(event, "months")}
                        className='border-2 rounded-lg text-lg w-32 h-10 p-2'
                        type='number'
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Add No."
                    />
                </div>
                <div className='flex flex-col items-start'>
                    <label className='text-lg font-semibold mb-2'>Price</label>
                    <input
                        value={inputField.price}
                        onChange={(event) => handleOnChange(event, "price")}
                        className='border-2 rounded-lg text-lg w-32 h-10 p-2'
                        type='number'
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Add P"
                    />
                </div>
                <div
                    onClick={() => { handleAddmembership() }}
                    className='flex items-center justify-center text-lg border-2 px-6 py-2 rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-semibold'
                    style={{ height: '56px', marginTop: '24px' }}
                >
                    Add +
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default AddmemberShip