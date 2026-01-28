"use client";
import { addUserData } from "@/app/lib/features/auth/authSlice";
import { useAppSelector } from "@/app/lib/hooks";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
// import { ClipLoader } from "react-spinners";


const UpdateProfile = () => {
  const { userData, isUserLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      mobileNumber: userData?.mobileNumber,
    },
  });

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/updateProfile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userData?._id,
            firstName: data?.firstName,
            lastName: data?.lastName,
            mobileNumber: data?.mobileNumber,
          }),
        }
      );
      const responseData = await response.json();
      const updatedData = { isUserLoggedIn: true, data: responseData.data };

      dispatch(addUserData(updatedData));
      console.log(responseData, "response");
      toast.success("User profile updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error during signup:", error.message);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    updateProfile(data);
  };
  return (
    <main className="w-full md:w-3/4 bg-white p-8 rounded-md shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label htmlFor="first-name" className="block font-medium">
              First Name *
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("firstName", { required: true })}
                id="first-name"
                className="w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Enter Your First Name"
              />
              {errors.firstName && <span className="text-red-500">This field is required</span>}
              {/* <CheckIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-800" /> */}
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="last-name" className="block font-medium">
              Last Name *
            </label>
            <div className="relative">
              <input
                {...register("lastName", { required: true })}
                type="text"
                id="last-name"
                className="w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Enter Your Last Name"
              />
              {errors.lastName && <span className="text-red-500">This field is required</span>}
              {/* <CheckIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-800" /> */}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="mobile" className="block font-medium">
            Mobile *
          </label>
          <div className="relative">
            <input
              type="Number"
              {...register("mobileNumber", { required: true })}
              id="mobile"
              className="w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              placeholder="Enter Mobile Number"
            />
            {errors.mobileNumber && <span className="text-red-500">This field is required</span>}
            {/* <CheckIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-800" /> */}
          </div>
        </div>

        {/* <div className="flex items-start space-x-2">
          <input type="checkbox" id="offers" className=" accent-red-800" />
          <label htmlFor="offers" className="text-sm font-medium leading-none">
            Please send me exclusive deals and amazing pizza offers via email
          </label>
        </div> */}
        <p className="text-sm text-gray-600">
          Hot House Pizza's does not sell, trade or rent your personal information to
          others. Any data collected will be used solely for the purpose of
          providing the services you request, communicating information about
          our brands, products and services and internal analysis.
        </p>
        <button
          type="submit"
          className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-700"
        >
          {loading ? <div>Loading...</div> : "Save & continue"}
        </button>
      </form>
    </main>
  );
};

export default UpdateProfile;
