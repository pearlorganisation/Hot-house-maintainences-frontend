"use client";
import { useRouter } from 'next/navigation';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';

const DeleteAccountModal = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [response ,setResponse] = useState(null);
    useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false)
    }));
     
    const [isLoading,setIsLoading] = useState(false)


    const { userData } = useSelector((state) => state?.auth);

    const router = useRouter();
    const dispatch = useDispatch();
  
    const deleteAccount = async (data) => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/deleteAccount`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userData?.email,
            id: userData._id,
            }),
          }
        );
        const newData = await response.json();
        setResponse(newData);
        console.log(newData);
        if (newData?.success === true) {
        //   dispatch(addNewPassword(data.newPassword));
          router.push("/account_deletion_otp");
          toast.success("Otp sent successfully");
        }else{
            toast.error(`${newData?.message}`)
          }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error("Error during signup:", error.message);
        // Handle error (e.g., show an error message to the user)
      }
    };



    return (
        isOpen && (
            <div id="popup-modal" tabindex="-1" className="fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow ">
                        <button
                            type="button"
                            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                            onClick={() => setIsOpen(false)}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only" onClick={() => setIsOpen(false)}>Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg
                                className="mx-auto mb-4 text-red-800 w-12 h-12"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                                Are you sure you want to delete this account ?
                            </h3>
                      <div className='flex justify-center'>
                            <button
                                type="button"
                                className="text-white bg-red-800 hover:bg-red-700 font-medium rounded-lg text-sm flex items-center px-5 py-2.5 text-center "
                                onClick={deleteAccount}
                            >
                                  {isLoading ? <ClipLoader color="white" size={24}/>: "Yes, I'm sure" } 
                            </button>
                            <button
                                type="button"
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-red-800 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-red-600 focus:z-10 focus:ring-4 focus:ring-gray-100 "
                                onClick={() => setIsOpen(false)}
                            >
                                No, cancel
                            </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
});

export default DeleteAccountModal;
