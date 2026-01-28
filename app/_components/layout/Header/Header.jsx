"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import { FaBagShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { PiBagLight } from "react-icons/pi";
import { RiRefreshFill } from "react-icons/ri";
import logo from "../../../_assets/images/HOTPIZZALOGO.jpg";
import { categoryEnum } from "@/app/utils/utils";
import { useAppSelector } from "@/app/lib/hooks";
import { SiWhatsapp } from "react-icons/si";
import { BiSolidPizza } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { getCustomizationDetails } from "@/app/lib/features/orderDetails/orderDetailsslice";
import LogoutModal from "../../Modals/LogoutModal";
import { orderCheckedout } from "@/app/lib/features/cartSlice/cartSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


async function getPizzaData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/pizza`);
    const data = await res.json();
    return data.data; // Assuming `data` has a `data` property containing the actual deals
  } catch (err) {
    console.log("Error Occurred", err);
    return null;
  }
}
const Header = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const cart = useAppSelector((state) => state.cart.cartData);
  const { userData, isUserLoggedIn, isGuestLoggedIn } = useAppSelector((state) => state.auth);
  const [tabSwitched, setTabSwitched] = useState(null);
  const router = useRouter();
  const [tabText, setTabText] = useState(null);
  const [pizzaData, setPizzaData] = useState(null);
  const dispatch = useDispatch()
  const randomId = useId()
  const modalRef = useRef(null);
  function handleLogoutAccount() {
    modalRef.current.open();
  }

  const totalPrice = cart?.reduce((acc, item) => acc + Number(item?.totalSum), 0);
  const { isOrderCheckout } = useSelector((state) => state?.cart);
  const { popupState } = useSelector((state) => state.popup);
  function isOrderTypeSelected() { // this would check whether client wants delivery or collection 
    if (popupState == null) {
      toast.error("Please Select Delivery/Collection Option First !!")
      return false;
    }

    return true;

  }

  useEffect(() => {
    async function fetchData() {
      const pizzaData = await getPizzaData()
      setPizzaData(pizzaData)
    }
    fetchData();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Render nothing until the component has mounted
  }
  return (
    <div className="bg-white  z-10 shadow-lg fixed top-0 w-full pt-2  md:pt-4 md:py-4">
      <LogoutModal ref={modalRef} />
      {/* Mobile */}
      <div className="flex justify-between items-center mx-1 md:mx-4">
        <Link href="/" className="flex justify-center">
          <Image src={logo} className="bg-white lg:hidden" alt="http://localhost:3001/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FHOTPIZZALOGO.070f75e0.jpg&w=256&q=75" width={40} />
        </Link>
        <ul className="lg:hidden flex gap-4 items-center">
          {isUserLoggedIn ? (
            <Link href="/profile?tab=1">
              <p className="flex items-center gap-2 text-green-950">
                <FaUser size={20} className="text-slate-700" aria-label="User Profile" />
                <span className="text-red-800 text-sm font-semibold tracking-wide">
                  {userData?.firstName ? userData?.firstName?.[0] : "Error"}.{userData?.lastName}
                </span>
              </p>
            </Link>
          ) : isGuestLoggedIn ? <li className="px-2 py-1 text-white font-semibold bg-red-800 rounded-md flex items-center text-xs">
            <button onClick={handleLogoutAccount}> Guest Account</button>
          </li> : (
            <li className="px-2 py-1 text-white font-semibold bg-red-800 rounded-md flex items-center text-xs">
              <Link href="/login">Login / Signup</Link>
            </li>
          )}
          <button onClick={() => {

            if (!isOrderTypeSelected()) {
              return
            }
            router.push('/order/orders')
          }}
            // href="/order/cart" 

            className="flex items-center text-base">
            <FaBagShopping size={22} className="text-slate-700" aria-label="Cart" />
            <span className="bg-red-800 text-sm text-white rounded-full px-[6px] py-[1px] mx-2">
              {cart?.length}
            </span>
            <span className="text-red-800 font-semibold">
              <span className="text-sm">£ </span>{totalPrice?.toFixed(2)}
            </span>
          </button>
        </ul>
      </div>

      {/* Desktop */}
      <div className="bg-white flex flex-col lg:flex-row justify-between lg:items-center lg:px-10">
        <Link href="/" className="hidden lg:flex lg:flex-col justify-center h-full">
          <Image src={logo} className="bg-white hidden lg:block" alt="Hot House Northwood" width={80} height={80} />
        </Link>
        <ul className="flex lg:pt-0 flex-wrap items-center justify-around text-base sm:text-lg text-white font-semibold xl:gap-10">
          <button
            onClick={() => {

              if (!isOrderTypeSelected()) {
                return false;
              }
              router.push('/menu/deals')
            }}
          // href="/menu/deals"

          >
            <li
              className={`py-2 px-1 mt-2 lg:mt-0 lg:px-5 lg:h-[56px] flex items-center text-green-800 transition duration-300 font-bold ${selectedItem === -1 ? "bg-red-800 text-white hover:text-white" : "bg-white hover:shadow-[0_4px#991b1b] hover:text-[#991b1b]"
                }`}
              onClick={() => setSelectedItem(-1)}
            >
              Deals
            </li>
          </button>
          {Array.isArray(categoryEnum) &&
            categoryEnum.map((data, idx) => (
              <button
                //  href={`/menu/${data?.toLowerCase()}`} 
                onClick={() => {
                  if (!isOrderTypeSelected()) {
                    return false;
                  }
                  router.push(`/menu/${data?.toLowerCase()}`)
                }}
                key={idx}>
                <li
                  className={`px-1  mt-2 lg:mt-0 lg:px-5 py-2 lg:h-[56px] flex items-center text-green-800 transition duration-300 font-bold ${selectedItem === idx ? "bg-red-800 text-white hover:text-white" : "bg-white hover:shadow-[0_4px#991b1b] hover:text-[#991b1b]"
                    }`}
                  onClick={() => setSelectedItem(idx)}
                >
                  {data.slice(0, 1)}
                  {data.slice(1).toLowerCase()}
                </li>
              </button>
            ))}




        </ul>
        <div className="flex items-center gap-5">
          {isUserLoggedIn ? (
            <Link href="/profile?tab=1" className="hidden lg:flex items-center gap-2 text-black">
              <CiUser size={25} aria-label="User Profile" />
              <span className="text-base text-red-800 hover:text-red-700 hover:font-bold tracking-wide">
                {userData?.firstName && userData?.lastName ? `${userData?.firstName[0]}.${userData?.lastName}` :
                  userData?.firstName ? userData?.firstName : "No Name"}
              </span>
            </Link>
          ) : isGuestLoggedIn ? (<li className="hidden lg:flex px-2 font-normal hover:bg-white hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md hover:text-red-800 text-white bg-red-800 items-center text-lg">
            <button onClick={handleLogoutAccount}> Guest Account</button>
          </li>) : (
            <li className="hidden lg:flex px-2 font-normal hover:bg-white hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md hover:text-red-800 text-white bg-red-800 items-center text-lg">
              <Link href="/login">Login / Signup</Link>
            </li>
          )}
          <button onClick={() => {
            if (!isOrderTypeSelected()) {
              return false;
            }

            router.push('/order/orders')
          }}

            // href="/order/cart" 

            className="hidden text-black lg:flex items-center text-lg">
            <PiBagLight size={25} aria-label="Cart" />
            <span className="bg-red-800 hover:bg-red-700 text-white rounded-full px-2 mx-2">
              {cart?.length}
            </span>
            <span className="text-red-800 hover:text-red-700 hover:font-bold">£ {totalPrice?.toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden w-full  md:flex absolute top-full right-0 justify-between">
        <div className="flex gap-2">
          <button onClick={() => {

            if (!isOrderTypeSelected()) {
              return false;
            }
            dispatch(
              getCustomizationDetails({
                name: "Create Your Own Pizza",
                img: "https://res.cloudinary.com/dx550y313/image/upload/v1729863237/HotHouse%20after%2025%20OCT/ngo69j5nii68d36x0n0x.png",
                priceSection: pizzaData[0]?.priceSection,
                id: randomId,
                sauceName: [],
                cheeseName: [],
                vegetarianToppingsName: [],
                meatToppingsName: [],
                baseName: pizzaData[0]?.baseName,
                selectedData: pizzaData[0]?.priceSection[0]?.size?._id,
              }));

            router.push('/menu/product/customisePizza?calledBy=createYourOwnPizza')
          }
          } 
          // href={"/menu/product/customisePizza?calledBy=createYourOwnPizza"}
            className="flex items-center bg-green-800  text-white py-2 px-4 text-base rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-green-800"
          >
            <BiSolidPizza size={30} />
            <span className="ml-2">Create Your Own Pizza</span>
          </button>
          <button
            // href={"/menu/halfAndHalfPizza?calledBy=half"}
            onClick={() => {
              if (!isOrderTypeSelected()) {
                return;
              }

              router.push('/menu/halfAndHalfPizza?calledBy=half')
            }}
            className="flex items-center bg-red-800  text-white py-2 px-4 text-base rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
          >
            <BiSolidPizza size={30} />
            <span className="ml-2">Half & Half Pizza</span>
          </button>
        </div>
        <div className="flex gap-2">
          <a
            href="https://wa.me/+447469367116" target="_blank" rel="noopener noreferrer"
            className="flex items-center bg-green-800  text-white py-2 px-4 text-base rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-green-800"
          >
            <SiWhatsapp size={25} />
            <span className="ml-2">Whatsapp</span>
          </a>


          {/* <><button
    onClick={()=>dispatch(orderCheckedout(true))}
    className ={ `flex items-center ${isOrderCheckout ? 'text-red-800' :''} hover:text-red-800  py-2 px-4 text-base rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]  bg-white text-green-800`
    }>
<GiFullPizza className="" size={25}/>
<span className="ml-2">Collection</span>  
  </button>
   <button
    className={`flex items-center${isOrderCheckout == 'false' ? 'text-red-800' :''} hover:text-red-800  py-2 px-4 text-base rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white text-green-800`}
  >
<TbTruckDelivery className="" size={25} />    <span className="ml-2">Delivery</span>
  </button></>  */}


          {isUserLoggedIn && <a
            href="/profile?tab=3"
            className="flex items-center bg-red-800  text-white py-2 px-4 text-base rounded-b-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
          >
            <RiRefreshFill size={30} />
            <span className="ml-2">Reorder Now</span>
          </a>}
        </div>
      </div>


      {/* Mobile */}
      <div className="md:hidden border-b border-white flex justify-center">
        <button onClick={() => {
          if (!isOrderTypeSelected()) {
            return false;
          }
          dispatch(
            getCustomizationDetails({
              name: "Create Your Own Pizza",
              img: "https://res.cloudinary.com/dx550y313/image/upload/v1729863237/HotHouse%20after%2025%20OCT/ngo69j5nii68d36x0n0x.png",
              priceSection: pizzaData[0]?.priceSection,
              id: randomId,
              sauceName: [],
              cheeseName: [],
              vegetarianToppingsName: [],
              meatToppingsName: [],
              baseName: pizzaData[0]?.baseName,
              selectedData: pizzaData[0]?.priceSection[0]?.size?._id,
            })
          );

          router.push("/menu/product/customisePizza?calledBy=createYourOwnPizza")

        }
        }

          // href={"/menu/product/customisePizza?calledBy=createYourOwnPizza"}
          className="w-full border-r border-r-white justify-center inline-flex items-center bg-green-800 text-white py-2  shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-green-800"
        >

          <span className="text-sm">Create Your Own Pizza</span>
        </button>
        <button
          // href={"/menu/halfAndHalfPizza?calledBy=half"}
          onClick={() => {

            if (!isOrderTypeSelected())
              return;
            router.push('/menu/halfAndHalfPizza?calledBy=half')

          }}
          className="w-full border-r border-r-white justify-center inline-flex items-center bg-red-800 text-white py-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <span className="pl-2 text-sm">Half & Half Pizza</span>
        </button>
      </div>
      <div className="md:hidden flex justify-center">

        <a
          href="https://wa.me/+447469367116" target="_blank" rel="noopener noreferrer"
          className="w-full border-r border-r-white justify-center inline-flex items-center bg-green-800 text-white py-2 px-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <SiWhatsapp size={22} />
          <span className="pl-2 text-sm">Whatsapp</span>
        </a>
        {isUserLoggedIn && <a
          href="/profile?tab=3"
          className="w-full border-r border-r-white justify-center inline-flex items-center bg-red-800 text-white py-2 px-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white hover:text-red-800"
        >
          <RiRefreshFill size={25} />
          <span className="pl-2 text-sm">Reorder Now</span>
        </a>}
      </div>

    </div>
  );
};

export default Header;
