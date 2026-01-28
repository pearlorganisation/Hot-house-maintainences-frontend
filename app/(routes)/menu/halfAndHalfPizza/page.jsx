
import React from "react";
import HalfAndHalfPizza from "./HalfAndHalfPizza";

export const metadata = {
  title: "Half & Half Pizza Northwood | Customize & Order Online",
  description: "Choose your favorite toppings with our Half & Half pizza in Watford. Fresh ingredients, tailored to your taste. Order online now!",
  alternates:{
    canonical: `https://www.hothousenorthwood.co.uk/menu/halfAndHalfPizza?calledBy=half`,  }
};


const page = () => {
  return (
    <div>
      <HalfAndHalfPizza />
    </div>
  );
};

export default page;
