import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-300 py-16 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Portfolio
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Creating beautiful digital experiences with modern technologies
              and innovative solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-1 bg-linear-to-r from-blue-400 to-purple-500 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "About", "Projects", "Skills", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-1 bg-linear-to-r from-blue-400 to-purple-500 rounded-full"></span>
              Services
            </h4>
            <ul className="space-y-2">
              {[
                "Web Development",
                "UI/UX Design",
                "Backend Development",
                "Consulting",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-1 bg-linear-to-r from-blue-400 to-purple-500 rounded-full"></span>
              Follow Me
            </h4>
            <div className="flex gap-3">
              {[
                { icon: Github, link: "#", label: "GitHub" },
                { icon: Linkedin, link: "#", label: "LinkedIn" },
                { icon: Twitter, link: "#", label: "Twitter" },
                { icon: Mail, link: "#", label: "Email" },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.link}
                    className="p-3 bg-gray-800 hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 gap-4">
            <p className="flex items-center gap-2">
              &copy; {currentYear} Made with{" "}
              <Heart size={16} className="text-red-500 animate-pulse" /> by You
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-white hover:underline transition-all duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-white hover:underline transition-all duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
