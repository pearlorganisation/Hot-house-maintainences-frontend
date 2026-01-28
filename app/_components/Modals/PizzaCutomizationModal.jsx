import React, {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Sauce from "../customization/sauce/Sauce";
import Cheese from "../customization/cheese/Cheese";
import VegetarianToppings from "../customization/vegetarianToppings/VegetarianToppings";
import MeatToppings from "../customization/meatToppings/MeatToppings";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefaultPrice,
  setToppings,
} from "@/app/lib/features/cartSlice/cartSlice";
import { FaWindowClose } from "react-icons/fa";
import ToppingsPriceCard from "../TotalPriceCard/ToppingsPriceCard";
import { toast } from "sonner";
import { Toaster } from "sonner";

const PizzaCustomizationModal = forwardRef(
  (
    { pizzaIndex, pizzaData, setDealDataPizza, setViewButton, calledBy },
    ref
  ) => {
    const modalRef = useRef(null);

    const disableScroll = () => {
      document.body.classList.add("no-scroll");
    };

    const enableScroll = () => {
      document.body.classList.remove("no-scroll");
      setViewButton(false);
    };

    useImperativeHandle(ref, () => ({
      open() {
        if (modalRef.current) {
          modalRef.current.showModal(); // Use showModal() to open the dialog
          disableScroll();
        }
      },
      close() {
        if (modalRef.current) {
          modalRef.current.close(); // Use close() to close the dialog
          enableScroll();
        }
      },
    }));

    const { customizationData } = useSelector((state) => state.orderDetails);
    const { allToppings, defaultPrice } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const combineNames = () => {
      const items = [
        customizationData?.meatToppingsName,
        customizationData?.vegetarianToppingsName,
        customizationData?.cheeseName,
        customizationData?.sauceName,
      ].filter((item) => item && item.length > 0);

      // Join the items with a comma
      return items.join(", ");
    };

    const [basePrices, setBasePrices] = useState([]);
    const [cheesePrices, setCheesePrices] = useState([]);
    const [saucePrices, setSaucePrices] = useState([]);
    const [vegetarianToppingsPrices, setVegetarianToppingsPrices] = useState(
      []
    );
    const [meatToppingsPrices, setMeatToppingsPrices] = useState([]);

    const [selectedSizeId, setSelectedSizeId] = useState(
      customizationData?.priceSection.length === 1
        ? customizationData?.priceSection[0]?.size._id
        : customizationData?.selectedData
    );

    const [selectedBase, setSelectedBase] = useState(
      customizationData?.baseName || ""
    );


    useEffect(() => {
      if (customizationData) {
        const size = customizationData?.priceSection.find((item) => {
          return item?.size?._id === selectedSizeId;
        });
        dispatch(setToppings(size));
      }
    }, [selectedSizeId]);

    useEffect(() => {
      if (basePrices) {
        const base = basePrices?.find((item) => {
          return item?.name === selectedBase;
        });
        dispatch(setToppings({ base: base }));
      }
    }, [basePrices, selectedBase]);
    const handleRadioChange = async (e) => {
      const newSizeId = e.target.value;
      setSelectedSizeId(newSizeId);

      // Fetch new prices based on the selected size
      await fetchPricesForSelectedSize(newSizeId);
    };

    useEffect(() => {
      fetchPricesForSelectedSize(selectedSizeId);
      setSelectedBase(customizationData?.baseName);
      console.log(selectedSizeId);
    }, [selectedSizeId, customizationData]);

    useEffect(() => {
      setSelectedSizeId(customizationData?.selectedData);
    }, [customizationData]);

    // -------------------data fetching for price-----------------------

    const fetchPricesForSelectedSize = async (sizeId) => {
      // console.log(sizeId)
      try {
        if (sizeId) {
          const [
            baseResponse,
            sauceResponse,
            cheeseResponse,
            meatToppingsResponse,
            vegetarianToppingsResponse,
          ] = await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/base/price?sizeId=${sizeId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/sauce/price?sizeId=${sizeId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/cheese/price?sizeId=${sizeId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/meatToppings/price?sizeId=${sizeId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/vegetarianToppings/price?sizeId=${sizeId}`
            ),
          ]);

          const basePriceData = await baseResponse.json();

          const saucePriceData = await sauceResponse.json();

          const cheesePriceData = await cheeseResponse.json();

          const meatToppingsPriceData = await meatToppingsResponse.json();

          const vegetarianToppingsPriceData =
            await vegetarianToppingsResponse.json();

          setBasePrices(basePriceData.data);
          setMeatToppingsPrices(meatToppingsPriceData.data);
          setVegetarianToppingsPrices(vegetarianToppingsPriceData.data);
          setSaucePrices(saucePriceData.data);
          setCheesePrices(cheesePriceData.data);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    const handleCustomization = () => {
      const { cheese, sauce, meat, veg, size, base } = allToppings;
      const temp = [...[cheese, sauce, meat, veg].flat(), base, size];
      const uniqueId = temp
        .map((item) => {
          return item?._id.slice(-4) + item?.size?.slice(0, 2);
        })
        .join("");


      if((veg.length > 9 || meat.length > 9)||(meat.length + veg.length > 9))
      {
        toast.error("Please Select At Max 9 Toppings From Veg Or Meat Toppings");
        return;
      }

      setDealDataPizza((prevState) => {
        const temp = [...prevState];

        temp[pizzaIndex.current] = {
          ...pizzaData[pizzaIndex.current], 
          name: customizationData.name,
          id: temp[pizzaIndex.current].id + uniqueId,
          cheeseName: allToppings.cheese,
          meatToppingsName: allToppings.meat,
          sauceName: allToppings.sauce,
          vegetarianToppingsName: allToppings.veg,
          baseName: allToppings.base,
          pizzaPrice: Number(allToppings.totalPrice),
          pizzaExtraToppingPrice: Number(
            Math.max(0, (allToppings?.extraPrice - defaultPrice).toFixed(2))
          ),
        };
        return temp;
      });

      modalRef.current.close();
      enableScroll();
    };

    useEffect(() => {
      if (customizationData) {
        dispatch(
          setDefaultPrice({
            arr: [
              cheesePrices,
              saucePrices,
              vegetarianToppingsPrices,
              meatToppingsPrices,
            ].flat(),
            customizationData: customizationData,
          })
        );
      }
    }, [
      cheesePrices,
      saucePrices,
      vegetarianToppingsPrices,
      meatToppingsPrices,
      customizationData,
    ]);

    return (
      <div className="">
        <dialog
          ref={modalRef}
          id="static-modal"
          data-modal-backdrop="static"
          tabIndex="-1"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed z-50 outline-none  w-full md:inset-0 rounded-lg  h-[80vh]"
        >
          <Toaster position="top-right" richColors />
          <button
            className="fixed outline-none top-28 lg:top-20 right-8 md:p-4 z-[55]"
            onClick={() => {
              enableScroll();
              return modalRef.current.close();
            }}
          >
            <FaWindowClose
              size={30}
              className="text-red-800 hover:text-red-700"
            />
          </button>
          <div className="relative p-4 w-full  max-h-full">
            <div className="md:max-w-6xl  mx-auto p-4 bg-white shadow-md rounded-lg my-">
              <div className="flex flex-col md:flex-row ">
                <div className="flex-1">
                  <h1 className="text-4xl  text-gray-800">
                    {customizationData?.name}
                  </h1>
                  <p className="mt-2 text-gray-600">{combineNames()}</p>
                  <div className="mt-4">
                    <button
                      onClick={handleCustomization}
                      className="w-full px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      SIZESs
                    </h2>
                    <div className="mt-2 space-y-2">
                      {Array.isArray(customizationData?.priceSection) &&
                        customizationData?.priceSection.map((data, idx) => (
                          <label
                            key={idx}
                            className="inline-flex gap-2 items-center"
                          >
                            <input
                              type="radio"
                              className="form-radio"
                              name="size"
                              value={data?.size?._id}
                              checked={
                                selectedSizeId &&
                                selectedSizeId === data?.size?._id
                              }
                              onChange={handleRadioChange}
                            />

                            <span className="mr-4 text-gray-900 ">
                              {data?.size?.name}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      BASE
                    </h2>
                    <div className="mt-2 space-y-2">
                      {Array.isArray(basePrices) &&
                        basePrices?.map((base) => {
                          return (
                            <label
                              key={base?._id}
                              className="inline-flex gap-2 items-center"
                            >
                              <input
                                type="radio"
                                className="form-radio"
                                onChange={(e) => {
                                  const base = e.target.value;
                                  setSelectedBase(base);
                                }}
                                name="base"
                                value={base?.name}
                                checked={selectedBase === base?.name}
                              />
                              <span className="mr-4 text-gray-900">
                                {base?.name}
                                <>
                                  {" "}
                                  {base?.price[0]?.price > 0 && (
                                    <span className="bg-red-800 text-white rounded-lg px-1">
                                      + £{" "}
                                      {calledBy === "half"
                                        ? (base?.price[0]?.price / 2).toFixed(2)
                                        : base?.price[0]?.price}
                                    </span>
                                  )}
                                </>
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </div>

                  {/* SAUCE STARTS */}
                  <div>
                    <Sauce sauceData={saucePrices} calledBy={calledBy} />
                  </div>
                  {/* SAUCE ENDS */}

                  {/* CHEESE: STARTS */}
                  <Cheese cheeseData={cheesePrices} calledBy={calledBy} />
                  {/* CHEESE: ENDS */}

                  {/* VEGETARIAN TOPPINGS: STARTS */}
                  <VegetarianToppings
                    vegetarianTopData={vegetarianToppingsPrices}
                    calledBy={calledBy}
                  />
                  {/* VEGETARIAN TOPPINGS: ENDS */}

                  {/* MEAT TOPPINGS: STARTS */}
                  <MeatToppings
                    meatTopData={meatToppingsPrices}
                    calledBy={calledBy}
                  />
                  {/* MEAT TOPPINGS: ENDS */}

                  <div className="mt-4 mb-10">
                    <button
                        onClick={handleCustomization}
                      className="bg-green-800 hover:bg-green-700 text-white w-full px-10 p-2 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="hidden md:block md:ml-8">
                  <img
                    src={customizationData?.img}
                    alt="Hawaiian Pizza"
                    className="w-[360px] h-[360px] rounded-lg"
                  />
                  <p className="w-[360px] text-gray-600 ">{combineNames()}</p>
                </div>
              </div>
            </div>
          </div>
          <ToppingsPriceCard calledBy={calledBy} />
        </dialog>
      </div>
    );
  }
);

PizzaCustomizationModal.displayName = "PizzaCustomizationModal";

export default PizzaCustomizationModal;
