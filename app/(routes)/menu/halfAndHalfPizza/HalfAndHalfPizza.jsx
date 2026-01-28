"use client";
import Select from "react-select";
import React, { memo, useEffect, useReducer, useRef, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { useDispatch } from "react-redux";
import { getCustomizationDetails } from "@/app/lib/features/orderDetails/orderDetailsslice";
import PizzaCustomizationModal from "@/app/_components/Modals/PizzaCutomizationModal";
import { toast } from "sonner";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";
import { useRouter } from "next/navigation";
import DealPriceCard from "@/app/_components/TotalPriceCard/DealPriceCard";

const HalfAndHalfPizza = () => {
  const router = useRouter();
  let currentPizzaDetails;
  const halfAndHalfDataRef = useRef(new Array(2));
  const [pizzaData, setPizzaData] = useState(new Array(2));
  const [pizzaDataForSelect, setPizzaDataForSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const modalRef = useRef();
  const currentIndex = useRef(null);
  const [extraPrice, setExtraPrice] = useState(0);
  let pizzaDataMapRef = useRef(new Map());
  let pizzaSizeMapRef = useRef(new Map());
  const [pizzaCurrentSize, setPizzaCurrentSize] = useState(null);
  const dispatch = useDispatch();
  const [viewButton, setViewButton] = useState(false);
  const [sizeData, setSizeData] = useState(null);
  const [isTrue, setIsTrue] = useState(false);
  const [totalBasePrice, setTotalBasePrice] = useState(0);
  async function getPizzas() {
    setIsLoading(true);

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/pizza`,
      {
        method: "GET",
      }
    );
    setIsLoading(false);

    const newData = await data.json();
    setPizzaDataForSelect(
      newData?.data?.map((el) => {
        if (pizzaDataMapRef) pizzaDataMapRef?.current.set(el._id, el);
        return {
          label: el.pizzaName,
          value: el._id,
        };
      })
    );

    const priceSectionForSizes = pizzaDataMapRef?.current
      ?.values()
      .next().value;

    priceSectionForSizes?.priceSection?.forEach((element) => {
      pizzaSizeMapRef?.current.set(element.size._id, element);
    });
  }

  async function getSizes() {
    setIsLoading(true);

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/size`,
      {
        method: "GET",
      }
    );
    setIsLoading(false);
    const newData = await data.json();

    let sizeOptions = [];

    newData?.data?.forEach((element) => {
      const tempData = { label: element.name, value: element._id };
      sizeOptions.push(tempData);
    });

    setSizeData(sizeOptions);
  }

  function handlePizzaDataSubmissionToRedux(index) {
    currentPizzaDetails = pizzaDataMapRef.current.get(
      halfAndHalfDataRef.current[index].value
    );
    setPizzaData((prevState) => {
      prevState[index] = currentPizzaDetails;
      return prevState;
    });

    console.log(currentPizzaDetails, "currentPizzaDetails");
    console.log(
      pizzaSizeMapRef?.current.get(pizzaCurrentSize?.value),
      "currentPizzaDetails"
    );

    dispatch(
      getCustomizationDetails({
        name: currentPizzaDetails.pizzaName,
        img: currentPizzaDetails.banner,
        id: currentPizzaDetails._id,
        sauceName: currentPizzaDetails.sauceName,
        meatName: currentPizzaDetails.meatToppingsName,
        cheeseName: currentPizzaDetails.cheeseName,
        baseName: currentPizzaDetails.baseName,
        vegetarianToppingsName: currentPizzaDetails.vegetarianToppingsName,
        priceSection: [pizzaSizeMapRef?.current.get(pizzaCurrentSize?.value)], //here we need price section object array ok
        selectedData: pizzaSizeMapRef?.current.get(pizzaCurrentSize?.value)
          ?.size?._id,
      })
    );
  }

  function handleAddToCart() {
    console.log(
      pizzaData.every((item) => item === undefined),
      pizzaData
    );
    if (pizzaData[0] === undefined || pizzaData[1] === undefined) {
      toast.error("Please Fill All Fields !!");
      return;
    }
    const pizzaOne = pizzaData[0];
    const pizzaTwo = pizzaData[1];

    delete pizzaOne?.priceSection;
    delete pizzaOne?.filter;
    delete pizzaOne?.createdAt;
    delete pizzaOne?.updatedAt;
    delete pizzaTwo?.priceSection;
    delete pizzaTwo?.createdAt;
    delete pizzaTwo?.updatedAt;
    delete pizzaTwo?.filter;

    pizzaOne.label = pizzaOne.pizzaName;
    pizzaTwo.label = pizzaTwo.pizzaName;
    const submitData = [pizzaOne, pizzaTwo];
   
    submitData.id = pizzaOne.id + pizzaTwo.id;

    let basePriceForPizza =
      pizzaSizeMapRef?.current?.get(pizzaCurrentSize?.value)?.price || 0;

    if (isNaN(basePriceForPizza)) {
      basePriceForPizza = 0;
    } else {
      basePriceForPizza / 2;
    }

    console.log(extraPrice , basePriceForPizza , totalBasePrice)

    dispatch(
      addToCart({
        name: "Half & Half Pizza",
        img: submitData[0].banner,
        _id:"HALFNHALF",
        size:
          pizzaSizeMapRef?.current?.get(pizzaCurrentSize?.value).size.name ||
          "Check Size Issue in add to cart reducer",
        id:
          (submitData?.id || "half") +
          pizzaSizeMapRef?.current?.get(pizzaCurrentSize?.value).size.name +
          submitData.reduce((acc, currEle) => acc + currEle.id, ""),
        quantity: 1,
        price: Number( extraPrice + basePriceForPizza + totalBasePrice + 1).toFixed(2),
        totalSum: Number(
          extraPrice + basePriceForPizza + totalBasePrice + 1
        ).toFixed(2),
        dealsData: submitData,
        discount: Number((((extraPrice + basePriceForPizza + totalBasePrice + 1) * 100) * ((process.env.NEXT_PUBLIC_COLLECTION_DISCOUNT_PERCENTAGE || 20) / 100 )) / 100).toFixed(2),
        
      })
    );

    // router.push("/order/cart");
    router.push("/menu/pizzas");
  }

  const handleOpeningModal = () => {
    if (modalRef.current) {
      modalRef.current.open();
      setViewButton(true);
    }
  };

  useEffect(() => {
    getPizzas();
    getSizes();
  }, []);

  useEffect(() => {
    let currExtraPrice = 0;

    let totalBase = 0;
    let totalPizzaPrice = 0;
    pizzaData.forEach((el) => {
      currExtraPrice += el?.pizzaExtraToppingPrice || 0;
      totalBase += el?.basePrice || 0;
      totalPizzaPrice += el?.pizzaSpecialPrice || 0;
    });

    totalPizzaPrice = totalPizzaPrice - totalBase;
    totalPizzaPrice = totalPizzaPrice / 2;
    setTotalBasePrice(totalPizzaPrice);
    currExtraPrice = currExtraPrice / 2;
    setExtraPrice(Number(currExtraPrice.toFixed(2) || 0));
  }, [pizzaData]);

  return (
    <>
      <PizzaCustomizationModal
        calledBy="half"
        ref={modalRef}
        pizzaIndex={currentIndex}
        pizzaData={pizzaData}
        setViewButton={setViewButton}
        setDealDataPizza={setPizzaData}
      />
      <div className="p-3 md:p-8 h-screen">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800">
            Half And Half Pizza
          </h1>
        </div>

        <div className="mt-5">
          <h1>Select Pizza Size</h1>
          {pizzaData && (pizzaDataMapRef?.current?.size > 0) && (
            <Select
              placeholder="Select Size"
              options={sizeData}
              onChange={(e) => {
                setPizzaCurrentSize(e);
                setIsTrue(true);
              }}
            />
          )}
        </div>

        {isTrue && (
          <div className="md:grid grid-cols-2  gap-8 md:p-10">
            <div className="pt-10 md:pt-0 md:p-2">
              <p className="text-xl md:text-2xl text-red-800 font-bold ">
                Pizza First Half
              </p>

              <div className="grid grid-cols-[20%_auto] md:grid-cols-[10%_auto] pt-2 items-center">
                {
                  <button
                    onClick={() => {
                      if (pizzaData[0]) {
                        currentIndex.current = 0;
                        handlePizzaDataSubmissionToRedux(0);
                        handleOpeningModal();
                      } else {
                        toast.error("Please Select First Half Pizza !!");
                      }
                    }}
                  >
                    <MdEditSquare
                      size={30}
                      className="text-red-800 hover:text-red-700"
                    />
                  </button>
                }
                <div>
                  {pizzaDataForSelect && pizzaDataMapRef.current && (
                    <Select
                      options={pizzaDataForSelect}
                      name="pizzaOne"
                      placeholder="Choose First Pizza"
                      onChange={(e) => {
                        halfAndHalfDataRef.current[0] = e;
                        setPizzaData((prev) => {
                          const temp = [...prev];
                          const mrpOfPizza = pizzaDataMapRef.current
                            .get(e.value)
                            ?.priceSection.find(
                              (el) => el.size.name == pizzaCurrentSize?.label
                            );
                          const tempDataPizza = pizzaDataMapRef.current.get(
                            e.value
                          );
                          tempDataPizza.basePrice = mrpOfPizza?.size?.basePrice;
                          tempDataPizza.pizzaSpecialPrice = mrpOfPizza.price;
                          temp[0] = tempDataPizza;
                          return temp;
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-5 md:pt-0 md:p-2">
              <p className="text-xl md:text-2xl text-red-800 font-bold ">
                Pizza Second Half
              </p>
              <div className="grid grid-cols-[20%_auto] md:grid-cols-[10%_auto] pt-2  items-center">
                <button
                  onClick={() => {
                    if (pizzaData[1]) {
                      currentIndex.current = 1;
                      handlePizzaDataSubmissionToRedux(1);
                      handleOpeningModal();
                    } else {
                      toast.error("Please Select Second Half Pizza !!");
                    }
                  }}
                >
                  <MdEditSquare
                    size={30}
                    className="text-red-800 hover:text-red-700"
                  />
                </button>
                <div>
                  {pizzaDataForSelect && pizzaDataMapRef.current && (
                    <Select
                      options={pizzaDataForSelect}
                      placeholder="Choose Second Pizza"
                      onChange={(e) => {
                        console.log(e);
                        halfAndHalfDataRef.current[1] = e;
                        setPizzaData((prev) => {
                          const temp = [...prev];
                          const mrpOfPizza = pizzaDataMapRef.current
                            .get(e.value)
                            ?.priceSection.find(
                              (el) => el.size.name == pizzaCurrentSize?.label
                            );
                          const tempDataPizza = pizzaDataMapRef.current.get(
                            e.value
                          );
                          tempDataPizza.basePrice = mrpOfPizza?.size?.basePrice;
                          tempDataPizza.pizzaSpecialPrice = mrpOfPizza.price;

                          temp[1] = tempDataPizza;
                          return temp;
                        });
                      }}
                      name="pizzaTwo"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isTrue && (
          <div className="flex justify-center items-center pt-10 md:py-2">
            <button
              onClick={handleAddToCart}
              className="text-xl bg-green-700 hover:bg-green-600 rounded-md px-6 py-3 font-bold text-white"
            >
              Add to Cart
            </button>
          </div>
        )}

        {pizzaData && pizzaSizeMapRef?.current && pizzaCurrentSize && (
          <DealPriceCard
            calledBy="half"
            specialPizzaPrice={totalBasePrice}
            dealPrice={
              pizzaSizeMapRef?.current?.get(pizzaCurrentSize?.value)?.price || 0
            }
            extraPrice={extraPrice}
          />
        )}
      </div>
    </>
  );
};

export default HalfAndHalfPizza;
