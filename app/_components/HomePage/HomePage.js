"use client";

import React, { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import DealsCards from "../Pages/DealsCards";
import { useDispatch } from "react-redux";
import { trackerStatus } from "@/app/lib/features/orderDetails/orderDetailsslice";
import Link from "next/link";
import { oAuthLogin } from "@/app/lib/features/auth/authSlice";
import moment from "moment-timezone";

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
async function getBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/banner`)
    const data = await res.json();
    return data.data
  } catch (error) {
    console.log("Error Occurred in banner api", error);
    return null;
  }
}


const HomePage = () => {

  const dispatch = useDispatch()

  const [popularDealData, setPopularDealData] = useState(null);
  const [collectionOnlyDealData, setCollectionOnlyDealData] = useState(null);
  const [banner, setBanner] = useState([]);
  const todaysDay = moment()?.tz(moment?.tz?.guess())?.format('dddd');
  const currTime = moment(moment()?.format('HH:mm'), 'HH:mm');
  async function getUserData() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    window.history.replaceState({}, document.title, "/");
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/oAuth/google/userData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include'
        })
        const data = await res.json();
        dispatch(oAuthLogin(data.data))
      } catch (error) {
        console.log("Error Occurred in banner api", error);
        return null;
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getData(false);
      const collectionOnly = await getData(true);
      setPopularDealData(data);
      setCollectionOnlyDealData(collectionOnly);
    }
    async function bannerData() {
      const data = await getBanners();
      setBanner(data)
    }


    dispatch(trackerStatus(false))
    fetchData();
    bannerData()
    getUserData()
  }, []);

  return (
    <>
      <div className="w-full ">
        <Swiper
          autoplay={{
            delay: 8000, // Time between slides in milliseconds (e.g., 3000ms = 3 seconds)
            disableOnInteraction: false, // Continue autoplay after user interactions
          }}
          speed={2000} // Duration of transition in milliseconds
          className="z-55  "
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}

          modules={[Pagination, Autoplay]}
        >
          {banner?.map((el, i) => {
            return (
              <SwiperSlide className="pb-8 " key={i} >
                {el?.deal?._id ? <Link href={{
                  pathname: `menu/deals/deals_view`,
                  query: { card_id: el?.deal?._id, size_id: el?.deal?.sizes[0]?._id },
                }}>
                  <Image
                    width={2500}
                    height={1000}
                    src={el?.banner}
                    alt="Deals Banner"
                    className="h-full mx-auto w-full lg:w-[70%] xl:w-[70%] sm:h-fit md:[30vh] md:h-fit xl:h-[65vh] 2xl:w-[60%] 2xl:h-[70vh]  object-cover rounded-xl" />
                </Link>
                  :
                  <Image width={2500} height={1000} src={el?.banner} alt="Deals Banner" className="rounded-xl h-full mx-auto w-full lg:w-[70%] xl:w-[70%] sm:h-fit md:[30vh] md:h-fit xl:h-[65vh] 2xl:w-[60%] 2xl:h-[70vh]  object-cover" />}

              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <>
        <div className="mx-auto container max-w-7xl px-5 lg:px-10">
          <header class="text-center pb-10  bg-white">
            <div class="flex items-center justify-center my-2">
              <div class="flex-grow border-t border-red-800"></div>

              <div class="flex-grow border-t border-red-800"></div>
            </div>

            <div class="flex items-center justify-center">
              <div class="flex-grow border-t border-red-800"></div>
              <h1 class="px-4 text-red-800 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                TOP HOT DEALS
              </h1>
              <div class="flex-grow border-t border-red-800"></div>
            </div>
          </header>
        </div>

        {popularDealData ? (
          <div className="flex gap-8 mb-10 flex-wrap justify-center">
            {Array.isArray(popularDealData) &&
              popularDealData.map((el) => (
                <DealsCards key={el.id} path={"menu"} data={el} />
              ))}
          </div>
        ) : (
          <div className="flex item-center justify-center pt-[25vh] h-[85vh] ">
            {/* <ClockLoader color="#991b1b" size={100} className="border"/> */}
            <Image src="/HOTPIZZALOGO.jpg" alt="Pizza Logo" width={300} height={300} className="h-[10vh] w-[30vw]  object-contain" />
          </div>
        )}

        {Array.isArray(collectionOnlyDealData) && collectionOnlyDealData.length > 0 &&
          <>
            <div className="mx-auto container max-w-7xl px-5 lg:px-10">
              <header class="text-center pb-10  bg-white">
                <div class="flex items-center justify-center my-2">
                  <div class="flex-grow border-t border-red-800"></div>

                  <div class="flex-grow border-t border-red-800"></div>
                </div>

                <div class="flex items-center justify-center">
                  <div class="flex-grow border-t border-red-800"></div>
                  <h2 class="px-4 text-red-800 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    COLLECTION ONLY DEALS
                  </h2>
                  <div class="flex-grow border-t border-red-800"></div>
                </div>
              </header>
            </div>

            <div className="flex gap-8 mb-10 flex-wrap justify-center">
              {collectionOnlyDealData.map((el) => {
                if (el?.isByOneGetPizza &&
                  el.availabilityOfDeal.length > 0 &&
                  el.availabilityOfDeal.find((day) => day === todaysDay?.toUpperCase())
                ) {
                  return null; // Return null instead of undefined
                } else if (el?.isByOneGetPizza && el?.isByOneGetPizzaStartTime && el?.isByOneGetPizzaEndTime) {
                  const startTime = moment(el?.isByOneGetPizzaStartTime, "HH:mm");
                  const endTime = moment(el?.isByOneGetPizzaEndTime, "HH:mm");

                  console.log(currTime, startTime, endTime)

                  if ((currTime.isAfter(startTime)) && (currTime.isBefore(endTime))) {
                    return <DealsCards key={el?._id} path="/menu" data={el} />; // Exclude if outside the time range
                  }
                  else
                    return null
                } else
                  return <DealsCards key={el?._id} path="/menu" data={el} />;
              })}
            </div>;

          </>
        }

      </>
    </>
  );
};

export default HomePage;
