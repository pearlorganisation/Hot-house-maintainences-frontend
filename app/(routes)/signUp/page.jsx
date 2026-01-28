"use client";
import { getcredentials, guestLogin } from "@/app/lib/features/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const Page = () => {
  // -------------------------------------hooks---------------------------------
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [response, setResponse] = useState(null);
  const dispatch = useDispatch();
  const {isGuestLoggedIn,isUserLoggedIn}= useSelector((state)=>state.auth)
  const router = useRouter();
const [isLoading,setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) || "Please enter a valid email address";
  };

  const onSubmit = async (data) => {
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
            email: data?.email,
            password: data?.password,
            firstName: data?.firstName,
            lastName: data?.lastName,
            mobileNumber:data?.mobileNumber
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
      setResponse(newData);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      if (newData.success === true) {
        router.push("/otp");
           toast.success("Otp Sent Successfully");
      }

      const result = await response.json();
      setIsLoading(false)
      // Add your logic for a successful signup
    } catch (error) {
      setIsLoading(false)
      console.error("Error during signup:", error.message);
      // Handle error (e.g., show an error message to the user)
    }
  };

  useEffect(()=>{
    if(isUserLoggedIn || isGuestLoggedIn){
      router.push("/");
    }
      },[isGuestLoggedIn])

  return (
    <>
      <div className=" flex items-center justify-center pb-14 ">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-xl text-green-900 font-bold mb-6 text-center">
            New member ? Register here.
          </h2>
       
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="register-email">
                First Name
              </label>
              <input
                type="text"
                id="register-email"
                className={`w-full px-3 py-2 border ${
                  errors.firstName ? "border-red-800" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Enter your First Name"
                {...register("firstName", {
                  required: true,
                })}
              />
              {errors.firstName && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.firstName && "First Name is required"}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="register-email">
                Last Name
              </label>
              <input
                type="text"
                id="register-email"
                className={`w-full px-3 py-2 border ${
                  errors.lastName ? "border-red-800" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Enter your Last Name"
                {...register("lastName", {
                  required: true,
                })}
              />
              {errors.lastName && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.lastName && "Last Name is required"}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="register-email">
                Mobile Number
              </label>
              <input
                type="Number"
                id="register-email"
                className={`w-full px-3 py-2 border ${
                  errors.mobileNumber ? "border-red-800" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Enter your mobile number"
                {...register("mobileNumber", {
                  required: true,
                })}
              />
              {errors.mobileNumber && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.mobileNumber && "Mobile number is required"}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="register-email">
                Email Address
              </label>
              <input
                type="email"
                id="register-email"
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-800" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  validate: validateEmail,
                })}
              />
              {errors.email && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700"
                htmlFor="register-password"
              >
                Password
              </label>
              <input
                type="password"
                id="register-password"
                className={`w-full px-3 py-2 border ${
                  errors.password ? "border-red-800" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must have at least six characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-800 text-sm mt-5 ">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className={`w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-800" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Re-enter your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "The passwords does not match",
                })}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer pt-5 text-red-800 hover:text-red-700"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEye /> :  <FaEyeSlash />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
              />
              <label htmlFor="terms" className="text-gray-700">
                I accept the Hot House Pizza{" "}
                <a href="/termsAndConditions" className="text-red-800 hover:text-red-700 underline">
                  Terms & Conditions.
                </a>{" "}
                
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-800 text-sm mb-1">
                {errors.terms.message}
              </p>
            )}
            <button
              type="submit" disabled={isLoading}
              className="w-full bg-green-700  text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
             {isLoading ? <ClipLoader color=""/>: "Register" } 
             
            </button>
            {response && response?.success == false ? (
            <div className="p-2 text-center text-red-600 font-semibold">
              {response?.message} !
             
            </div>
          ) : (
            ""
          )}
            <p className="mt-4">
              Already have an account?{" "}
              <span>
                <Link href="/login" className="text-red-800 hover:text-red-700 font-semibold">
                  Login here.
                </Link>
              </span>
            </p>
          </form>
          <div class="flex items-center justify-center">
          <div class="flex-grow border-t border-green-800"></div>
            <div className="text-center font-semibold text-green-800  m-3">OR</div>
          <div class="flex-grow border-t border-green-800"></div>
            </div>
            <Link
             href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/oAuth/google`}
              className="w-full my-4 flex justify-center items-center gap-3  text-black shadow-md border-gray-50 border-t px-4 py-3 rounded-md hover:text-gray-800"
            >
             <FcGoogle size={27}/> Continue With Google
            </Link>
            {/* <button
             onClick={()=>dispatch(guestLogin())}
              className="w-full flex justify-center items-center gap-3 bg-black text-white px-4 py-3 rounded-md hover:bg-gray-800"
            >
             <FaUser size={23}/> Continue as Guest
            </button> */}
        </div>
      </div>
    </>
  );
};

export default Page;
