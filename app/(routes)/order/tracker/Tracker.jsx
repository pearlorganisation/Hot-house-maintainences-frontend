"use client"

import { emptyCart } from "@/app/lib/features/cartSlice/cartSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const Tracker = () => {

  const dispatch = useDispatch()
  const router = useRouter()

  const {trackerStatus} = useSelector((state)=>state.orderDetails)
  
  useEffect(() => {
    // Push a new state to the history stack
    window.history.pushState(null, document.title, window.location.href);
    // Add a popstate event listener to prevent navigating back
    const handlePopState = (event) => {
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(()=>{
    // dispatch(successRedirectStatus(null))
    dispatch(emptyCart());
  },[])

    useEffect(() => {
      if (!trackerStatus) {
        router.push("/");
      }
    }, []);

  return (
    <section className=" py-4 md:py-0 md:pb-10 rounded-2xl">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h1 className=" font-bold text-xl text-center text-green-800">
          THANKS , YOUR ORDER IS BEING DEALT WITH BY HOT HOUSE 
        </h1>

        <div
          className="border-2 w-[80vw] lg:w-[60vw] h-full p-6 rounded-2xl "
          style={{ boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        >


          <h1 className="mx-1 my-5 text-center font-semibold text-red-800">
            {" "}
            PIZZA DELIVERY AND TAKEAWAY DEALS IN HOTHOUSE{" "}
          </h1>

          <div className="grid md:grid-cols-2 justify-center gap-4">
            <div className="flex flex-col lg:justify-self-start justif  gap-1">
              <div className="flex gap-2 border-y-[1px] border-slate-100 bg-slate-400/30 px-3 py-2 ">
                <p>Monday </p>
                <p>11:30,01:00</p>
              </div>

              <div className="flex gap-2 px-3 py-2">
                <p>Tuesday </p>
                <p>11:30, 01:00</p>
              </div>
              <div className="flex gap-2 border-y-[1px] border-slate-100 bg-slate-400/30 px-3 py-2  ">
                <p>Wednesday </p>
                <p>11:30, 01:00</p>
              </div>
              <div className="flex gap-2 px-3 py-2">
                <p>Thursday </p>
                <p>11:30, 01:00</p>
              </div>

              <div className="flex gap-2 border-y-[1px] border-slate-100 bg-slate-400/30 px-3 py-2  ">
                <p>Friday </p>
                <p>11:30, 01:00</p>
              </div>
              <div className="flex gap-2 px-3 py-2">
                <p>Saturday </p>
                <p>11:30, 01:00</p>
              </div>
              <div className="flex gap-2 border-y-[1px] border-slate-100 bg-slate-400/30 px-3 py-2 ">
                <p>Sunday </p>
                <p>11:30, 01:00</p>
              </div>
            </div>

            <div className=" text-center md:py-2 lg:justify-self-end items-center md:block flex justify-center">
              <div className=" md:flex-none flex flex-col  justify-center items-center ">

                <p>
                1 Joel St, Pinner, Northwood HA6 1LW, UK
<br/>
Hothousenorthwood@gmail.com</p>
                <p className=" flex items-center gap-3">
                  <BsFillTelephoneOutboundFill /> <p>01923510520</p>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tracker;
