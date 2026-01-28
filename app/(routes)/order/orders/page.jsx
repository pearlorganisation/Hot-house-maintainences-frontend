"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { addOrderTime, successRedirectStatus, trackerStatus, updateOrderTime } from "@/app/lib/features/orderDetails/orderDetailsslice";
import Cart from "../cart/Cart";
import OrderType from "./_steps/OrderType";
import { getSiteSettings } from "@/app/lib/features/siteSettings/siteSettingsActions";

const page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector((state) => state.cart.cartData);
  const unavailableStatus = useSelector(
    (state) => state?.cart?.unavailableStatus
  );
  const order = useSelector((state) => state.orderDetails?.order);
  const defaultTimeSelected = useSelector((state) => state?.orderDetails?.defaultTimeSelected)

  const { miles } = useSelector((state) => state.orderDetails);
  const { popupState } = useSelector((state) => state.popup);
  const { userData, isGuestLoggedIn, isUserLoggedIn } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false)
  const [codData, setCodData] = useState();

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discount, setDiscount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)


  const [isOrderDisabled, setIsOrderDisabled] = useState(true)

  const [mount, setMount] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();







  useEffect(() => {
    dispatch(trackerStatus(false))
    setIsLoading(false)
    dispatch(getSiteSettings())
  }, [])



  useEffect(() => {
    // console.log("unavailableStatus", unavailableStatus)
    setIsOrderDisabled(unavailableStatus || Number(totalPrice) <= 0 || isLoading)
  }, [isLoading, totalPrice, unavailableStatus])


  useEffect(() => {
    setMount(true)
    if (mount && cart?.length < 1) {
      router.push("/");
    }
  }, [mount, cart])


  useEffect(() => {

    const isDealIncluded = cart.some((item) => item.collectionOnlyDeal === false || item.collectionOnlyDeal === true)
    // console.log(isDealIncluded)
    if (order?.orderType === 'collection' &&
      totalPrice > (process.env.NEXT_PUBLIC_MIN_DELIVERY_AMOUNT || 15) &&
      // !isDealIncluded &&
      miles <= (process.env.NEXT_PUBLIC_MAX_DELIVERY_DISTANCE || 5.0)) {
      setDeliveryCharge(0)
    }
    else if (
      order?.orderType === 'delivery' &&
      totalPrice > (process.env.NEXT_PUBLIC_MIN_DELIVERY_AMOUNT || 15) &&
      // isDealIncluded &&
      miles <= (process.env.NEXT_PUBLIC_MAX_DELIVERY_DISTANCE || 5.0)
    ) {
      let deliveryCharges = process.env.NEXT_PUBLIC_DELIVERY_CHARGE ? JSON.parse(process.env.NEXT_PUBLIC_DELIVERY_CHARGE) : [0, 1.99, 2.99, 3.99, 4.99, 5.99]
      // console.log(deliveryCharges, miles)
      setDeliveryCharge(Number(deliveryCharges[Math.ceil(miles)]))
    }

  }, [totalPrice, miles, order])


  useEffect(() => {
    // alert(popupState)
    if (popupState === "COLLECTION") {
      setDeliveryCharge(0)
    }
  }, [popupState])


  useEffect(() => {

    if (cart && order?.orderType === 'collection') {
      console.log('Calculating discount here\n', cart, order?.orderType, "\n======================")
      let discountCal = cart?.reduce((acc, item) => {
        const calDiscount = Number(item?.discount) || 0;
        return acc + calDiscount;
      }, 0);
      setDiscount(discountCal)
    } else {
      setDiscount(0)
    }

    if (cart) {
      const totalPriceCal = cart?.reduce((acc, item) => {
        return acc + Number(item?.totalSum);
      }, 0);

      setTotalPrice(totalPriceCal)
    }


  }, [order, cart])


  const verifyDateTime = (dateTimeStr) => {

    return new Promise((resolve) => {
      const intervals = [];
      const currentTime = new Date();

      const minTimeToOrder = order?.orderType === 'delivery' ? Number(process.env.NEXT_PUBLIC_MIN_DELIVERY_TIME || 35) : Number(process.env.NEXT_PUBLIC_MIN_COLLECTION_TIME || 20);

      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const addIntervalsForDay = (date, isToday = false) => {
        const day = daysOfWeek[date.getDay()];
        let start = new Date(date);

        if (isToday) {
          // Start X minutes from now or 11 AM, whichever is later
          start.setMinutes(start.getMinutes() + minTimeToOrder);
          if (start.getHours() < 11) start.setHours(11, 0, 0, 0);
        } else {
          start.setHours(11, 0, 0, 0);
        }

        const end = new Date(date);
        end.setHours(23, 0, 0, 0); // End time is 11 PM

        while (start <= end && intervals?.length <= 0) {
          intervals.push({ day, time: start.toTimeString().slice(0, 5) });
          start.setMinutes(start.getMinutes() + 15); // Increment by 15 minutes
        }
      };

      for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(currentTime.getDate() + i);
        addIntervalsForDay(date, i === 0); // isToday = true for first iteration
      }

      const processedDateTime = `${intervals[0].day} - ${intervals[0].time}`
      console.log('processed date time', processedDateTime)
      console.log("dateTimeStr", dateTimeStr)
      if (dateTimeStr === processedDateTime) {
        resolve(dateTimeStr)
      }
      resolve(processedDateTime)

    })
  };


  const onSubmit = async (data) => {
    if (!order?.time) {
      toast.error("Please select order Day & Time.")
      return
    }

    if (order?.orderType === 'delivery' && !order?.address) {
      toast.error("Please select an address.")
      return
    }

    let newDateTime;

    if (defaultTimeSelected && order?.time) {
      newDateTime = await verifyDateTime(order?.time)

      if (order?.orderType) {
        dispatch(updateOrderTime(newDateTime))
      }
    }

    let mobileNumber = userData?.mobileNumber || data?.mobileNumber
    mobileNumber = mobileNumber.replace(/\D/g, "")

    if (mobileNumber && !mobileNumber?.startsWith("0")) {
      mobileNumber = "0" + mobileNumber;
    }


    dispatch(trackerStatus(true))
    const newData = {
      orderType: order?.orderType,
      email: userData?.email || null,
      orderBy: userData?._id || null,
      time: newDateTime ? newDateTime : order?.time,
      address: order?.orderType === 'collection' || !isUserLoggedIn ? null : order?.address,
      comment: data?.comment || null,
      totalAmount: {
        total: totalPrice?.toFixed(2),
        deliveryCharge: order?.orderType && order?.orderType === 'collection' ? 0 : deliveryCharge,
        discountPrice: discount || 0
      },
      mobileNumber: mobileNumber,
      paymentMethode: data?.paymentMethode,
      items: cart,
      terms: data?.terms,
      name: userData?.firstName || null,
      guestMetaData: isGuestLoggedIn ? { name: data?.name, email: data?.email, mobile: data?.mobile, address: order?.address } : null

    };

    if (data?.paymentMethode === "Cash on delivery") {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
          }
        );
        const responsejson = await response.json();


        console.log('respoinse json', responsejson)
        // return
        setCodData(responsejson);
        if (responsejson?.status === true) {
          router.push("/order/tracker");
        }
        else {
          toast.error("Something Wrong Happened")
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.log(error);
      }
    }
    else {
      setIsLoading(true)

      try {

        let onlinePrice

        if (order?.orderType === 'collection') {
          onlinePrice = (Number(totalPrice) + 0 - Number(discount || 0)).toFixed(2)
        } else {
          onlinePrice = (Number(totalPrice?.toFixed(2)) + Number(deliveryCharge)).toFixed(2)
        }


        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/create-viva-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            newData: newData,
            amount: onlinePrice * 100,
            customer: {
              email: isGuestLoggedIn ? data?.email : userData?.email,
              fullName: isGuestLoggedIn ? data?.name : `${userData?.firstName} ${userData?.lastName}`,
              phone: isGuestLoggedIn ? data?.mobile : userData?.mobileNumber,
            }
          }),
        });

        const vivaResponse = await response.json();

        // Check if the response is not okay (e.g., 4xx or 5xx status codes)
        if (!response.ok) {
          throw new Error(vivaResponse.message || 'Something went wrong while creating the Viva order');
        }
        const orderCode = vivaResponse.orderCode
        dispatch(successRedirectStatus(orderCode))

        const checkoutUrl = `https://www.vivapayments.com/web/checkout?ref=${orderCode}`;

        setIsLoading(false)

        // const checkoutUrl = `https://demo.vivapayments.com/web/checkout?ref=${orderCode}`;

        // Redirect to Viva Payments checkout page
        window.location.href = checkoutUrl;


      } catch (error) {
        dispatch(successRedirectStatus(null))
        setIsLoading(false)
        toast.error("Error opening the payment checkout page", { position: "top-center" });
      }
    }


  }



  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-red-800 border-b-2 border-red-800 pb-2">
              ORDER SUMMARY
            </h2>
            <div className="border rounded-md min-h-[70vh] max-h-screen overflow-auto">
              <Cart />
            </div>
            <div>
              <h3 className="text-lg font-bold">GOT A VOUCHER?</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Just enter it here"
                  className="border p-2 rounded-md flex-1"
                />

              </div>
            </div>

          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-red-800 border-b-2 border-red-800 pb-2">
              ORDER DETAILS
            </h2>

            {isGuestLoggedIn &&
              <div>
                <h3 className="text-lg font-bold ">PERSONAL DETAILS</h3>
                <div className="flex gap-3 w-full">
                  <div className="w-full"><input
                    {...register("name", { required: isGuestLoggedIn ? true : false })}
                    name="name"
                    className="w-full border p-2 rounded-md"
                    placeholder="Enter name here"
                  /> {errors.name && <p className="text-red-500">Name is required.</p>}
                  </div>
                  <div className="w-full">
                    <input
                      {...register("mobile", { required: isGuestLoggedIn ? true : false })}
                      name="mobile"
                      className="w-full border p-2 rounded-md"
                      placeholder="Enter mobile number here"
                    />{errors.mobile && <p className="text-red-500">Mobile number is required.</p>}
                  </div></div>

                <input
                  {...register("email", { required: isGuestLoggedIn ? true : false })}
                  name="email"
                  className="w-full border p-2 mt-2 rounded-md"
                  placeholder="Enter email address here"
                />
                {errors.email && <p className="text-red-500">Email address is required.</p>}
              </div>}
            {isUserLoggedIn && <div>  <h3 className="text-lg font-bold ">CONTACT NUMBER</h3>
              <div className="w-full">
                <input
                  {...register("mobileNumber", {
                    required: "Mobile number is required.",
                    onChange: (e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                      if (value && !value?.startsWith("0")) {
                        e.target.value = "0" + value;
                      } else {
                        e.target.value = value;
                      }
                    }
                  })}
                  name="mobileNumber"
                  defaultValue={userData?.mobileNumber && !userData?.mobileNumber?.startsWith("0") ? "0" + userData?.mobileNumber : userData?.mobileNumber ?? "0"}
                  className="w-full border p-2 rounded-md"
                  placeholder="Enter mobile number here"
                />{errors.mobileNumber && <p className="text-red-500">Mobile number is required.</p>}
              </div>
            </div>}


            {/* {order?.orderType === 'delivery' && <div>
              <h3 className="text-lg font-bold">YOUR ADDRESS :</h3>
              <p>
                {isGuestLoggedIn ? order?.address : order?.address?.address}


              </p>
            </div>
            } */}

            <div>
              <h3 className="text-lg font-bold">ORDER TIME & TYPE</h3>

              <OrderType />


              {/* <p className=""> Order Type : {order?.orderType === 'collection' ? <span className="font-semibold text-red-800">Collection</span> : <span className="font-semibold text-green-800">Delivery</span>}</p>
              <p>
                Your order is to be placed for {order?.time} ( Please note
                delivery time is around {process.env.NEXT_PUBLIC_MIN_DELIVERY_TIME || 40} minutes )
              </p> */}
            </div>


            <div>
              <h3 className="text-lg font-bold">ANY COMMENTS</h3>
              <textarea
                {...register("comment")}
                name="comment"
                className="w-full border p-2 rounded-md"
                placeholder="Leave comments for your order here"
              />
            </div>


            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">CHOOSE PAYMENT</h3>

                <div className="space-y-1 text-lg grid grid-cols-2">
                  <span><strong>Total:</strong></span>
                  <span>£ {totalPrice?.toFixed(2)}</span>

                  {order?.orderType === 'collection' ? <><span><strong>Discount:</strong></span><span> £ {discount}</span></> : <><span><strong>Discount:</strong> </span> <span> £ 0</span></>}
                  {order?.orderType === 'collection' ? <><span><strong>Delivery Charge:</strong></span><span> £ 0  (No charges for collection)</span></> : <><span><strong>Delivery charge:</strong></span><span>£ {deliveryCharge} {miles > 0 && `(${miles} miles)`} </span></>}

                  <span className="font-bold text-lg ">
                    You pay:
                  </span>
                  <span className="font-bold text-2xl text-green-700">
                    £ {order?.orderType === 'collection' ? (Number(totalPrice) + 0 - discount).toFixed(2) : (Number(totalPrice) + deliveryCharge - 0).toFixed(2)}
                  </span>
                  <hr className="col-span-2" />
                </div>

                <div className="flex items-center space-x-2 !text-lg ">
                  {/* <input
                    type="radio"
                    id="cash"
                    value="Cash on delivery"
                    name="paymentMethode"
                    {...register("paymentMethode")}
                    defaultChecked
                  />
                  <label htmlFor="cash" className="cursor-pointer">{order?.orderType === 'collection' ? "Pay on collection" : "Pay on delivery"}</label> */}
                  <input
                    {...register("paymentMethode")}
                    name="paymentMethode"
                    type="radio"
                    id="card"
                    value="Online Payment"

                  />
                  <label htmlFor="card" className="cursor-pointer">Pay Now</label>

                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input   {...register("terms", { required: true })} type="checkbox" id="terms" />
                <label htmlFor="terms" className="text-[15px] cursor-pointer">
                  I accept the Terms & Conditions and Privacy Policy
                </label>
              </div>
              {errors.terms && <p className="text-red-500">Please accept the terms & conditions.</p>}
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  Edit Order
                </button>
                <button
                  type="submit"
                  disabled={isOrderDisabled}
                  className="px-4 py-2 disabled:bg-gray-600 disabled:hover:bg-gray-600 bg-green-700 hover:bg-green-600  text-white rounded-md flex items-center justify-center"
                >
                  {isLoading ? <ClipLoader color="white" size={22} /> : "Order"}
                </button>
              </div>
            </div>



          </div>

          {/*  totals & checkout */}






        </div>
      </form>
    </div>
  );
}

export default page;