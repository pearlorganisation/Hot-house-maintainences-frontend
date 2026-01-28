import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";

const dipssCard = ({ data }) => {
  const dispatch = useDispatch();

  // State to manage selected dips type and price
  const [selecteddips, setSelecteddips] = useState(
    `${data.price[0].dipsType}-${data.price[0].price}`
  );

  // Function to handle adding to cart
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id:data?._id,
        name: data?.dips,
        img: data.banner,
        size: selecteddips,
        id: data?._id,
        quantity: 1,
        price: Number(selecteddips.split('-')[1]),
        totalSum: Number(selecteddips.split('-')[1])
      })
    );
  };

  return (
    <div className="bg-white shadow-md rounded-md max-w-[15rem] w-full newshadow flex flex-col justify-between">
      <img
        src={data.banner}
        alt={data.dips}
        className="rounded-t-md object-cover w-full h-44"
      />
 
        <h2 className="text-lg text-gray-800 font-semibold p-3">{data.dips}</h2>
        <div >
        
            <select
              value={selecteddips}
              onChange={(event) => setSelecteddips(event.target.value)}
              className="border  p-2 w-full rounded-t-md text-gray-500" 
             
            >
              {data.price.map((dips) => (
                <option key={dips._id} value={`${dips.dipsType}-${dips.price}`}>
                  {`${dips.dipsType} £ ${dips.price}`}
                </option>
              ))}
            </select>
         
          <div
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
            onClick={handleAddToCart}
          >
            <p className="text-center p-2 text-white">Add</p>
          </div>
        </div>
      </div>

  );
};

export default dipssCard;
