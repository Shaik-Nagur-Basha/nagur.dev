import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

function TermsPage() {
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
          Terms of Service
        </h1>
        <div className="prose prose-slate dark:prose-invert space-y-6 text-sm sm:text-base opacity-90 leading-relaxed">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p>
            Welcome to our website. By accessing or using this website, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">1. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          <p>
            Under this license, you may not modify or copy the materials, use them for any commercial purpose, or attempt to decompile or reverse engineer any software contained on the website.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">2. Disclaimer</h2>
          <p>
            The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">3. Limitations of Liability</h2>
          <p>
            In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">4. Accuracy of Materials</h2>
          <p>
            The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on the website at any time without notice.
          </p>

          <h2 className="text-xl font-bold mt-8 text-blue-600 dark:text-blue-400">5. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsPage;
