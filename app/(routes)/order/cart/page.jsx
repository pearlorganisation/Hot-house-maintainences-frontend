import Cart from "./Cart";

export const metadata = {
  title: 'Your Basket | Hot House Pizza | Best Pizza in Northwood ',
  description: 'Discover the best pizza takeaway in Northwood at Hot House Pizza, Convenient online ordering, quick service, and unbeatable taste. Order now',
}

const page = () => {
  return (
    <div>
      <Cart />
    </div>
  );
};

export default page;
