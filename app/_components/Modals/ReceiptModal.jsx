import React, { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const ReceiptModal = ({ isReceiptVisible, setIsReceiptVisible }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderData = useSelector((state) => state.receipt.selectedReceipt);
  const userData = useSelector((state) => state.auth.userData);
  console.log(orderData);

  // ---------------------------functions--------------------------------
  const createQueryString = useCallback((name, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);

    return params.toString();
  }, []);

  useEffect(() => {
    if (isReceiptVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isReceiptVisible]);

  const createdDate = new Date(orderData?.createdAt)
  const formattedDate = createdDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div
      id="popup-modal"
      tabindex="-1"
      class={`${
        isReceiptVisible ? "flex" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-[#2b303963]`}
    >
      <div class="relative md:p-4 rounded-md bg-white  w-full max-w-2xl ">
        <div class="relative  h-full  ">
          <button
            type="button"
            onClick={() => setIsReceiptVisible(false)}
            class="absolute top-3 end-2.5  bg-red-800 text-white md:text-black md:bg-transparent hover:bg-red-800 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div className="max-[100vh] h-full  md:h-[70vh] w-full overflow-auto bg-white ">
            <div className="text-center">
              <h1 className="text-3xl pt-10 md:pt-0 text-red-800 font-bold">HOT HOUSE PIZZA </h1>
              <p>Order at {formattedDate}</p>
              <p>{orderData?.orderAt}</p>
              <h2 className="text-xl font-semibold my-5">
               Requested for {orderData?.time}
              </h2>
            </div>
            <div className="px-2">
              <h2 className="text-xl">
                {userData?.firstName} {userData?.lastName}
              </h2>
              {/* <p>Status : <span className="text-red-800">{orderData?.orderStatus}</span></p> */}
              <p>Status : <span className="text-green-800">Accepted</span></p>
              <p>Mobile : {userData?.mobileNumber}</p>
              <p className="capitalize">Order type : {orderData?.orderType}</p>
              <p className="capitalize">Order ID : {orderData?.orderNumber}</p>
              <p className="capitalize">Payment Method : <span className={`${orderData?.paymentMethode === "Cash on delivery" ? "text-yellow-600":
                "text-green-800"
              }`}>{orderData?.orderType === "collection" && orderData?.paymentMethode === "Cash on delivery" ? "Pay on Collection" : "Pay on Delivery"}</span></p>
            </div>
            <div className="p-2 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Your Order</h1>
              <p className="font-bold">£ {(Number(orderData?.totalAmount?.deliveryCharge) +
                  Number(orderData?.totalAmount?.total)- Number(orderData?.totalAmount?.discountPrice || 0)).toFixed(2)}</p>
            </div>
            <div>
              <div className="">
                {Array.isArray(orderData?.items) &&
                  orderData?.items?.length > 0 &&
                  orderData?.items?.map((data, idx) => {
                    const size= String(data?.size).includes("-")
                    const price = String(data?.size).includes("-")
                      ? data?.size?.split("-")
                      : data?.size;
                      const allToppings = data?.allToppings || { cheese: [], sauce: [],veg:[],meat:[] };
                    const mergedToppings = [
                      ...allToppings.cheese.map(item => item.cheeseName),
                      ...allToppings.sauce.map(item => item.sauceName),
                      ...allToppings.veg.map(item => item.vegName),
                      ...allToppings.meat.map(item => item.meatName)
                    ].join(', ');

                    return (
                      <div className="p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex items-center space-x-4 md:col-span-2">
                          <div className=" ">
                            <img src={data?.img} className="h-10 w-10 rounded-md" />
                          </div>
                          <p className=" font-semibold">
                            {data?.name}{" "}
                            {size ? `(${price[0]})` : (data?.dealsData ? `(${data?.size})` : data?.allToppings?.size?.name ? `(${data?.allToppings?.size?.name})` : "" ) }
                              {data?.allToppings && <span className="text-sm bg-red-800 text-white rounded-md px-2"> Customized </span>}
                          </p>
                        </div>

                        <div className="font-semibold md:col-span-3">
  <div> <p className="text-sm text-green-800 pb-2">{mergedToppings}</p> </div>
  <div className="flex justify-between">
                        <div className=" text-right  md:text-left">
                        {orderData?.orderType === 'collection' && data?.discount ? <>£ {data?.price - data?.discount} <span className="line-through text-sm text-slate-600">{data?.price}</span></> : `£ ${data?.price}`}
                         
                          <span className="text-sm"> x {data?.quantity}</span>
                        </div>
                        {orderData?.orderType === 'collection' && data?.discount &&   <div className="text-green-800">20% Discount on Collection</div>}
                      
                        </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="px-2 flex justify-between items-center">
              <h1>Total Amount :</h1>
              <h1>£ {orderData?.totalAmount?.total} </h1>
            </div>
            <div className="px-2 flex justify-between items-center">
              <h1>Delivery charge :</h1>
              <h1>£ {orderData?.totalAmount?.deliveryCharge} </h1>
            </div>
            <div className="px-2 flex justify-between items-center">
              <h1>Discount :</h1>
              <h1>£ {orderData?.totalAmount?.discountPrice || 0} </h1>
            </div>
            <div className="px-2 flex justify-between items-center">
              <h1 className="font-semibold">Pay Amount :</h1>
              <h1 className="font-semibold">
                £ {(Number(orderData?.totalAmount?.deliveryCharge) +
                  Number(orderData?.totalAmount?.total)- Number(orderData?.totalAmount?.discountPrice || 0)).toFixed(2)}{" "}
              </h1>
            </div>
            <p className="my-2 text-sm px-2 mb-3">
              Thank you for choosing HOT HOUSE PIZZA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
