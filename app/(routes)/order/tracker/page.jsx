import Script from "next/script";
import Tracker from "./Tracker";


export const metadata = {
  title: "Order Tracker | Hothouse Northwood",
  description: "Track your order in real-time.",
  alternates: {
    canonical: `https://www.hothousenorthwood.co.uk/order/tracker`,
  },
};

const page = () => {
  return (
    <>
          <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {
                'send_to': 'AW-16762107211/vwE4CIibqrkaEMvq5bg-',
                'value': {{ checkout.subtotal_price | divided_by: 100.0 }},
                'currency': 'GBP',
                'transaction_id': '{{ order_number }}',
              });
            `,
          }}
        />

      <div className="">
        <Tracker />
      </div>
    </>
  );
};

export default page;
