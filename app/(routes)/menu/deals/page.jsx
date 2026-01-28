import Deals from "./Deals";

export const metadata = {
  title: 'Pizza Deals Northwood | Hot House Special',
  description: 'Discover the best pizza deals in Northwood at Hot House. Enjoy special offers on freshly made pizzas, perfect for takeaway or delivery. Order online today!',
  alternates:{
    canonical: `https://www.hothousenorthwood.co.uk/menu/deals`,  }
}

const page = () => {
  return (
    <div>
      <Deals />
    </div>
  );
};

export default page;
