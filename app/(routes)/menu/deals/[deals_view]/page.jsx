"use client";
import { addToCart } from "@/app/lib/features/cartSlice/cartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect,  useRef, useState } from "react";
import { useDispatch, useSelector  } from "react-redux";
import Select from "react-select";
import { toast } from "sonner";
import { getCustomizationDetails } from "@/app/lib/features/orderDetails/orderDetailsslice";
import { MdEditSquare } from "react-icons/md";
import PizzaCustomizationModal from "@/app/_components/Modals/PizzaCutomizationModal";
import DealPriceCard from "@/app/_components/TotalPriceCard/DealPriceCard";
import Image from "next/image";
import moment from "moment-timezone";

async function getData(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/deals/${id}`
    );
    const data = await res.json();
    return data.data; // Assuming `data` has a `data` property containing the actual deals
  } catch (err) {
    console.log("Error Occurred", err);
    return null;
  }
}
const Page = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
    const todaysDay = moment()?.tz(moment?.tz?.guess())?.format('dddd');
  const currTime = moment(moment()?.format('HH:mm'), 'HH:mm');


    
       
 

  const [dealViewData, setDealView] = useState(null);
  
  const dispatch = useDispatch();
  
  const cardId = searchParams.get("card_id");
  
  const sizeId = searchParams.get("size_id");
  
  const sizeDetailRef = useRef(null);

  const [specialPizzaPrice,setSpecialPizzaPrice] = useState(0); 




  const {customizationData} = useSelector((state)=> state.orderDetails);
  
  const [dealDataPizza, setDealDataPizza] = useState([]);
  
  const [dealDataDrinks, setDealDataDrinks] = useState([]);
  const [viewButton, setViewButton] = useState(false);
  
  const modalRef = useRef();
  
  const pizzaDataIndex = useRef(null);

  const [extraPrice ,setExtraPrice] = useState(0);
   


  const handleOpeningModal = () => {
    if (modalRef.current) {
      modalRef.current.open();
      setViewButton(true)
    }
  };




if (dealViewData &&dealViewData?.isByOneGetPizza && dealViewData?.isByOneGetPizzaStartTime && dealViewData?.isByOneGetPizzaEndTime) {
      const startTime = moment(dealViewData?.isByOneGetPizzaStartTime, "HH:mm");
      const endTime = moment(dealViewData?.isByOneGetPizzaEndTime, "HH:mm");


      if ((currTime.isAfter(startTime)) && (currTime.isBefore(endTime))) {
         // Exclude if outside the time range
          
      }
      else 
        {
          toast.error("Deal Not Available Now !!")
          router.push('/')
        }
    }

  


  useEffect(() => {
    if (dealViewData) {
      setDealDataPizza(new Array(dealViewData?.chooseItems?.pizza));
      setDealDataDrinks(new Array(dealViewData?.chooseItems?.drinks));
      sizeDetailRef.current = dealViewData?.sizes.find(
        (el) => el._id === sizeId
      );
      pizzaDataIndex.current = 0; 
    }
  }, [dealViewData]);

  function handleDataSubmission() {
    const submitData = [
      ...dealDataPizza,
      ...dealDataDrinks,
      ...dealViewData?.defaultItems.map((el) => {
        return {
          label: el,
        };
      }),
    ];
     


    if (
      dealViewData &&
      submitData.every((item) => item !== null && item !== undefined) && (dealDataPizza.length === dealViewData.chooseItems.pizzas)
    ) {



      

      dispatch(
        addToCart({
          name: dealViewData?.title,
          img: dealViewData?.banner,
          size: sizeDetailRef.current.size,
          _id:dealViewData?._id,
          id:  dealViewData?._id + dealDataPizza.reduce((acc,currEle)=> acc + currEle.id,''),
          quantity: 1,
          price : Number(extraPrice+sizeDetailRef.current.price+Number(specialPizzaPrice)).toFixed(2),
          totalSum :Number(extraPrice+sizeDetailRef.current.price+Number(specialPizzaPrice)).toFixed(2),
          dealsData:[...submitData],
          isByOneGetPizza:dealViewData?.isByOneGetPizza||false,
          isByOneGetPizzaStartTime:dealViewData?.isByOneGetPizzaStartTime||null,
          isByOneGetPizzaEndTime:dealViewData?.isByOneGetPizzaEndTime||null,
          availabilityOfDeal:dealViewData?.availabilityOfDeal||null,
          collectionOnlyDeal:dealViewData?.collectionOnlyDeal,
        }));
      // router.push("/order/cart");

      router.push("/menu/deals");


      
    } else {
      toast.error("Fill All Fields !!");
    }
  }




  useEffect(() => {
    async function fetchData() {
      const data = await getData(cardId);


      if(data && data?.availabilityOfDeal?.length > 0 && data?.availabilityOfDeal?.find((el)=> (el == todaysDay?.toUpperCase())))
        {
    
          const startTime = moment((data?.isByOneGetPizzaStartTime||'05:00'), "HH:mm");
          const endTime = moment((data?.isByOneGetPizzaEndTime||'18:00'), "HH:mm");
    
          if ((currTime.isBefore(startTime)) || currentMoment.isAfter(endTime)) {
            router.push("/deals");
          }
    
    
          router.push("/deals");
    
        }

      setDealView(data);
    }
    fetchData();
  }, []);

  const pizzaCount = dealViewData?.chooseItems?.pizzas || 0;
  const pizzas = new Array(pizzaCount).fill(null);

  const drinkCount = dealViewData?.chooseItems?.drinks || 0;
  const drinks = new Array(drinkCount).fill(null);

  useEffect(()=>{
    
    if (!dealDataPizza.every((el) => el === undefined)) {
      const { totalPizzaPrice, totalSumSpecialPizzaPrice } = dealDataPizza.reduce(
        (acc, el) => {
          acc.totalPizzaPrice += el?.pizzaPriceExtra || 0;
          acc.totalSumSpecialPizzaPrice += el?.extraSpecialPrice || 0;
          return acc;
        },
        { totalPizzaPrice: 0, totalSumSpecialPizzaPrice: 0 }
      );
       
      setSpecialPizzaPrice((Math.abs(totalPizzaPrice - totalSumSpecialPizzaPrice)).toFixed(2));

   }
    const currExtraPrice = dealDataPizza?.reduce((acc, currVal) => {
      return acc + (currVal?.pizzaExtraToppingPrice !== undefined ? currVal?.pizzaExtraToppingPrice : 0);
    }, 0)||0;

  setExtraPrice(currExtraPrice);
  },[dealDataPizza]);
  

  return (
    <>
    <PizzaCustomizationModal  calledBy={""} ref={modalRef} pizzaIndex = {pizzaDataIndex} pizzaData = {dealDataPizza} setViewButton={setViewButton}  setDealDataPizza={setDealDataPizza} />
    <div className="">
      {dealViewData ? (
        <div>
          <div className="text-2xl md:text-5xl md:p-10 text-slate-800  md:px-20">
            <img
              src={dealViewData.banner}
              className="md:hidden mx-auto w-full h-full  object-cover "
              alt="Deal Banner"
            />
            <div className="mt-5 md:mt-0 flex gap-4 mx-3 justify-between items-center">
              <p className="text-red-800 font-bold">{dealViewData.title}</p>

              <p className="text-green-700 font-bold">
                £{dealViewData?.sizes?.find((el) => el._id === sizeId)?.price}
              </p>
            </div>
          </div>
          <div className="flex justify-center md:justify-between md:px-32 items-center pt-6 md:pt-0 ">
            <div>
              {pizzaCount > 0 && (
                <div>
                  <h1 className="text-lg md:text-2xl font-medium mb-4">
                    Choose Your Pizza
                  </h1>
                 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

                    {pizzas.map((_, index) => (
                      <div className="flex items-center  gap-2">
                       {Array.isArray(dealDataPizza) && dealDataPizza[index] && (
                        <button
                          onClick={() => {
                            pizzaDataIndex.current = index;    
                            handleOpeningModal();
                            dispatch(
                              getCustomizationDetails({
                                name: dealDataPizza[index]?.label,
                                img: dealDataPizza[index]?.banner,
                                priceSection:
                                  dealViewData.sizes.length === 1
                                    ? dealDataPizza[index].priceSection.filter(
                                        (el) =>
                                          el.size.name ===
                                        sizeDetailRef.current.size
                                      )
                                    :dealDataPizza[index].priceSection.filter((el)=> el.size.name === sizeDetailRef.current.size),
                                    
                                id: dealDataPizza[index]?.id,
                                selectedData:dealDataPizza[index]?.priceSection.find((el)=> el.size.name === sizeDetailRef.current.size).size._id,
                  
                                sauceName: customizationData?
                                customizationData?.sauceName
                                :(  dealDataPizza[index]?.sauceName.map((el)=>{
                                  
                                  return el?.sauceName ? el.sauceName:el
                                  
                               })),
                                
                                
                                cheeseName: ((customizationData) && (customizationData.name ===  dealDataPizza[index].name))?
                                customizationData?.cheeseName  
                                :(  dealDataPizza[index]?.cheeseName.map((el)=>{
                                  
                                  return el?.cheeseName ? el.cheeseName:el
                                  
                               })) ,

                                vegetarianToppingsName: ((customizationData) && (customizationData.name ===  dealDataPizza[index].name))? 
                                customizationData?.vegetarianToppingsName 
                                :(  dealDataPizza[index]?.vegetarianToppingsName.map((el)=>{
                                  
                                  return el?.vegName ? el.vegName:el
                                  
                               })) ,
                                
                                
                                baseName: ((customizationData) && (customizationData.name ===  dealDataPizza[index].name)) ? customizationData?.baseName
                                :(typeof(dealDataPizza[index]?.baseName) === typeof {}) ? dealDataPizza[index]?.baseName.name:
                                dealDataPizza[index]?.baseName,


                                meatToppingsName: ((customizationData) && (customizationData.name ===  dealDataPizza[index].name)) ?
                                customizationData?.meatToppingsName
                                :(  dealDataPizza[index]?.meatToppingsName.map((el)=>{
                                  
                                  return el?.meatName ? el.meatName:el
                                  
                               }))
                              })
                            );
                            

                          }}
                        >
                          <MdEditSquare
                            size={30}
                            className="text-red-800 hover:text-red-700"
                          />
                        </button>
                      )}      
                        <Select
                          placeholder={'Choose Pizza'}
                          className="min-w-52 w-52 placeholder:line-clamp-1"
                          key={index}
                          onChange={(e) => {

                           
                              setDealDataPizza((prev) => {
                                let temp = [...prev];
                                temp[index] = e;
                                return temp;
                              }); 
                                                 
                          }}
                          options={dealViewData.pizza.map((el) => ({
                            label: el.pizzaName,
                            value: el._id,
                            id: el._id,
                            banner: el.banner,
                            priceSection: el.priceSection,
                            sauceName: el.sauceName,
                            cheeseName: el.cheeseName,
                            vegetarianToppingsName: el.vegetarianToppingsName,
                            meatToppingsName: el.meatToppingsName,
                            baseName: el.baseName,
                            pizzaPriceExtra:el.priceSection?.find((el)=> el?.size?.name === sizeDetailRef?.current?.size)?.price||0,
                            extraSpecialPrice:el.priceSection?.find((el)=> el?.size?.name === sizeDetailRef?.current?.size)?.size?.basePrice||0
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {drinkCount > 0 && (
                <div>
                  <h1 className="text-lg md:text-2xl font-medium mb-4 ">
                    Choose Your Drink ({dealViewData.defaultDrinkType})
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {drinks.map((_, index) => (
                      <Select
                        placeholder={`Choose drink ${index + 1}`}
                        key={index}
                        onChange={(e) => {
                          setDealDataDrinks((prev) => {
                            let temp = [...prev];
                            temp[index] = e;
                            return temp;
                          });
                        }}
                        options={dealViewData.drinks.map((el) => ({
                          label: el.drink,
                          value: el._id,
                        }))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {dealViewData?.defaultItems?.length >= 1 && (
                <div>
                  <h1 className="text-lg md:text-2xl font-medium my-4">
                    Extra Loadings
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {dealViewData.defaultItems.map((el, index) => (
                      <div
                        key={index}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 text-gray-700"
                      >
                        {el}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <img
                src={dealViewData.banner}
                className="h-[200px] md:h-[400px] rounded-md w-[200px] md:w-[400px]"
                alt="Deal Banner"
              />
            </div>
          </div>
    
         
      

          <div className="p-5 md:p-10 flex justify-center items-center">
            <button
              onClick={handleDataSubmission}
              className={` ${viewButton ? "hidden" : ""} bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md transform hover:scale-105 transition-transform duration-200 ease-in-out`}
            >
              ADD TO CART
            </button>
          </div>
        { !viewButton ? <DealPriceCard specialPizzaPrice={specialPizzaPrice}  dealPrice={sizeDetailRef?.current?.price || 0} extraPrice={extraPrice} />: ""}
        </div>
      ) : (
        <div className="flex justify-center pt-[25vh] h-[85vh] ">
          <Image src="/HOTPIZZALOGO.jpg" alt="Pizza Logo"  width={300} height={300} className="h-[10vh] w-[30vw]  object-contain" />
          </div>
      )}
    </div>
    </>
    
  );
};

export default Page;
