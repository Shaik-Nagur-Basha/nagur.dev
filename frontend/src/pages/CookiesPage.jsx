import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

function CookiesPage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950 text-slate-100"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50 text-slate-900"
      }`}
    >
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-24 sm:py-32 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        <div className="prose prose-slate dark:prose-invert space-y-6 text-sm sm:text-base opacity-90 leading-relaxed">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p>
            This is the Cookie Policy for our website. We use cookies to help improve your experience of our website.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">1. What Are Cookies?</h2>
          <p>
            As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">2. How We Use Cookies</h2>
          <p>
            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">3. Types of Cookies We Set</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account-related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration.
            </li>
            <li>
              <strong>Login-related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.
            </li>
            <li>
              <strong>Site preference cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it (such as Light/Dark mode).
            </li>
          </ul>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">4. Disabling Cookies</h2>
          <p>
            You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CookiesPage;
