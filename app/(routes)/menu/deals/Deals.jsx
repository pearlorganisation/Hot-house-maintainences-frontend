"use client";
import DealsCards from "@/app/_components/Pages/DealsCards";
import Image from "next/image";
import moment from "moment-timezone";
import React, { useState, useEffect} from "react";


async function getData(boolean) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/deals?collectionOnly=${boolean}`);
    const data = await res.json();
    return data.data; // Assuming `data` has a `data` property containing the actual deals
  } catch (err) {
    console.log("Error Occurred", err);
    return null;
  }
}

const Deals = () => {
 
  const [dealData, setDealData] = useState(null);
  const [collectionOnlyDealData, setCollectionOnlyDealData] = useState(null);
  const todaysDay = moment()?.tz(moment?.tz?.guess())?.format('dddd');
  const currTime = moment(moment()?.format('HH:mm'), 'HH:mm');

  useEffect(() => {
    async function fetchData() {
      const data = await getData(false);
      const collectionOnly = await getData(true);
      setDealData(data);
      setCollectionOnlyDealData(collectionOnly);
  
      setDealData(data);
    }
    fetchData();
  }, []);

  if (!dealData)
    return (
      <div className="flex justify-center pt-[25vh] h-[85vh] ">
        <Image src="/HOTPIZZALOGO.jpg" alt="Pizza Logo"  width={300} height={300} className="h-[10vh] w-[30vw]  object-contain" />
      </div>
    );

  return (
    <>
      <div className=" mx-auto container pb-10">
      
        <div className=" px-6 pt-5 ">
          <header class="text-center  bg-white">
            <div className="flex justify-between   gap-2  items-center ">

          </div>
            <div className="flex items-center justify-center mb-2">
              <div className="flex-grow border-t border-red-800"></div>
              <h1 className="px-4  text-red-800 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                TOP HOT DEALS
              </h1>
              <div className="flex-grow border-t border-red-800"></div>
            </div>
          </header>
        </div>

        <div className="p-8 gap-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  place-content-center">
          {Array.isArray(dealData) &&
            dealData.map((el, index) => <DealsCards data={el} key={index} />)}
        </div>


        <div className=" px-6 pt-5 ">
          <header class="text-center  bg-white">
            <div className="flex justify-between   gap-2  items-center ">

          </div>
            <div className="flex items-center justify-center mb-2">
              <div className="flex-grow border-t border-red-800"></div>
              <h2 className="px-4  text-red-800 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
              COLLECTION ONLY DEALS
              </h2>
              <div className="flex-grow border-t border-red-800"></div>
            </div>
          </header>
        </div>

{Array.isArray(collectionOnlyDealData) && collectionOnlyDealData.length>0 ? 
      
      <div className="flex gap-8 m-10 flex-wrap justify-center">
        {collectionOnlyDealData.map((el) => {
    if (el?.isByOneGetPizza &&
      el.availabilityOfDeal.length > 0 &&
      el.availabilityOfDeal.find((day) => day === todaysDay?.toUpperCase())
    ) {
      return null; // Return null instead of undefined
    } else if (el?.isByOneGetPizza && el?.isByOneGetPizzaStartTime && el?.isByOneGetPizzaEndTime) {
      const startTime = moment(el?.isByOneGetPizzaStartTime, "HH:mm");
      const endTime = moment(el?.isByOneGetPizzaEndTime, "HH:mm");

      console.log(currTime,startTime,endTime)

      if ((currTime.isAfter(startTime)) && (currTime.isBefore(endTime))) {
        return <DealsCards key={el?._id} path="/menu" data={el} />; // Exclude if outside the time range
      }
      else 
       return null
    }else
       return <DealsCards key={el?._id} path="/menu" data={el} />;
  })}
      </div>
    : 
 
   ( <div className="text-lg text-red-800 font-semibold">No Collection Only Deals Right Now ... </div>)

    }

      </div>
    </>
  );
};

export default Deals;
