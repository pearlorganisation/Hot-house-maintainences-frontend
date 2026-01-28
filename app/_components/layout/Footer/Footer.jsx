"use client";

import React from "react";

import { SlSocialInstagram } from "react-icons/sl";
import { FiFacebook } from "react-icons/fi";
import { SiWhatsapp } from "react-icons/si";
import { FaPhone } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import CookieConsent from "react-cookie-consent";

const Footer = () => {
  return (
    <div className="h-full  flex flex-col bg-red-800 py-4">
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="user_consent"
        style={{
          background: "#2B373B",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "10px 16px",
          fontSize: "13.5px",
          zIndex: 9999,
          lineHeight: "1.4",
        }}
        contentStyle={{
          flex: "1 1 auto",
          marginRight: "0",
          marginLeft: "0",
          marginBottom: "0",
        }}
        buttonStyle={{
          background: "#166534",
          color: "#fff",
          fontSize: "13px",
          borderRadius: "5px",
          padding: "6px 14px",
          border: "none",
          cursor: "pointer",
        }}
        declineButtonStyle={{
          background: "#999",
          color: "#000",
          fontSize: "13px",
          borderRadius: "5px",
          padding: "6px 14px",
          border: "none",
          cursor: "pointer",
          marginRight: "6px",
        }}
      >
        <span>
          We use cookies to enhance your browsing experience.{" "}
          <a
            href="/cookie-policy"
            className="underline text-blue-400 hover:text-blue-300 transition-colors"
          >
            Learn more
          </a>
        </span>
      </CookieConsent>

      <style jsx global>{`
        @media (max-width: 640px) {
          .CookieConsent {
            flex-direction: column;
            text-align: center;
            gap: 8px;
            padding: 12px;
            margin: 0;
          }
          .CookieConsent > div {
            width: 100%;
          }
          .CookieConsent button {
            width: auto;
            min-width: 100px;
          }
        }
      `}</style>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center px-4  text-white">

        <div className="flex justify-center">
          <div className="flex flex-col gap-4">
            {/* social links */}
            <div className="md:flex gap-2 items-center justify-between max-w-[300px] ">
              <div className="flex flex-col gap-2 justify-between items-center md:items-start">
                <h3 className="font-bold text-lg">SOCIAL LINKS</h3>
                <div className="flex gap-2">
                  <p className="hover:text-yellow-500 text-sm cursor-pointer">
                    {" "}
                    <a href="https://www.instagram.com/hothousepizzanorthwood" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                      <SlSocialInstagram size={24} />
                    </a>
                  </p>
                  <p className="hover:text-yellow-500 text-sm cursor-pointer">
                    {" "}
                    <a href="https://www.facebook.com/HotHousePizzaNorthwood" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                      <FiFacebook size={24} />
                    </a>
                  </p>



                  <p className="hover:text-yellow-500 text-sm cursor-pointer">
                    {" "}
                    <a href="https://wa.me/+447469367116" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                      <SiWhatsapp size={24} />
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* policies */}
            <div className="flex gap-2 justify-between max-w-[300px] items-center">
              <div className="flex flex-col gap-2 justify-between items-center md:items-start">
                <h3 className="font-bold text-lg">POLICIES</h3>
                <div className="flex flex-col gap-2 text-sm xl:text-base text-center md:text-left">
                  <p className="hover:text-yellow-500 text-sm cursor-pointer">
                    {" "}
                    <a href="/termsAndConditions">TERMS & CONDITIONS</a>
                  </p>

                  <p className="hover:text-yellow-500 text-sm cursor-pointer">
                    {" "}
                    <a href="/refundPolicy">REFUND POLICY</a>
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
        <div className="md:hidden flex justify-center  m-4">
          <hr className="border border-white w-[300px] h-[4px]  " />
        </div>
        {/* delivery info */}
        <div className="text-sm w-full sm:w-2/3 md:w-full mx-auto text-justify md:text-left px-6 md:px-0">
          <p className="mb-4">
            <strong>Please note:</strong>{" "}
            <a href="#" className="underline">
              Orders take a minimum of {process.env.NEXT_PUBLIC_MIN_DELIVERY_TIME || 35} minutes
            </a>{" "}
            to deliver. Whilst we endeavour to get your order to you on
            time, there may be delays during busier periods.
          </p>
          <p className="mb-4">
            If you have any issues with your order or
            experience, in the first instance please contact the
            store you ordered from directly.
          </p>
        </div>




        <div className="flex flex-col gap-2 items-center justify-between">
          <div className="md:hidden flex justify-center  m-4">
            <hr className="border border-white w-[300px] h-[4px]  " />
          </div>



          {/* address */}
          <div className="flex flex-col gap-2 text-sm xl:text-base text-center md:text-left  ">
            <h3 className="font-bold text-lg">CONTACT DETAILS</h3>
            <p className="flex gap-2 justify-between">
              <span className="w-[25px]">
                <FaStore className="mr-2" size={20} />
              </span>
              <span className="text-center md:text-left w-full max-w-full">Store : 91 Joel St, Pinner, Northwood HA6 1LW, UK</span>
            </p>
            <p className="flex gap-2 justify-between">
              <span className="w-[25px]">
                <IoMdMail className="mr-2" size={20} />
              </span>
              <span className="text-center md:text-left w-full max-w-full">Hothousenorthwood@gmail.com</span>

            </p>
            <p className="flex gap-2 justify-between">
              <span className="w-[25px]">
                <FaPhone className="mr-2" size={20} />
              </span>
              <span className="text-center md:text-left w-full max-w-full">  Contact Us : 01923510520</span>

            </p>


          </div>
        </div>
      </div>
      <div className="text-center text-white mt-4">
        Copyright © {new Date().getFullYear()} Hot House Pizza Northwood
      </div>







    </div>
  );
};

export default Footer;
