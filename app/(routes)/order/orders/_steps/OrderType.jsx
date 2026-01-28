"use client";

import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Collections from "./Collections";
import { toast } from "sonner";
import Delivery from "./Delivery";
import { changePopup } from "@/app/lib/features/popup/popupslice";
import Link from "next/link";

const OrderType = () => {
  const [step, setStep] = useState(1);
  const [deliveryPartner, setDeliveryPartner] =  useState("deliveroo")
  const router = useRouter();
  const { isUserLoggedIn, isGuestLoggedIn } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cartData);

  // const { previousPath } = useSelector((state) => state.path);
  //   const { isOrderCollection } = useSelector((state) => state.cart);

  const { popupState } = useSelector((state) => state.popup);
  const { siteSettingsData } = useSelector((state) => state.siteSettings)
  const totalPrice = cart?.reduce((acc, item) => acc + Number(item?.totalSum), 0);
  const dispatch = useDispatch();

  const orderTypeArray = [
    { name: `Collection`, no: 1 },
    { name: `Delivery`, no: 2 },
  ]

  if (totalPrice < (process.env.NEXT_PUBLIC_MIN_DELIVERY_AMOUNT ?? 15)) {
    orderTypeArray.pop();
  }

  useEffect(() => {
    // console.log('total price', totalPrice)
    if (totalPrice < (process.env.NEXT_PUBLIC_MIN_DELIVERY_AMOUNT ?? 15)) {
      if (popupState == 'DELIVERY') {
        // console.log('changing to collection')
        setStep(1);
        dispatch(changePopup('COLLECTION'));
      }
    }
    else {
      if (popupState == 'DELIVERY') {
        setStep(2);  
        if(deliveryPartner === "deliveroo") dispatch(changePopup('COLLECTION'));
      } else {
        setStep(1);
      }
    }

  }, [popupState, totalPrice, dispatch, deliveryPartner])

  useEffect(() => {
    if (!isUserLoggedIn && !isGuestLoggedIn) {
      toast.error("Please Login...")
      router.push("/login");
    }
  }, [isUserLoggedIn, isGuestLoggedIn]);


  useEffect(() => {
    if(Array.isArray(siteSettingsData) && siteSettingsData[0]?.todayPartner){
      setDeliveryPartner(siteSettingsData[0]?.todayPartner)
    } else {
      setDeliveryPartner("deliveroo")
    }
  }, [siteSettingsData])

  return (
    <div className="container space-y-2">
      <div className="flex items-center gap-2 border-b-1">
        {orderTypeArray.map((item) => {
          return (
            <>
              {(deliveryPartner === "deliveroo" ? (item?.no === 1) : true) ? (
                <button
                  onClick={() => {
                    if (item?.no == 2) {
                      if (cart.some((item) => item?.collectionOnlyDeal === true)) {
                        toast.error("Delivery is unavailable as your cart contains a collection-only deal.", {
                          duration: 2000
                        });

                      }
                      else {
                        setStep(item?.no);
                        dispatch(changePopup('DELIVERY'));
                      }
                    }
                    else {
                      setStep(item?.no);
                      dispatch(changePopup('COLLECTION'));

                    }

                  }}
                  type="button"
                  className={`px-6 py-1 border-2 ${step === item?.no ? "text-white bg-[#DC2626]" : "text-[#DC2626]"
                    }  border-[#DC2626]  rounded font-medium`}
                >
                  {item?.name}
                </button>

              ) : (
                <>
                  {
                    deliveryPartner === "deliveroo" &&
                    <Link href="https://deliveroo.co.uk/backlinks/576153">
                      <img className="rounded" alt="The best local restaurants and takeaways are here to deliver. Order on Deliveroo today!" src="https://deliveroo.co.uk/backlinks/576153.png" />
                    </Link>
                  }
                  {/* <Link href="https://deliveroo.co.uk/backlinks/576153"
                    className={`px-6 py-2 border-2 text-[#DC2626] border-[#DC2626]  rounded font-medium`}
                  >
                    Delivery
                  </Link> */}

                </>
              )}
            </>

          );
        })}
        {totalPrice < (process.env.NEXT_PUBLIC_MIN_DELIVERY_AMOUNT ?? 15) && <div className="text-red-800 ">No delivery in order less than {process.env.NEXT_PUBLIC_MIN_DELIVERY_AMOUNT} Pounds</div>}
      </div>
      <div >
        {step === 1 && (
          <Collections step={step} />
        )}
        {step === 2 && (
          <Delivery step={step} />
        )}
      </div>
    </div>
  );
};

export default OrderType;


