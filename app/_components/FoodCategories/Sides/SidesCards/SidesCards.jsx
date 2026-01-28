import React, { useState } from "react";
import { PiNotePencilFill } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";
import Link from "next/link";
import AddedToCartModel from "@/app/_components/Modals/AddedToCartModel";

const SidesCards = ({ data, dummyData, idx }) => {
  // =-----------------------hooks--------------------------------
  const dispatch = useDispatch();
  const [selectedData, setSelectedData] = useState(null);
  const [isAddClicked, setIsAddClicked] = useState(false);
  return (
    <div
      className=" bg-white shadow-md rounded-md max-w-[15rem] 2xl:max-w-xs w-full newshadow mb-10 flex flex-col justify-between"
      key={idx}
    >
      <img
        src={data?.banner}
        alt={data?.sideName}
        className="rounded-t-md w-full h-44 object-cover"
      />
        <h3 className="text-lg font-semibold text-gray-800 px-2 py-3">{data?.sideName}</h3>
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
          <div className="bg-green-600 hover:bg-green-700 flex gap-2  justify-center w-full">
            <button
              onClick={() => {
                dispatch(
                  addToCart({
                    _id:data?._id,
                    name: data?.sideName,
                    img: data?.banner,
                    size: selectedData || data?.price,
                    id: data?._id,
                    quantity: 1,
                    price: Number(selectedData || data?.price),
                    totalSum: Number(selectedData || data?.price)
                  })
                );
              }}
              data-modal-target="popup-modal"
              data-modal-toggle="popup-modal"
              data-modal-hide="popup-modal"
              className="text-center p-2 text-white w-full "
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

export default SidesCards;
