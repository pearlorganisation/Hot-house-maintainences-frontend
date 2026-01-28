"use client";

import { addOrderTime, clearOrderDetails, updateDefaultTimeSelected } from "@/app/lib/features/orderDetails/orderDetailsslice";

// import { PhoneIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckoutComponent } from "./CheckoutComponent";




const Collections = ({ step }) => {
  // const router = useRouter();
  const dispatch = useDispatch();
  // const [addressData, setAddressData] = useState(null);
  // const { userData } = useSelector((state) => state.auth);
  const [dayTimeIntervals, setDayTimeIntervals] = useState([]);
  const [checkoutComponent, setCheckoutComponent] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { order } = useSelector((state) => state.orderDetails)


  // const onSubmit = async (data) => {
  //   console.log(data);
  //   dispatch(
  //     addOrderDetails({
  //       time: data?.daytime,
  //       orderType: step === 1 ? "collection" : "delivery",
  //     })
  //   );
  //   setCheckoutComponent(true);
  //   // router.push("/order/checkout");
  // };

  const handleDayTimeChange = async (daytime,isDefaultTime) => {
    dispatch(
      addOrderTime({
        time: daytime,
        orderType: "collection",
      })
    );

    dispatch(updateDefaultTimeSelected(isDefaultTime))
  }


  const generateDayTimeIntervals = () => {
    const intervals = [];
    const currentTime = new Date();
    const minCollectionTime = Number(process.env.NEXT_PUBLIC_MIN_COLLECTION_TIME || 20);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const addIntervalsForDay = (date, isToday = false) => {
      const day = daysOfWeek[date.getDay()];
      let start = new Date(date);

      if (isToday) {
        // Start X minutes from now or 11 AM, whichever is later
        start.setMinutes(start.getMinutes() + minCollectionTime);
        console.log(start, 'start time')
        if (start.getHours() < 11) start.setHours(11, 0, 0, 0);
      } else {
        start.setHours(11, 0, 0, 0);
      }

      const end = new Date(date);
      end.setHours(23, 0, 0, 0); // End time is 11 PM

      while (start <= end) {
        intervals.push({ day, time: start.toTimeString().slice(0, 5) });
        start.setMinutes(start.getMinutes() + 15); // Increment by 15 minutes
      }
    };

    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(currentTime.getDate() + i);
      addIntervalsForDay(date, i === 0); // isToday = true for first iteration
    }

    return intervals;
  };


  useEffect(() => {
    const intervals = generateDayTimeIntervals();
    setDayTimeIntervals(intervals);
    dispatch(clearOrderDetails())


    if(intervals){
      handleDayTimeChange(`${intervals[0].day}-${intervals[0].time}`, true)
    }



  }, []);

 


  return (
    <>
      {!checkoutComponent && <form
        // onSubmit={handleSubmit(onSubmit)}
        className=""
      >
        <div className="space-y-2">
         {/* <h1>Time & Day:</h1> */}
          <h1>Choose time (Default time for collection {`${process.env.NEXT_PUBLIC_MIN_COLLECTION_TIME || 20}`} min)</h1>
          <select
            {...register("daytime", { required: true })}
            id="day"
            defaultValue={dayTimeIntervals?.length > 0 && `${dayTimeIntervals[0].day}-${dayTimeIntervals[0].time}`}
            // defaultValue=""
            className="px-4 py-2 border-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            onChange={(e) => {
              handleDayTimeChange(e.target.value, e.target.selectedIndex === 1)
            }}
          >
            <option value="" disabled>
              Select Time & Day
            </option>
            {dayTimeIntervals.map((interval, index) => (
              <option key={index} value={`${interval.day}-${interval.time}`}>
                {interval.day} - {interval.time}
              </option>
            ))}
          </select>
          {!order?.time && (
            <span className="text-red-500">Please select the time & day</span>
          )}
        </div>

        {/* <button
          className="bg-green-700 hover:bg-green-600  py-2 w-full text-white rounded"
          type="submit"
        >
          Proceed To Checkout
        </button> */}
      </form>}

      {/* <div>
        {checkoutComponent && <CheckoutComponent />}
      </div> */}
    </>

  );
};

export default Collections;
