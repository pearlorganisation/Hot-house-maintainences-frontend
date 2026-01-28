import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";


const DessertCards = ({ data, idx }) => {
  // =-----------------------hooks--------------------------------
  const dispatch = useDispatch();
  const [selectedData, setSelectedData] = useState(null);
  return (
    <div
      className=" bg-white shadow-md rounded-lg max-w-[15rem] 2xl:max-w-xs w-full newshadow flex flex-col justify-between"
      key={idx}
    >
      <img
        src={data?.banner}
        alt={data?.dessertName}
        className="rounded-t-lg w-full object-contain h-52"
      />
     
        <h3 className="text-lg text-gray-800 font-semibold px-2 py-3">{data?.dessertName}</h3>
        <div>
          <select
            onChange={(Event) => {
              console.log(Event.target.value);
              setSelectedData(Event.target.value);
            }}
            name="pizzas"
            id="pizzas"
            className="border p-2 w-full rounded-t-md text-gray-500"
          >
            <option>£ {data?.price}</option>
          </select>
          <div className="relative flex items-center ">
            <button
              onClick={() => {
                dispatch(
                  addToCart({
                    _id:data?._id,
                    name: data?.dessertName,
                    img: data?.banner,
                    size: selectedData || data?.price,
                    id: data?._id,
                    quantity: 1,
                    price: Number(selectedData || data?.price),
                    totalSum: Number(selectedData || data?.price),
                  })
                );
              }}
              data-modal-target="popup-modal"
              data-modal-toggle="popup-modal"
              data-modal-hide="popup-modal"
              className=" text-white text-center bg-green-600 hover:bg-green-700 flex p-2 items-center justify-center w-full"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
        {/* <p
          className={`text-red-600 font-bold ${
            isAddClicked && !selectedData ? "block" : "hidden"
          } `}
        >
          please select size first
        </p> */}
 
 
      </div>

  );
};

export default DessertCards;
