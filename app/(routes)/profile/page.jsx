import Profile from "./Profile";

export const metadata = {
    title: 'My Profile | Hot House Pizza',
    description: 'Discover the best pizza takeaway in Northwood at Hot House Pizza, Convenient online ordering, quick service, and unbeatable taste. Order now',
  }

const page = ({ searchParams }) => {
    return (
      <div>
        <Profile searchParams={searchParams}/>
      </div>
    );
  };
  
  export default page;
  