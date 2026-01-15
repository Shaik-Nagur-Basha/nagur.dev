import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { ButtonPrimary } from "./Button";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 rounded-full text-sm font-semibold border border-pink-200 dark:border-pink-800 backdrop-blur-sm flex items-center gap-2">
              <MessageCircle size={16} /> Get In Touch
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Have a project in mind? I'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: Mail,
                title: "Email",
                info: "hello@example.com",
                link: "mailto:hello@example.com",
                color: "blue",
              },
              {
                icon: Phone,
                title: "Phone",
                info: "+1 (555) 123-4567",
                link: "tel:+15551234567",
                color: "purple",
              },
              {
                icon: MapPin,
                title: "Location",
                info: "San Francisco, USA",
                link: "#",
                color: "pink",
              },
            ].map((contact, idx) => {
              const Icon = contact.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
                purple:
                  "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300",
                pink: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300",
              };
              return (
                <a
                  key={idx}
                  href={contact.link}
                  className="group flex gap-6 p-6 bg-white dark:bg-gray-900 rounded-2xl hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-800 cursor-pointer"
                >
                  <div
                    className={`p-4 ${
                      colorClasses[contact.color]
                    } rounded-xl h-fit group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {contact.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                      {contact.info}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3 text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3 text-sm">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3 text-sm">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="input-field resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <ButtonPrimary
              type="submit"
              className="w-full flex items-center justify-center gap-2"
            >
              <Send size={20} /> Send Message
            </ButtonPrimary>

            {submitted && (
              <div className="p-4 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-xl text-center font-semibold border border-green-200 dark:border-green-800 animate-in fade-in">
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
