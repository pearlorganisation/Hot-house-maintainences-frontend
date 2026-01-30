"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies"; // or js-cookie if you prefer

export default function AnalyticsScripts() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const cookies = parseCookies();
    setConsent(cookies["user_consent"]); // from react-cookie-consent
  }, []);

  if (consent !== "true") return null; // don’t load scripts without consent

  return (
    <>
      {/* Google Tag Manager */}
      {/* <Script id="gtm" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-K9VVFVZL');
        `}
      </Script> */}

      {/* Google Analytics */}
      {/* <Script id="ga" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7NN5GJS7SP');
        `}
      </Script> */}

      {/* Meta Pixel */}
      {/* <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '406823858532963');
          fbq('track', 'PageView');
        `}
      </Script> */}

      <Script
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
</Script>
    </>
  );
}
