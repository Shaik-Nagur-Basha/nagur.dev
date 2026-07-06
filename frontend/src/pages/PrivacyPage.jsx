import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

function PrivacyPage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col bg-pattern-subtle ${
        darkMode
          ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950 text-slate-100"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50 text-slate-900"
      }`}
    >
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-24 sm:py-32 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <div className="prose prose-slate dark:prose-invert space-y-6 text-sm sm:text-base opacity-90 leading-relaxed">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p>
            Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          
          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">1. Information We Collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">2. Data Retention and Storage</h2>
          <p>
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>
          <p>
            We do not share any personally identifying information publicly or with third-parties, except when required to by law.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">3. Cookies</h2>
          <p>
            We use cookies to collect information about you and your activity across our site. This helps us understand how you use our site and serve you content based on preferences you have specified. Please refer to our Cookie Policy for more details.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">4. Third-Party Links</h2>
          <p>
            Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">5. Contact Information</h2>
          <p>
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPage;
