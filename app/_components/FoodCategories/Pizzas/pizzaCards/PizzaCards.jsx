import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";
import Link from "next/link";
import AddedToCartModel from "@/app/_components/Modals/AddedToCartModel";
import { getCustomizationDetails } from "@/app/lib/features/orderDetails/orderDetailsslice";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

const PizzaCards = ({ data, idx }) => {
  const dispatch = useDispatch();
  const selectedSizeId =
    Array.isArray(data?.priceSection) && data?.priceSection[0]?.size?._id;
  const [selectedData, setSelectedData] = useState(selectedSizeId);
  const [uniquePizzaId, setUniquePizzaId] = useState(
    selectedSizeId + data?._id
  );

  const selectedLabelName =
    Array.isArray(data?.priceSection) &&
    `${data?.priceSection[0]?.size?.name}-${data?.priceSection[0]?.price}`;
  const [selectedLabel, setSelectedLabel] = useState(selectedLabelName);

  const handleChange = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const value = event.target.value;
    const label = selectedOption.getAttribute("data-label");
    console.log(event.target.value);
    setUniquePizzaId(event.target.value + data?._id);

    setSelectedData(value);
    setSelectedLabel(label);
  };

  const combineNames = () => {
    const items = [
      data?.meatToppingsName,
      data?.vegetarianToppingsName,
      data?.cheeseName,
      data?.sauceName,
    ]
      .filter((item) => item && item.length > 0)
      .flat();

    // Join the items with ", " but replace regular spaces with non-breaking spaces
    return items.map((item) => item.replace(/ /g, "\u00A0")).join(", ");
  };


  // console.log('my data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', data?.filter?.filter.toUpperCase())

  return (
    <div
      className="flex relative flex-col justify-between bg-white rounded-md max-w-[17rem]  2xl:max-w-xs w-full newshadow mb-10 "
      key={idx}
    >
      <div className="">
        <img
          src={data?.banner}
          alt={data?.pizzaName}
          className="h-52 w-full rounded-t-md object-cover"
        />
      </div>
      <div className="flex  absolute justify-end  w-full">
        {" "}
        <div
          className={` rounded-md  w-6 h-6 border-2 flex justify-center items-center bg-white ${
            data?.filter?.filter === ("Vegetarian" || "VEGETARIAN")
              ? "border-green-600 "
              : "border-red-800"
          }`}
        >
          <RiCheckboxBlankCircleFill
            size={20}
            className={`${
              data?.filter?.filter === ("Vegetarian" || "VEGETARIAN")
                ? "text-green-600 "
                : "text-red-800"
            }`}
          />
        </div>
      </div>
      <div className=" h-full px-2">
        <div className="mt-3">
          <h3 className="text-xl font-semibold mb-1 ">{data?.pizzaName} <div className="text-red-800">(20% Off on Collection)</div></h3>
          <p className="text-sm font-semibold text-gray-500 mb-4 whitespace-wrap overflow-hidden ">
            {combineNames()}
          </p>
        </div>
      </div>

      <div className="mt-3 mb-1 ">
        <div className="">
          <select
            onChange={handleChange}
            value={selectedData}
            name="pizzas"
            id="pizzas"
            className="border-2 mx-auto p-2 w-full"
          >
            {data?.priceSection.map((data, idx) => {
              return (
                <option
                  key={idx}
                  value={data?.size?._id}
                  data-label={`${data?.size?.name}-${data?.price}`}
                >
                  {`${data?.size?.name} £ ${data?.price}`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-3 items-center mt-2 px-2">
          <Link
            onClick={() => {
              selectedData &&
                dispatch(
                  getCustomizationDetails({
                    name: data?.pizzaName,
                    img: data?.banner,
                    priceSection: data?.priceSection,
                    id: data?._id,
                    sauceName: data?.sauceName,
                    cheeseName: data?.cheeseName,
                    vegetarianToppingsName: data?.vegetarianToppingsName,
                    meatToppingsName: data?.meatToppingsName,
                    baseName: data?.baseName,
                    selectedData: selectedData,
                  })
                );

            }}
            href={`/menu/product/customisePizza`}
          >
            <TbEdit size={30} className="text-slate-800 hover:text-red-800" />
          </Link>
          <div className="bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center w-full">
            <button
              onClick={() => {
                selectedData &&
                  dispatch(
                    addToCart({
                      _id: data?._id,
                      name: data?.pizzaName,
                      img: data?.banner,
                      size: selectedLabel,
                      id: uniquePizzaId,
                      quantity: 1,
                      price: Number(selectedLabel.split("-")[1]),
                      totalSum: Number(selectedLabel.split("-")[1]),
                      discount: Number(((Number(selectedLabel.split("-")[1]) * 100) * ((process.env.NEXT_PUBLIC_COLLECTION_DISCOUNT_PERCENTAGE || 20) / 100 )) / 100).toFixed(2),
                      // discount: (Number(selectedLabel.split("-")[1]) * 0.2).toFixed(2),
                    })
                  );
              }}
              className="text-center rounded-lg w-full p-2 text-white"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCards;
