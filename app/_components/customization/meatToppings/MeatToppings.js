"use client";
import { setPrice, setToppings, setToppingsCYOP, updateSet } from "@/app/lib/features/cartSlice/cartSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const MeatToppings = ({ meatTopData ,calledBy }) => {
  // console.log(meatTopData, "meatTopData");
  const { customizationData } = useSelector((state) => state.orderDetails);
  
  const { MAX_TOPPINGS ,createYourOwnPizzaMAX_TOPPINGS} = useSelector((state) => state.cart);

  const [defaultMeatDetails, setDefaultMeatDetails] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setDefaultMeatDetails(customizationData?.meatToppingsName);
  }, [customizationData]);

  useEffect(()=>{
   console.log("createYourOwnPizzaMAX_TOPPINGS",createYourOwnPizzaMAX_TOPPINGS);
  },[createYourOwnPizzaMAX_TOPPINGS]);

  useEffect(() => {
    setSelectedMeat(() => {
      const defaultSelected = {};
      // console.log(defaultSelectedMeat, "defaultSelectedMeat");
      defaultMeatDetails?.forEach((meatName) => {
        // console.log(meatName, "meatName");
        const meat = meatTopData.find((s) => s.name === meatName);
        // console.log(meatTopData, "meatTopData");
        if (meat) {
          defaultSelected[meat._id] = "single";
        }
      });
      // console.log(defaultSelected, "defaultSelected");
      return defaultSelected;
    });
  }, [defaultMeatDetails, customizationData, meatTopData]);

  const [selectedMeat, setSelectedMeat] = useState({});

  const handleSelectionChange = (meatId, size) => {

    console.log("calledBy",calledBy);
    if(calledBy === "createYourOwnPizza")
    {
      dispatch(updateSet(meatId));
    }
    // console.log(customizationData.id==="6703be55176d2099698929c1" )
    // console.log(CYOP_MAX_TOPPINGS,"CYOP_FREE_TOPPINGS")
    // if(customizationData.id==="6703be55176d2099698929c1" ){
    //   setSelectedMeat((prevSelected) => {
    //     // Toggle the selection
    //     if (prevSelected[meatId] === size) {
    //       const { [meatId]: _, ...rest } = prevSelected;
    //       return rest;
    //     } else {
    //       if ( CYOP_MAX_TOPPINGS < 6) {
    //         return {
    //           ...prevSelected,
    //           [meatId]: size,
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

    // }else{
      setSelectedMeat((prevSelected) => {
        // Toggle the selection
        if (prevSelected[meatId] === size) {
          const { [meatId]: _, ...rest } = prevSelected;
          return rest;
        } else {
          if (MAX_TOPPINGS < 11) {
            return {
              ...prevSelected,
              [meatId]: size,
            };
          } else {
            toast.info("You Can Add Only 6");
            return {
              ...prevSelected,
            };
          }
        }
      });
    // }
    
  };

  useEffect(() => {
    // console.log(selectedMeat, "selectedVeg");
  }, [selectedMeat]);

  const handleSave = () => {
    const selectedMeatData = Object.entries(selectedMeat).map(
      ([meatId, size]) => {
        const meat = meatTopData.find((s) => s._id === meatId);
        const price =
          size === "single"
            ? meat?.price[0]?.singlePrice
            : meat?.price[0]?.doublePrice;
        return {
          meatName: meat.name,
          _id: meat?._id,
          size,
          price,
        };
      }
    );

      dispatch(setToppings({ meat: selectedMeatData }));
  };
  useEffect(() => {
    handleSave();
  }, [selectedMeat]);

  return (
    <div className="">
      <h1 className="text-lg font-bold my-10">MEAT TOPPINGS</h1>
      <table className="min-w-full divide-y divide-gray-200 shadow-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
            MEAT TOPPING
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
          {meatTopData.map((meat) => (
            <tr key={meat._id} className="hover:bg-gray-100">
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-wrap text-sm font-medium text-gray-900">
                {meat.name}
              </td>
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-500">
                <div
                  className={`cursor-pointer px-2 md:px-4 py-2 rounded text-center ${
                    selectedMeat[meat._id] === "single"
                      ? "bg-red-800 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                  onClick={() => handleSelectionChange(meat._id, "single")}
                >
                  £ {calledBy === "half" ? (meat?.price[0]?.singlePrice)/2 : meat?.price[0]?.singlePrice}
                </div>
              </td>
              <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <div
                  className={`cursor-pointer px-2 md:px-4 py-2 rounded text-center ${
                    selectedMeat[meat._id] === "double"
                      ? "bg-green-800 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                  onClick={() => handleSelectionChange(meat._id, "double")}
                >
                  £ {calledBy === "half" ? (meat?.price[0]?.doublePrice)/2:meat?.price[0]?.doublePrice}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MeatToppings;
