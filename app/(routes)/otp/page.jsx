"use client";
import { addUserData, getcredentials } from "@/app/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";



const OTPReceiver = () => {
  // ----------------------------------------hooks----------------------------------------
  const { email, password, firstName, lastName,mobileNumber } = useSelector(
    (state) => state.auth
  );
  const [isLoading,setIsLoading] = useState(false)  
  const router = useRouter()
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const dispatch = useDispatch();



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

  const handleResendOtp = async() =>{
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            mobileNumber:mobileNumber
          }),
        }
      );
      const newData = await response.json();
      dispatch(
        getcredentials({
          email: data?.email,
          password: data?.password,
          firstName: data?.firstName,
          lastName: data?.lastName,
          mobileNumber: data?.mobileNumber
        })
      );
      console.log("asdsad")
      setResponse(newData);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      if (newData.success === true) {
        toast.success("Otp sent again successfully");
        router.push("/otp");
      }
      
      const result = await response.json();
      setIsLoading(false)
      // console.error("Error during signup:", error.message);
      // Add your logic for a successful signup
    } catch (error) {
      setIsLoading(false)
      // Handle error (e.g., show an error message to the user)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits long.");
    } else {
      // Handle OTP submission logic here
      try {
        setIsLoading(true)
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/verifyOtp`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              firstName,
              lastName,
              otp,
              mobileNumber,
            }),
          }
        );
        const newData = await data.json();
        console.log(newData, "newData")

        if (newData.status === true) {
          // dispatch(getcredentials({ email: "", password: "" }));
          // toast.success(`${newData?.message.toUpperCase()}`)
          // router.push("/login");

          try {
            setIsLoading(true)
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/login`,
              {
                method: "POST",
                body: JSON.stringify({
                  email,
                  password
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
                credentials: "include",
              }
            );
            const newData = await res.json();
            console.log(newData);
            if (newData?.status === true) {
              const userData = { isUserLoggedIn: true, data: newData.data };
      
              dispatch(addUserData(userData));
      
              router.push("/");
              toast.success("Account created & Login successfully");
            }else{
              toast.error(`${newData?.message}`)
            }
      
            setIsLoading(false)
            setResponse(newData);
          } catch (error) {
            setIsLoading(false)
            console.log(error);
          }
        }else{
          toast.error(`${newData?.message.toUpperCase()}`)
        }
        setResponse(newData);
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
   
        <h2 className="text-2xl font-bold text-center text-red-800 mb-4">
          Enter OTP 
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please enter the OTP sent to your email.
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
            {isLoading ? <ClipLoader color=""/>: "Verify OTP" } 
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Didn't receive the code?</p>
          <button onClick={handleResendOtp} className="hover:underline mt-2 text-red-800 hover:text-red-700">Resend OTP</button>
        </div>
      </div>
    </div>
  );
};

export default OTPReceiver;