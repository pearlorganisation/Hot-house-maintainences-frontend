
import React from "react";
import Product from "./Product";


export const metadata = {
  title: "Create Your Own Pizza in Northwood | Custom Pizza Delivery",
  description: "Use our Pizza Builder to create your tailored pizza in Northwood. Enjoy custom toppings and fast pizza delivery right to your door. Order now!",
  alternates:{
    canonical: `https://hothousenorthwood.co.uk/menu/product/customisePizza?calledBy=createYourOwnPizza`,  }
};


const page = () => {
  return (
    <div>
      <Product />
    </div>
  );
};

export default page;
