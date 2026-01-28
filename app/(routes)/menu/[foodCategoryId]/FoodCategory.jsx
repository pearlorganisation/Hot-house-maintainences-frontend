"use client";

import React from "react";
import { categoryEnum } from "@/app/utils/utils";
import {usePathname } from "next/navigation";
import NotFound from "./NotFound";
import Drinks from "@/app/_components/FoodCategories/Drinks/page";
import Pizzas from "@/app/_components/FoodCategories/Pizzas/Pizzas";
import Sides from "@/app/_components/FoodCategories/Sides/Sides";
import Desserts from "@/app/_components/FoodCategories/Desserts/Desserts";
import Dips from "@/app/_components/FoodCategories/Dips/Dips";

const FoodCategory = () => {
  // -----------------------------Hooks---------------------------------------------
  const pathName = usePathname();

  const route = pathName.replace("/menu/", "").toUpperCase();
  console.log(route,"avnish")

    switch (route.toLowerCase()) {
      case "pizzas":
        return <Pizzas />;

      case "sides":
        return <Sides />;

      case "drinks":
        return <Drinks />;

      case "desserts":
        return <Desserts />;


      case "dips":
        return <Dips />;


      default:
        return <NotFound />;
    }

};

export default FoodCategory;