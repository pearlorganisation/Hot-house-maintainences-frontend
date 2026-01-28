"use client";
import {setToppings, setToppingsCYOP } from "@/app/lib/features/cartSlice/cartSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";


//calledBy component is used for telling this component that from which component this sauce component is being called on 
// like from deals customization modal or maybe from half and half
const Sauce = ({ sauceData ,calledBy }) => {

  const { customizationData } = useSelector((state) => state.orderDetails);
  const { MAX_TOPPINGS, CYOP_MAX_TOPPINGS } = useSelector((state) => state.cart);
  const [defaultSauceDetails, setDefaultSauceDetails] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState({});
  const dispatch = useDispatch();


  useEffect(() => {
    setDefaultSauceDetails(customizationData?.sauceName);
  }, [customizationData]);

  useEffect(() => {
    setSelectedSauces(() => {
      const defaultSelected = {};
      defaultSauceDetails?.forEach((sauceName) => {
        const sauce = sauceData.find((s) => s.name === sauceName);
        if (sauce) {
          defaultSelected[sauce._id] = "single";
        }
      });
      return defaultSelected;
    });
  }, [defaultSauceDetails, customizationData, sauceData]);

  const handleSelectionChange = (sauceId, size) => {
    // if(customizationData.id==="6703be55176d2099698929c1" ){
    //   setSelectedSauces((prevSelected) => {
    //     // Toggle the selection
    //     if (prevSelected[sauceId] === size) {
    //       const { [sauceId]: _, ...rest } = prevSelected;
    //       return rest;
    //     } else {
    //       console.log(CYOP_MAX_TOPPINGS)
    //       if ( CYOP_MAX_TOPPINGS < 6) {
    //         return {
    //           // ...prevSelected,
    //           [sauceId]: size,
    //         };
    //       }
         
    //       else {
    //         toast.info("You Can Add Only 6 Toppings");
    //         return {
    //           ...prevSelected,
    //         };
    //       }
    //     }
    //   });

    // }
    // else 
// { 
     setSelectedSauces((prevSelected) => {
      // Toggle the selection
      if (prevSelected[sauceId] === size) {
        const { [sauceId]: _, ...rest } = prevSelected;
        return rest;
      } else {
        return {
          // ...prevSelected, // if you want to multiselect kindly un comment it
          [sauceId]: size,
        };
      }
    });
  // }
  };


  console.log;

  const handleSave = () => {
    const selectedSaucesData = Object.entries(selectedSauces).map(
      ([sauceId, size]) => {
        const sauce = sauceData.find((s) => s._id === sauceId);
        const zero = sauceData.some((i, idx) => {
          return i.name === customizationData?.sauceName[idx];
        });
        console.log(zero, "zero");
        const price =
          size === "single"
            ? sauce.price[0].singlePrice
            : sauce.price[0].doublePrice;
        console.log(price, "price:::");
        return {
          sauceName: sauce.name,
          _id: sauce?._id,
          size,
          price,
        };
      }
    );
    
    if(customizationData?.id==="6703be55176d2099698929c1" ){
      dispatch(setToppingsCYOP({ sauce: selectedSaucesData}));
    }else{
      dispatch(setToppings({ sauce: selectedSaucesData }));
    }
 
  
    // console.log(selectedSaucesData, "selectedSaucesData");
  };

  useEffect(() => {
    handleSave();
  }, [selectedSauces]);

  return (
    <div className="">
      <h1 className="text-lg font-bold my-8">
        SAUCES{" "}
        <span className="text-gray-500 font-normal">
          (Select only one option)
        </span>
      </h1>
      <table className="min-w-full divide-y divide-gray-200 shadow-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Sauce
            </th>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Single
            </th>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Double
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sauceData.map((sauce) => (
            <tr key={sauce._id} className="hover:bg-gray-100">
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-wrap text-sm font-medium text-gray-900">
                {sauce.name}
              </td>
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-500">
                <div
                  className={`cursor-pointer px-2 md:px-4 py-2 rounded text-center ${
                    selectedSauces[sauce._id] === "single"
                      ? "bg-red-800 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                  onClick={() => handleSelectionChange(sauce._id, "single")}
                >
                  £ {calledBy === "half" ? ((sauce?.price[0]?.singlePrice)/2): sauce?.price[0]?.singlePrice}
                </div>
              </td>
              <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <div
                  className={`cursor-pointer px-2 md:px-4 py-2 rounded text-center ${
                    selectedSauces[sauce._id] === "double"
                      ? "bg-green-800 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                  onClick={() => handleSelectionChange(sauce._id, "double")}
                >
                  £ {calledBy === "half" ?((sauce?.price[0]?.doublePrice)/2) :sauce?.price[0]?.doublePrice}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sauce;
