"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { usePathname, useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

import {
  decreaseQuantity,
  deletefromCart,
  increaseQuantity,
  orderCheckedout,
  setUnavailableStatus,
  unsetUnavailableStatus,
} from "@/app/lib/features/cartSlice/cartSlice";
// import { getPreviousPath } from "@/app/lib/features/path/pathslice";
import moment from "moment-timezone";
import { toast } from "sonner";
const Cart = () => {
  // ----------------------hooks------------------------------------
  const cart = useSelector((state) => state?.cart?.cartData);
  const unavailableStatus = useSelector(
    (state) => state?.cart?.unavailableStatus
  );


  const buyOneGetCartData = cart.filter((el) => el?.isByOneGetPizza == true);
  const [cartMap, setCartMap] = useState(new Map());
  const currTime = moment(moment()?.format('HH:mm'), 'HH:mm');
  const todaysDay = moment()?.tz(moment?.tz?.guess())?.format('dddd');


  const holdingIdsTemp = new Map();
  const cartDataIds = [];
  cart.forEach((el) => {
    cartDataIds.push(String((el?._id ?? el.id)))
    holdingIdsTemp.set((el?._id ?? el.id), 1);
  });


  // setCartMap(holdingIdsTemp);
  // const pathname = usePathname();
  const dispatch = useDispatch();

  async function validateCartData() {
    console.log('validating cart data')
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/verifyCartData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartData: cartDataIds })
    });

    if (!res.ok) {
      toast.error("Server not responding, Please try again later.");
      return false;
    }

    const data = await res.json();
    if (data?.readyToProcessOrder) {
      return true;
    }
    else {

      setCartMap((existingMap) => {
        const currMap = new Map(existingMap);
        data?.data?.forEach((el) => {
          if (currMap.has(el)) {
            currMap.set(el, -1);
          }
        })
        return currMap;
      })

      toast.error("Some Product In Your Cart Is not available !!");
      return false;
    }
  }

  // const router = useRouter();

  async function checkForInvalidOrders() {
    console.log('checking for invalid orders')
    for (let i = 0; i < buyOneGetCartData.length; i++) {

      if (buyOneGetCartData?.[i]?.availabilityOfDeal?.find((el) => (el == todaysDay?.toUpperCase()))) {
        toast.error(`${buyOneGetCartData?.[i]?.name} Deal Not Available On ${todaysDay?.toUpperCase()} Please Remove From The Cart`)
        return false;
      }

      const startTime = moment(buyOneGetCartData?.[i]?.isByOneGetPizzaStartTime, "HH:mm");
      const endTime = moment(buyOneGetCartData?.[i]?.isByOneGetPizzaEndTime, "HH:mm");

      if (currTime.isAfter(startTime) && currTime.isBefore(endTime)) {
        if (!currTime.isBefore(endTime.clone().subtract(process.env.NEXT_PUBLIC_MIN_DELIVERY_TIME || 40, 'minutes'))) {
          toast.error(`${buyOneGetCartData?.[i]?.name} Deal Not Available !! Deal Is Available ${process.env.NEXT_PUBLIC_MIN_DELIVERY_TIME || 40} min early !!`)
          return false;
        }
      }
      else {

        toast.error(`${buyOneGetCartData?.[i]?.name} Deal Not Available At The Moment Please Remove From The Cart`)
        return false;
      }
    }
  }


  const check = async () => {
    await validateCartData()
    checkForInvalidOrders()
  }

  useEffect(() => {
    if (cart?.length > 0) {
      check()
    }
  }, [cart])


  useEffect(() => {
    dispatch(unsetUnavailableStatus())

    dispatch(orderCheckedout(false));
    setCartMap(holdingIdsTemp);

  }, [])




  return (
    <>
      <div className="w-full mx-auto bg-white rounded-lg overflow-hidden">
        {/* <div className="bg-red-800 text-white text-center py-2">
          <h2 className="text-2xl font-bold">YOUR BASKET</h2>
        </div> */}
        {Array.isArray(cart) && cartMap && cart?.length > 0 ? cart?.map((data, idx) => {
          const size = String(data?.size).includes("-");
          const currData = cartMap.get((data?._id ?? data?.id));
          const isUnavailable = currData == -1 ? true : false


          if (!unavailableStatus && isUnavailable) {
            dispatch(setUnavailableStatus())
          }


          const price = String(data?.size).includes("-")
            ? data?.size?.split("-")
            : data?.size;

          const allToppings = data?.allToppings || {
            base: {},
            cheese: [],
            sauce: [],
            veg: [],
            meat: [],
          };
          const mergedToppings = [
            allToppings?.base?.name,
            ...allToppings?.cheese.map((item) =>
              `${item?.cheeseName} ${item?.size === "double" ? "2️⃣" : "1️⃣"
                }`.replace(/ /g, "\u00A0")
            ),
            ...allToppings?.sauce.map((item) =>
              `${item?.sauceName} ${item?.size === "double" ? "2️⃣" : "1️⃣"
                } `.replace(/ /g, "\u00A0")
            ),
            ...allToppings?.veg.map((item) =>
              `${item?.vegName} ${item?.size === "double" ? "2️⃣" : "1️⃣"
                }`.replace(/ /g, "\u00A0")
            ),
            ...allToppings?.meat.map((item) =>
              `${item?.meatName} ${item?.size === "double" ? "2️⃣" : "1️⃣"
                }`.replace(/ /g, "\u00A0")
            ),
          ].join(", ");

          const mergedDealToppingsArray =
            data?.dealsData && Array.isArray(data.dealsData)
              ? data.dealsData.map((item) =>
                [
                  item?.baseName?.name,
                  ...(Array.isArray(item?.cheeseName)
                    ? item?.cheeseName.map((cheese) =>
                      `${cheese.cheeseName} ${cheese?.size === "double" ? "2️⃣" : "1️⃣"
                        }`.replace(/ /g, "\u00A0")
                    )
                    : []),
                  ...(Array.isArray(item?.vegetarianToppingsName)
                    ? item?.vegetarianToppingsName.map((veg) =>
                      `${veg.vegName} ${veg?.size === "double" ? "2️⃣" : "1️⃣"
                        }`.replace(/ /g, "\u00A0")
                    )
                    : []),
                  ...(Array.isArray(item?.meatToppingsName)
                    ? item?.meatToppingsName.map((meat) =>
                      `${meat.meatName} ${meat?.size === "double" ? "2️⃣" : "1️⃣"
                        }`.replace(/ /g, "\u00A0")
                    )
                    : []),
                  ...(Array.isArray(item?.sauceName)
                    ? item?.sauceName.map((sauce) =>
                      `${sauce.sauceName} ${sauce?.size === "double" ? "2️⃣" : "1️⃣"
                        }`.replace(/ /g, "\u00A0")
                    )
                    : []),
                ].join(", ")
              )
              : [];

          return (
            <div className="text-slate-800 font-semibold p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex flex-col space-x-4 gap-2 md:col-span-2">
              <div className="flex space-x-4 md:col-span-2">
                <img
                  src={data?.img}
                  className={`${isUnavailable ? 'blur-sm' : ''} w-[65px]  h-[65px] lg:h-14 lg:w-14 rounded-md`}
                />
                <p className="text-[17px]">
                  <div className="flex flex-col gap-0 md:gap-10">
                    <p className="text-lg">
                      {" "}
                      {data?.name}{" "}
                      {size
                        ? `(${price[0]})`
                        : data?.dealsData
                          ? `(${data?.size})`
                          : data?.allToppings?.size?.name
                            ? `(${data?.allToppings?.size?.name})`
                            : ""}{" "}
                      
                      {/* <br /> */}

                      {data?.allToppings && (!isUnavailable) && (
                        <span className="text-sm bg-red-800 text-white rounded-md px-2">
                          {" "}Customized{" "}
                        </span>
                      )}
                    </p>
                  </div>
                    
                </p>
              </div>
              {(!isUnavailable) && <p className="block !m-0 text-sm text-green-800">
                      {mergedToppings}
                    </p>}

                  {data?.dealsData && (!isUnavailable) && (
                    <div className="!m-0 text-base text-gray-600">
                      {" "}
                      {data?.dealsData
                        ?.map((item, idx) => item?.label)
                        .join(", ")}{" "}
                    </div>
                  )}
              </div>

              
              {data?.dealsData && (!isUnavailable) && (
                <div className="text-base md:col-span-3 lg:col-span-2 text-gray-600">
                  {" "}
                  {data?.dealsData?.map(
                    (item, idx) =>
                      item?.name && (
                        <>
                          {" "}
                          <div key={idx} className="flex flex-col ">
                            <div className="min-w-[10rem] max-w-[10rem] md:min-w-[30rem]">
                              {item?.name}{" "}
                              <span className="text-sm bg-red-800 text-white rounded-md px-2">
                                {" "}Customized{" "}
                              </span>
                            </div>
                            <div className="text-sm text-green-900">
                              {mergedDealToppingsArray[idx]}
                            </div>
                          </div>
                          <div className="border-b py-1"></div>
                        </>
                      )
                  )}
                </div>
              )}
              
              <div className="md:col-span-3 col-span-1 flex justify-between">
              {!isUnavailable && <div className="text-right  text-xl font-bold flex flex-col justify-center items-center">
                £ {data?.totalSum}
              </div>}

                {/* ITEM INCREMENT/DECREMENT */}
              <div
                className={`flex md:justify-end space-x-2 ${data?.allToppings ? "justify-between" : "justify-end"
                  }  `}
              >
                {isUnavailable == true ? <b>Product Not Available</b> : <>
                  {/* <p className=" md:hidden text-green-800">{mergedToppings}</p> */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(decreaseQuantity({ id: data?.id, quantity: 1 }));
                    }}
                    className="bg-red-800 hover:bg-red-700 h-8 text-white font-extrabold text-lg px-2 rounded"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 font-semibold text-lg">
                    {data?.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(increaseQuantity({ id: data?.id, quantity: 1 }));
                    }}
                    className="bg-green-700 hover:bg-green-600 h-8 text-white font-extrabold text-lg px-2 rounded"
                  >
                    +
                  </button>
                </>
                }

                <button
                  type="button"
                  className="bg-red-800 hover:bg-red-700 h-8 text-white px-2 rounded"
                  onClick={() => dispatch(deletefromCart({ id: data?.id }))}
                >
                  <MdDelete size={20} />
                </button>
                
              </div>
              </div>

            </div>
          );
        })
          : (
            <div className="h-[70vh] grid place-items-center">
              <div className="text-3xl font-semibold">Your cart is Empty</div>
            </div>
          )}
        {/* {Array.isArray(cart) && cart?.length > 0 && (
          <div
            onClick={async () => {

              const isValid = await checkForInvalidOrders() ;
              if(isValid)
              {
                dispatch(orderCheckedout(true));
                dispatch(getPreviousPath(pathname));
                router.push("/order/orders");
              }

            }}
            className="bg-green-700 hover:bg-green-600 font-medium text-white text-center py-3 cursor-pointer"
          >
            <span>Select time & place</span>
          </div>
        )} */}
      </div>
    </>
  );
};

export default Cart;
