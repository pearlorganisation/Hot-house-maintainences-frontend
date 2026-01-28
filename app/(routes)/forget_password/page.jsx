'use client';


import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { setForgetPasswordEmail } from '@/app/lib/features/auth/authSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';


const Page = () => {

    const { handleSubmit, register, formState: { errors } } = useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const [error,setError] = useState('');
    const [response,setResponse] = useState(''); 
    const [isLoading,setIsLoading] = useState(false)
    async function sendData(email)
    {
     //endpoint forget passowrd    
   try {
    setIsLoading(true)
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/forgetPassword`,
      {
        method: "POST", 
        body: JSON.stringify({
          email: email,
          
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );
    
    const res = await data.json();
    setResponse(res);
    console.log(res);

    
    if(res?.status === true)
        {

            
            dispatch(setForgetPasswordEmail(email));
            toast.success("Otp Sent Successfully");
            router.push("/otp_for_forgetPassword");
            console.log("Redirecting to otp_for_forgetPassword");



            
        }
        else{
          toast.error("Email Not Found");
        }
        setIsLoading(false)
  } catch (error) {
    setIsLoading(false)
    console.log(error);
    
  }
    }



    const onSubmit = (data) => {
        if (data.newsletter) {
            console.log(data.email); 
         
            sendData(data?.email);
            


        





        } else {
            console.log("Please accept the Terms and Conditions.");
        }
    }

    return (
      <>
        <section className=" ">
            <div className="flex flex-col  items-center justify-center px-4 pt-10 pb-20  mx-auto ">
             
                <div className="w-full p-6 bg-white rounded-lg shadow    md:mt-0 sm:max-w-md sm:p-8">
                    <h2 className="mb-1 text-center  text-xl font-bold leading-tight tracking-tight text-red-800 md:text-2xl ">
                        Forgot Password
                    </h2>
       
                    <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-800 ">Your email</label>
                            <input type="email" {...register('email', { required: true })} className=" bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-2 outline-none focus:ring-slate-300 block w-full p-2.5 " placeholder="name@company.com" required/>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="newsletter" aria-describedby="newsletter" type="checkbox" {...register('newsletter', { required: true })} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "/>
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="newsletter" className="font-light text-gray-500 ">I accept the <a className="font-medium text-red-800 hover:underline hover:text-red-700" href="/termsAndConditions">Terms and Conditions</a></label>
                            </div>
                        </div>
                        {(errors.newsletter)  && <p className="text-red-500 text-sm mt-1">Please accept the terms and conditions.</p>}
                       
                        
                        <button type="submit" disabled={isLoading} className="w-full text-white bg-red-800 hover:bg-red-700 focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">{isLoading ? <ClipLoader color=""/>: "Reset password" } </button>
                    </form>
                </div>
            </div>
        </section>
      </>
      
    )
}

export default Page;
