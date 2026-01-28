"use client";
import { setForgetPasswordEmail } from "@/app/lib/features/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";


const Page = () => {
  const [response, setResponse] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading,setIsLoading] = useState(false)
  const { forgetPasswordEmail: email } = useSelector((state) => state?.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch, // To watch the confirm password field
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    // Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/newPassword`,
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            newPassword: data.newPassword,
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
        toast.success("Password Changed successfully");
        dispatch(setForgetPasswordEmail(false));
        router.push("/login");
        console.log("Redirecting to login");
      } else {
        toast.error("Failed to change password. Please try again.");
      }
      setResponse(newData);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center  px-4 pt-10 pb-20  mx-auto ">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl text-red-800 font-bold mb-6 text-center">
            Enter New Password
          </h2>
          {response && response.status === false && (
            <div className="p-2 text-center text-red-600 font-semibold">
              {response.message}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                className={`w-full px-3 py-2 border ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Enter your new password"
                {...register("newPassword", {
                  required: "Password is required",
                })}
              />
              {errors.newPassword && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                className={`w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring focus:ring-slate-300`}
                placeholder="Confirm your new password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full text-white bg-red-800 hover:bg-red-700 focus:ring-4 outline-none focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                {isLoading ? <ClipLoader color=""/>: "Reset password" } 
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
