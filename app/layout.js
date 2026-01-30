import "./globals.css";
import Header from "./_components/layout/Header/Header";
import Footer from "./_components/layout/Footer/Footer";
import StoreProvider from "./StoreProvider";
import { Toaster } from "sonner";
// import Script from "next/script";
import Popup from "./_components/Popup/Popup";
// import RouteChangeTracker from "./_components/RouteChangeTracker";
import AnalyticsScripts from "./_components/AnalyticsLoader";
import Script from "next/script";


export const metadata = {
  title: "Hothouse pizza northwood",
  description: "Delicious pizzas, sides & deals — order online now!",
  icons: {
    icon: "/favicon.jpg",
  },
  verification: {
        google: "wB-BRkSJ7Kv_piJ-VOoqs5_8wKCbrUtSvW3e6mBhY-o",
    // google: "KNX-3vWjShPJyzrqVlhnyfiZYNUxUOWcaupO2aREIcE",
    microsoft: "23983C217832B5C4AAC786882981CDA6",
    pinterest: "0251c9ad8f0e5ddccd4f306b6f6fc871",
    facebook: "sbeb7h7pbwfwnhprsjn3gh82x94191",
  },
};



export default function RootLayout({ children }) {

  return (
    <html lang="en">

      <body className="flex flex-col">
        {/* Adding noscript using dangerouslySetInnerHTML */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=406823858532963&ev=PageView&noscript=1" />
            `,
          }}
        />

        {/* Adding noscript using dangerouslySetInnerHTML */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K9VVFVZL"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
       {/* <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-L2LD88SFKL"
  strategy="afterInteractive"
/>

<Script id="gtag-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-L2LD88SFKL');
  `}
</Script> */}


      

        <StoreProvider>
          <Header />
          {/* Load scripts only if user accepts cookies */}
          <AnalyticsScripts />
          <div className="pt-44">{children}</div>
          <Popup />
          <Toaster position="top-right" richColors duration={1000} />
          <Footer />

          {/* convert this to trigger on route change */}
          {/* <Script>
            {`window.addEventListener('load', function() {
            if(window.location.pathname=='/menu/deals'){
                  gtag('event', 'conversion', { 'send_to': 'AW-16762107211/aSMqCL-Phr0aEMvq5bg-' });
            }
                if(window.location.pathname=='/menu/pizzas'){
                  gtag('event', 'conversion', { 'send_to': 'AW-16762107211/1bTgCMuehr0aEMvq5bg-' });
            }
                if(window.location.pathname=='/menu/sides'){
                  gtag('event', 'conversion', { 'send_to': 'AW-16762107211/KNARCM6ehr0aEMvq5bg-' });
            }
          });`}
          </Script> */}
        </StoreProvider>
      </body>
    </html>
  );
}
