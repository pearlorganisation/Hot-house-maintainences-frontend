"use client";


import { userLogout } from "@/app/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";


const OTPReceiver = () => {
  // ----------------------------------------hooks----------------------------------------
  const { userData } = useSelector(
    (state) => state?.auth
  );
  const email = userData?.email;
  const id = userData?._id;

  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [response, setResponse] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow digits
      setOtp(value);
      setError(""); // Clear error when input is valid
    } else {
      setError("OTP must be a number.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits long.");
    } else {
      // Handle OTP submission logic here
      try {
        setIsLoading(true)
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/verifyOtpForDeleteAccount`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              id,
              otp,
            }),
          }
        );
        const newData = await data.json();
        setResponse(newData)
        if (newData.status === true) {
         
          dispatch(userLogout());
          router.push("/login");
          toast.success("Account deleted successfully");
          
        }else{
          toast.error(`${newData?.message}`)
        }
        
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.log(error);
      }

      setError(""); // Clear error when submitting
    }
  };

  return (
    <div className="flex items-center justify-center  px-4 pt-10 pb-20  mx-auto ">
    
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
  
        <h2 className="text-2xl font-bold text-red-800 text-center 00 mb-4">
          Enter OTP
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please enter the OTP sent to your email or phone.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent text-center text-xl tracking-widest"
              placeholder="------"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            {isLoading ? <ClipLoader color=""/>: "Verify OTP " } 
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Didn't receive the code?</p>
          <button className="hover:underline mt-2 text-red-800 hover:text-red-700" >Resend OTP</button>
        </div>
      </div>
    </div>
  );
};

export default OTPReceiver;
