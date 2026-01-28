"use client";
import ReceiptModal from "@/app/_components/Modals/ReceiptModal";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";
import { getSelectedReceipt } from "@/app/lib/features/orderDetails/selectedRecipt";
import React, { useEffect, useState } from "react";
import { BiReceipt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

const OrderDetails = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [orderData, setOrderData] = useState("");
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const dispatch = useDispatch();

  // const router = Router

  const getOrderDetails = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/${userData?._id}`
    );
    const responsejson = await response.json();
    setOrderData(responsejson?.data);
  };

  useEffect(() => {
    getOrderDetails();
  }, []);


  function handleReorderData(data) {
    data.forEach((element) => {
      return dispatch(
        addToCart({
          ...element,
        })
      );
    });

    console.log(data, "data in the orderDetails");
  }

  return (

    <div className="px-2 md:px-10 md:py-10 w-full lg:w-3/4 rounded-md shadow-lg">

      {Array.isArray(orderData) &&
        orderData.length > 0 ?
        orderData?.map((data) => {
          const createdDate = new Date(data?.createdAt)
          const formattedDate = createdDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          return (
            <div className="pb-8 md:p-4">
              <div className="md:flex gap-3  justify-between">
                <h1 className="">
                 <div className="flex justify-between">
                   <span className="text-xl capitalize bg-red-800 rounded-t-md px-1 py-1 text-white">{`${data?.orderType}`}
                    </span>   
                    <a
                    // href="/order/cart"
                    href="/order/orders"
                    onClick={() => handleReorderData(data?.items)}
                    className="md:hidden px-1 py-1  text-red-800 font-semibold rounded-md shadow-lg flex items-center"
                  >
                    Reorder Now
                  </a>
                  </div>
                    {/* <h2 className={` md:hidden font-semibold  ${data?.orderStatus === "Completed" ? "text-green-800" : data?.orderStatus === "Pending" ? "text-yellow-600" : "text-red-800" } `}>{data?.orderStatus}</h2> */}
                    <h2 className={` md:hidden font-semibold text-green-800 } `}>Accepted</h2>
                   <div className="flex gap-3 text-slate-700  border">
                   <h1 className="hidden md:block ">Requested For <span className="font-semibold">{data?.time}</span>, </h1> 
                   <h1 className="hidden md:block">Order At <span className="font-semibold">{formattedDate}</span> </h1> 
                   </div>
             

                </h1>
                {/* <h2 className={`hidden md:block font-semibold  ${data?.orderStatus === "Completed" ? "text-green-800" : data?.orderStatus === "Pending" ? "text-yellow-600" : "text-red-800"} `}>{data?.orderStatus}</h2> */}
                <h2 className={`hidden  md:block font-semibold text-green-800 } `}>Accepted</h2>
              </div>
              <div className="flex justify-between items-center">
                <div className="">
                <div className=" md:hidden text-slate-700">Requested For <span className="font-semibold">{data?.time}</span>, </div> 
                <div className=" md:hidden text-slate-700">Order At <span className="font-semibold">{formattedDate}</span>, </div> 
                  {/* <p>{data?.orderAt}</p> */}
                  <p className="font-semibold text-green-800">
                    Order Amount - £{" "} 
                    {(Number(data?.totalAmount?.total) +
                      Number(data?.totalAmount?.deliveryCharge)).toFixed(2)}
                  </p>
                </div>
                <div className="md:flex items-center gap-2 ">
                  <a
                    // href="/order/cart"
                    href="/order/orders"
                    onClick={() => handleReorderData(data?.items)}
                    className="hidden p-3 bg-red-800 hover:bg-red-700 rounded-md text-white md:flex items-center"
                  >
                    Reorder Now
                  </a>
                  <button
                    className="p-2 md:p-3  text-red-800 hover:text-red-700  rounded-md shadow-lg flex items-center"
                    onClick={() => {
                      dispatch(getSelectedReceipt(data));
                      setIsReceiptVisible(true);
                    }}
                  >
                    <BiReceipt size={20} className=""/>
                  </button>
                </div>
                <ReceiptModal
                  setIsReceiptVisible={setIsReceiptVisible}
                  isReceiptVisible={isReceiptVisible}
                />
              </div>
            </div>
          );
        })
      : "No Order History"
      }
    </div>
  );
};

export default OrderDetails;
