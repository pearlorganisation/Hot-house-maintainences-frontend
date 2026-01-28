"use client";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";
import { changePopup } from "@/app/lib/features/popup/popupslice";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSiteSettings } from "@/app/lib/features/siteSettings/siteSettingsActions";

const Popup = () => {
  const { popupState } = useSelector((state) => state.popup)

  return <div>{
    popupState == null && <PopupSubComponent popupState={popupState} />
  }</div>
};


const PopupSubComponent = () => {
  const { popupState } = useSelector((state) => state.popup)
  const { siteSettingsData } = useSelector((state) => state.siteSettings)
  const [pizzaOptions, setPizzaOptions] = useState(JSON.parse(process.env.NEXT_PUBLIC_PIZZA_OPTIONS))


  const dispatch = useDispatch();

  const handleSelection = (option) => {
    dispatch(changePopup(option));
  };


  const handleCloseModal = () => {
    if (!popupState) {
      dispatch(changePopup(pizzaOptions[1] ?? "COLLECTION"));
    }
  }

  useEffect(() => {

    dispatch(getSiteSettings())

    if (!pizzaOptions) {
      const pizzaOptionsArr = process.env.NEXT_PUBLIC_PIZZA_OPTIONS ? JSON.parse(process.env.NEXT_PUBLIC_PIZZA_OPTIONS) : ["DELIVERY", "COLLECTION"]
      setPizzaOptions(pizzaOptionsArr)
    }

  }, [pizzaOptions])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      {/* Animated Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full relative z-[51]"
      >

        {/* <IoClose
          size={31}
          className="absolute top-1 right-2 cursor-pointer hover:text-red-700 transition duration-300"
          onClick={handleCloseModal}
        /> */}

        <div className="flex justify-center w-full h-full mb-4">
          <Image
            height={66}
            width={66}
            src='/pizza.gif'
            alt="collection/delivery"
            fetchPriority="high"

            className=" object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">How would you like your Pizza?</h2>
        <p className="text-gray-500 mb-6">Choose your preferred option below.</p>


        <div className="flex justify-center space-x-4 text-base sm:text-xl">
          <button
            className="w-full flex flex-col md:flex-row md:gap-1 justify-center items-center bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg shadow-md transition-all"
            onClick={() => handleSelection(pizzaOptions[1])}
          >
            <span className={`flex ${Array.isArray(siteSettingsData) && siteSettingsData[0]?.todayPartner === "deliveroo" ? "flex-col" : "flex-row gap-2"} justify-center items-center`}>Collection <strong>(20% off)</strong></span>
          </button>

          {Array.isArray(siteSettingsData) && siteSettingsData[0]?.todayPartner === "deliveroo" ? (
            <Link
              href="https://deliveroo.co.uk/backlinks/576153"
              className="w-full flex flex-col md:flex-row md:gap-1 justify-center items-center  tracking-wide bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg  shadow-md transition-all"
            >
              <span className="flex flex-col justify-center items-center">
                Delivery
                <span className="text-sm md:text-base flex gap-1 justify-center w-full">
                  (via
                  <Image
                    height={16}
                    width={20}
                    src={'/deliveroo-white.png'}
                    alt="deliveroo logo"
                    fetchPriority="high"
                  />
                  Deliveroo)
                </span>
              </span>

            </Link>
          ) : (
            <button
              className="w-full flex flex-col md:flex-row md:gap-1 justify-center items-center bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-all"
              onClick={() => handleSelection(pizzaOptions[0])}
            >
              <span className="flex flex-col justify-center items-center">Delivery</span>
            </button>
          )}



        </div>
      </motion.div>
    </div>
  )
}

export default Popup;