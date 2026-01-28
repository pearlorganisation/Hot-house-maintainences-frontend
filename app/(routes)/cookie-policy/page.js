export const metadata = {
  title: "Cookie Policy | Hot House Pizza Northwood",
  description:
    "Learn how Hot House Pizza Northwood uses cookies to improve your experience, personalize content, and analyze site traffic.",
};

export default function CookiePolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-red-800">
        Cookie Policy
      </h1>

      <p className="mb-6">
        This Cookie Policy explains how <strong>Hot House Pizza Northwood</strong> (“we”, “us”, or “our”)
        uses cookies and similar technologies to recognize you when you visit our website
        (<a href="/" className="text-blue-600 underline">hothousepizzanorthwood.co.uk</a>).
        It explains what these technologies are, why we use them, and your rights to control their use.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">
        1. What Are Cookies?
      </h2>
      <p className="mb-6">
        Cookies are small text files that are placed on your device (computer, smartphone, or tablet)
        when you visit a website. They help the site recognize your device and store certain information
        about your preferences or past actions.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">
        2. How We Use Cookies
      </h2>
      <p className="mb-4">
        We use cookies for several purposes, including:
      </p>
      <ul className="list-disc ml-6 mb-6">
        <li>To ensure our website functions properly.</li>
        <li>To remember your preferences (like accepted cookies or selected items).</li>
        <li>To analyze website traffic and user behavior (via Google Analytics).</li>
        <li>To display relevant advertisements (via Google Ads and Meta Pixel).</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-3">
        3. Types of Cookies We Use
      </h2>
      <ul className="list-disc ml-6 mb-6">
        <li>
          <strong>Essential Cookies:</strong> Required for website functionality, such as navigation
          and secure checkout.
        </li>
        <li>
          <strong>Performance & Analytics Cookies:</strong> Help us understand how visitors use our
          site and improve it (e.g., Google Analytics).
        </li>
        <li>
          <strong>Advertising Cookies:</strong> Used to deliver personalized ads and measure their
          effectiveness (e.g., Google Ads, Meta Pixel).
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-3">
        4. Third-Party Cookies
      </h2>
      <p className="mb-6">
        Some cookies may be set by third-party services that appear on our pages.
        For example, analytics and advertising partners like Google or Meta (Facebook)
        may set their own cookies to track performance or deliver ads.
        We do not control these cookies directly.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">
        5. Managing Cookies
      </h2>
      <p className="mb-4">
        When you first visit our site, you can choose to accept or decline cookies
        using our cookie consent banner.
      </p>
      <p className="mb-6">
        You can also control or delete cookies through your browser settings. To learn more about how
        to manage cookies, visit{" "}
        <a
          href="https://www.allaboutcookies.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          www.allaboutcookies.org
        </a>.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">
        6. Updates to This Policy
      </h2>
      <p className="mb-6">
        We may update this Cookie Policy from time to time to reflect changes in technology,
        legal requirements, or our practices. The updated version will be posted on this page
        with a new “Last Updated” date.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">
        7. Contact Us
      </h2>
      {/*<p>
        If you have any questions about our use of cookies, please contact us at: <br />
        <strong>Email:</strong> hothousenorthwood@gmail.com <br />
         <strong>Phone:</strong> 01923 510520
      </p>

     <p className="mt-10 text-sm text-gray-600">
        <em>Last updated: {new Date().toLocaleDateString()}</em>
      </p> */}
    </main>
  );
}
