"use client";
import Cheese from "@/app/_components/customization/cheese/Cheese";
import MeatToppings from "@/app/_components/customization/meatToppings/MeatToppings";
import Sauce from "@/app/_components/customization/sauce/Sauce";
import VegetarianToppings from "@/app/_components/customization/vegetarianToppings/VegetarianToppings";
import TotalPriceCard from "@/app/_components/TotalPriceCard/TotalPriceCard";
import { addToCart, clearSet, setDefaultPrice, setToppings } from "@/app/lib/features/cartSlice/cartSlice";
import { useRouter, useSearchParams  } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";


const Product = () => {


  const { customizationData  } = useSelector((state) => state.orderDetails);
  const { allToppings ,createYourOwnPizzaMAX_TOPPINGS } = useSelector(state => state.cart)
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const customizationPizzaOpenedBy =  searchParams.get('calledBy');
  console.log("calledBy", searchParams.get('calledBy'));

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
  const [vegetarianToppingsPrices, setVegetarianToppingsPrices] = useState([]);
  const [meatToppingsPrices, setMeatToppingsPrices] = useState([]);

  // console.log(saucePrices)
  // console.log(customizationData?.sauceName)
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
      const size = customizationData?.priceSection.find(item => {
        return item?.size?._id === selectedSizeId
      })
      dispatch(setToppings(size))
    }
  }, [selectedSizeId]);

  useEffect(() => {
    if (basePrices) {
      const base = basePrices?.find(item => {
        return item?.name === selectedBase
      })
      dispatch(setToppings({ base: base }))
    }
  }, [basePrices, selectedBase]);
  const handleRadioChange = async (e) => {
    const newSizeId = e.target.value;
    setSelectedSizeId(newSizeId);
    dispatch(clearSet());


    // Fetch new prices based on the selected size
    await fetchPricesForSelectedSize(newSizeId);
  };

  useEffect(() => {
    fetchPricesForSelectedSize(selectedSizeId);
    // console.log(selectedSizeId)
  }, [selectedSizeId]);

  useEffect(() => {
    setSelectedBase(customizationData?.baseName)
    setSelectedSizeId(customizationData?.selectedData);
  }, [customizationData]);

  useEffect(()=>{
    dispatch(clearSet())
  },[])





  // -------------------data fetching for price-----------------------

  const fetchPricesForSelectedSize = async (sizeId) => {
    // console.log(sizeId)
    try {
      if (sizeId) {

        const [baseResponse, sauceResponse, cheeseResponse, meatToppingsResponse, vegetarianToppingsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/base/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/sauce/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/cheese/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/meatToppings/price?sizeId=${sizeId}`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/food/customization/vegetarianToppings/price?sizeId=${sizeId}`),
        ]);

        const basePriceData = await baseResponse.json();

        const saucePriceData = await sauceResponse.json();

        const cheesePriceData = await cheeseResponse.json();

        const meatToppingsPriceData = await meatToppingsResponse.json();

        const vegetarianToppingsPriceData = await vegetarianToppingsResponse.json();



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
    // console.log("createYourOwnPizzaMAX_TOPPINGS",createYourOwnPizzaMAX_TOPPINGS);

    if(createYourOwnPizzaMAX_TOPPINGS > 6)
      {
        toast.error("You can only add upto maximum 6 Toppings !!");
        return;
      }
    
    const { cheese, sauce, meat, veg, size, base,_id } = allToppings

    if(((veg.length > 9 || meat.length > 9)||(meat.length + veg.length > 9)) && customizationPizzaOpenedBy !== "createYourOwnPizza")
      {

        toast.error("Please Select At Max 9 Toppings From Veg Or Meat Toppings");
        return;
      }

    const temp = [...[cheese, sauce, meat, veg].flat(), base, size]
    let uniqueId = temp.map(item => {
      return _id + item._id.slice(-4) + item?.size?.slice(0, 2)
    }).join('')
    console.log(uniqueId, "uniqueId")
    console.log("meat.length + veg.length",((meat.length + veg.length) > 5 )&&(customizationPizzaOpenedBy === "createYourOwnPizza"));

    if(customizationPizzaOpenedBy === "createYourOwnPizza")
    {
 
      uniqueId+= customizationData.id;
    }

    
    if(((meat.length + veg.length) < 4 )&&(customizationPizzaOpenedBy === "createYourOwnPizza"))
    {
      toast.error("Select At Least any 4 Topping !!");
      return;
    }


    dispatch(addToCart({
      _id:customizationPizzaOpenedBy == "createYourOwnPizza" ? "CREATE_YOUR_OWN_PIZZA":(customizationData?.id?customizationData?.id:null),
      name: customizationData?.name, img: customizationData?.img, id: uniqueId, quantity: 1, price: allToppings?.totalPrice, totalSum: allToppings?.totalPrice,
      discount: Number(((allToppings?.totalPrice * 100) * ((process.env.NEXT_PUBLIC_COLLECTION_DISCOUNT_PERCENTAGE || 20) / 100 )) / 100).toFixed(2),
      allToppings: allToppings
    }))

    // router.push("/order/cart");
    router.push("/menu/pizzas");

  }
  useEffect(() => {
    dispatch(setDefaultPrice({ arr: [cheesePrices, saucePrices, vegetarianToppingsPrices, meatToppingsPrices].flat(), customizationData: customizationData||{}}))
  }, [cheesePrices, saucePrices, vegetarianToppingsPrices, meatToppingsPrices, customizationData])






  return (
    <>
      <div className="md:max-w-6xl  mx-auto p-4 bg-white shadow-md rounded-lg my-">
        <div className="flex flex-col md:flex-row ">
          <div className="flex-1">
            <h1 className="text-4xl  text-gray-800">
              {customizationData?.name}
              
            </h1>
            <p className="mt-2 text-gray-600">{combineNames()}</p>
            <div className="mt-4">
              <button onClick={handleCustomization} className="w-full px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-lg">
                Save
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">SIZES</h2>
              <div className="mt-2 space-y-2">
                {Array.isArray(customizationData?.priceSection) &&
                  customizationData?.priceSection.map((data, idx) => (
                    <label key={idx} className="inline-flex gap-2 items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="size"
                        value={data?.size?._id}
                        checked={
                          selectedSizeId && selectedSizeId === data?.size?._id
                        }
                        onChange={handleRadioChange}
                      />

                      <span className="mr-4 text-gray-900 ">{data?.size?.name}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">BASE</h2>
              <div className="mt-2 space-y-2">
                {Array.isArray(basePrices) &&
                  basePrices?.map((base) => (
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
                              + £ {base?.price[0]?.price}
                            </span>
                          )}
                        </>
                      </span>
                    </label>
                  ))}
              </div>
            </div>



            {/* SAUCE STARTS */}
            <div>
              <Sauce sauceData={saucePrices} />
            </div>
            {/* SAUCE ENDS */}

            {/* CHEESE: STARTS */}
            <Cheese cheeseData={cheesePrices} calledBy={customizationPizzaOpenedBy ?? ""}/>
            {/* CHEESE: ENDS */}

            {/* VEGETARIAN TOPPINGS: STARTS */}
            <VegetarianToppings calledBy={customizationPizzaOpenedBy} vegetarianTopData={vegetarianToppingsPrices} />
            {/* VEGETARIAN TOPPINGS: ENDS */}

            {/* MEAT TOPPINGS: STARTS */}
            <MeatToppings meatTopData={meatToppingsPrices} calledBy={customizationPizzaOpenedBy} />
            {/* MEAT TOPPINGS: ENDS */}




            <div className="mt-4">
              <button onClick={handleCustomization} className="bg-green-800 hover:bg-green-700 text-white w-full px-10 p-2 rounded">
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
      <TotalPriceCard />
    </>
  );
};

export default Product;
