import React, { useState } from "react";
import useSWR from "swr";
import DipsCard from "./DipsCard/DipsCard.jsx";
import { ClockLoader } from "react-spinners";
import Image from "next/image";

const Dips = () => {

  // Data fetching function
  const dipsfetcher = async (...args) =>
    fetch(...args).then((res) => {
      return res.json();
    });

  // Data fetching using useSWR
  const {
    data: dipsData,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/dips`, dipsfetcher);

  if (error) return <div className="h-screen text-red-800 text-center text-3xl md:text-5xl font-bold">Sorry , Failed to load ... </div>;
  if (isLoading) return <div className="flex justify-center pt-[25vh] h-[85vh] ">
    {/* <ClockLoader color="#991b1b" size={100}/> */}
    <Image src="/HOTPIZZALOGO.jpg" alt="Pizza Logo"  width={300} height={300} className="h-[10vh] w-[30vw]  object-contain" />
    </div>;

  return (
    <>
      <div className="flex items-center justify-center px-10 pb-2">
                      <div className={`flex-grow border-t border-yellow-600 `}></div>
                      <h1 className={`px-4 text-yellow-600 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl`}>
                      DIPS
                    </h1>
                    <div className={`flex-grow border-t border-yellow-600`}></div>
                  </div>
      <div className="container mx-auto max-w-7xl gap-12 grid sm:grid-cols-2 md:grid-cols-4 place-content-center p-4">
        {dipsData?.data.map((item, idx) => (
          <DipsCard data={item} idx={idx} />
        ))}
      </div>

    </>
  );
};

export default Dips;
