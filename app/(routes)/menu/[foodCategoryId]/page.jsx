import FoodCategory from "./FoodCategory";


// Dynamic Metadata Generation
export async function generateMetadata({ params }) {
  const category = params.foodCategoryId || "pizzas"; // Default to "pizzas" if no category is found
  let title, description;
  
  switch (category.toLowerCase()) {
    case "pizzas":
      title = "Customized Pizza in Northwood | Online Orders";
      description = "Order personalized pizza with your favorite toppings in Northwood. Quick online ordering and delivery!";
      break;
    case "sides":
      title = "Delicious Sides in Northwood | Pizza Sides & More";
      description = "Complete your meal with tasty sides in Northwood. From garlic bread to salads, explore our selection of sides and add them to your pizza order for a perfect meal";
      break;
    case "drinks":
      title = "Refreshing Drinks in Northwood | Soft Drinks & More";
      description = "Quench your thirst with a variety of refreshing drinks in Northwood. Pair your pizza with soft drinks, juices, and more for a perfect meal combo!";
      break;
    case "desserts":
      title = "Delicious Desserts in Northwood | Sweet Treats & More";
      description = "Indulge in mouthwatering desserts in Northwood. From chocolate lava cake to cookies, satisfy your sweet tooth with our perfect dessert options after your pizza";
      break;
    case "dips":
      title = "Tasty Dips in Northwood | Perfect Pairings for Your Pizza";
      description = "Enhance your pizza experience with a variety of flavorful dips in Northwood. From ranch to garlic butter, find the perfect dip to complement your meal!";
      break;
    default:
      title = "Food Category | Hot House Pizza | Order online now";
      description = "Discover the best pizza takeaway in Northwood at Hot House Pizza. Order now!";
      break;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.hothousenorthwood.co.uk/menu/${params.foodCategoryId}`,
      
    }
  };
}

const Page = () => {
  return (
    <div>
      <FoodCategory />
    </div>
  );
};

export default Page;

