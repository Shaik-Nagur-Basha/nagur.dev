import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import SkeletonLoader from "./SkeletonLoader";
import axios from "axios";
import "./Contact.css";

// Dynamically set API URL based on environment
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : `${window.location.origin}/api`);

function Contact() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    // Minimum skeleton display time (prevents flashing)
    const minTimer = setTimeout(() => setMinLoadingTime(false), 800);
    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    // Switch to content once minimum time has passed
    if (!minLoadingTime) {
      setIsLoading(false);
    }
  }, [minLoadingTime]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await axios.post(`${API_URL}/contact`, formData);

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setFocusedField(null);

        // Hide success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitError(
        error.response?.data?.error ||
          "Failed to submit the form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="contact" />
      ) : (
        <section
          id="contact"
          className="py-20 px-4 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mt-4 mb-16">
              <div className="inline-block mb-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border border-pink-200 backdrop-blur-sm flex items-center gap-2 ${darkMode ? "bg-pink-900/40 text-pink-300 border-pink-800" : "bg-pink-100 text-pink-600"}`}
                >
                  <MessageCircle size={16} /> Get In Touch
                </span>
              </div>
              <h2
                className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white/90" : "text-black/90"} mb-4`}
              >
                Let's Work Together
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                Have a project in mind? I'd love to hear from you!
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid justify-items-center place-self-baseline lg:grid-cols-2 gap-8 lg:gap-16 mb-8">
              {/* Contact Info Section */}
              <div className="lg:space-y-6 lg:place-content-start max-lg:w-full max-lg:flex items-center justify-center md:gap-8 gap-4 flex-wrap lg:mt-10 lg:mr-10">
                {[
                  {
                    icon: Phone,
                    title: "Phone",
                    info: "+91 6302504034",
                    link: "tel:+916302504034",
                    color: "purple",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    info: "sknbasknba@gmail.com",
                    link: "mailto:sknbasknba@gmail.com",
                    color: "blue",
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    info: "Badvel, Kadapa, Andhra Pradesh, 516227",
                    link: "https://maps.app.goo.gl/b5FJS9nsc9etuV5f7",
                    color: "pink",
                  },
                ].map((contact, idx) => {
                  const Icon = contact.icon;
                  const colorConfig = {
                    blue: {
                      light: "from-blue-50 to-blue-100/50 border-blue-200",
                      dark: "from-blue-950 to-blue-900/30 border-blue-800",
                      icon: `${darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-600"}`,
                    },
                    purple: {
                      light:
                        "from-purple-50 to-purple-100/50 border-purple-200",
                      dark: "from-purple-950 to-purple-900/30 border-purple-800",
                      icon: `${darkMode ? "text-purple-300 bg-purple-900/40" : "text-purple-600 bg-purple-100"}`,
                    },
                    pink: {
                      light: "from-pink-50 to-pink-100/50 border-pink-200",
                      dark: "from-pink-950 to-pink-900/30 border-pink-800",
                      icon: `${darkMode ? "text-pink-300 bg-pink-900/40" : "bg-pink-100 text-pink-600"}`,
                    },
                  };

                  return (
                    <a
                      key={idx}
                      href={contact.link}
                      className={`group max-w-fit contact-card block relative overflow-hidden rounded-xl p-3 pr-7 transition-all duration-500 transform active:scale-95 cursor-pointer animate-slide-in-left backdrop-blur-xl border ${
                        darkMode
                          ? `${colorConfig[contact.color].dark} bg-gray-900/50 shadow-2xl shadow-${contact.color}-900/20 hover:shadow-${contact.color}-500/30`
                          : `${colorConfig[contact.color].light} bg-white/70 shadow-lg hover:shadow-xl`
                      }`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                          darkMode
                            ? "bg-linear-to-br from-white/5 to-transparent"
                            : "bg-linear-to-br from-white/40 to-transparent"
                        }`}
                      ></div>

                      {/* Content */}
                      <div className="relative z-10 flex gap-2 items-center">
                        {/* Icon */}
                        <div
                          className={`shrink-0 w-8 h-8 rounded flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 ${colorConfig[contact.color].icon}`}
                        >
                          <Icon size={14} className="w-4 h-4" />
                        </div>

                        {/* Text */}
                        <div className="grow">
                          <h3
                            className={`text-sm font-bold mb-0.5 transition-all duration-300 group-hover:translate-x-1 ${
                              darkMode ? "text-white/85" : "text-black/85"
                            }`}
                          >
                            {contact.title}
                          </h3>
                          <p
                            className={`text-xs font-semibold transition-all duration-300 group-hover:translate-x-1 ${
                              darkMode ? "text-white/75" : "text-black/75"
                            }`}
                          >
                            {contact.info}
                          </p>
                        </div>

                        {/* Arrow icon */}
                        <ArrowRight
                          className={`w-3.5 h-3.5 shrink-0 transition-all duration-500 transform opacity-0 group-hover:opacity-100 group-hover:translate-x-2 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        />
                      </div>

                      {/* Bottom accent line */}
                      <div
                        className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-${contact.color}-500`}
                      ></div>
                    </a>
                  );
                })}
              </div>

              {/* Contact Form Section */}
              <div className="w-full max-w-2xl lg:mr-44">
                <form
                  onSubmit={handleSubmit}
                  className={`transition-all duration-500 animate-fade-in`}
                >
                  {/* Heading */}
                  <h3
                    className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${
                      darkMode ? "text-white/85" : "text-black/85"
                    }`}
                  >
                    Send us a Message
                  </h3>

                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-5">
                    {/* Full Name Field */}
                    <div className="animate-slide-up delay-200">
                      <label
                        className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="Your Name"
                        disabled={isSubmitting}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm transition-all duration-300 focus:outline-none disabled:opacity-50 ${
                          focusedField === "name"
                            ? darkMode
                              ? "bg-linear-to-r from-blue-500/30 to-blue-400/20 border-2 border-blue-400 shadow-lg shadow-blue-500/30"
                              : "bg-linear-to-r from-blue-100 to-blue-50 border-2 border-blue-400 shadow-lg shadow-blue-300/50 text-black"
                            : darkMode
                              ? "bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-500 hover:border-gray-600"
                              : "bg-gray-100/50 border border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                        }`}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="animate-slide-up delay-300">
                      <label
                        className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm transition-all duration-300 focus:outline-none disabled:opacity-50 ${
                          focusedField === "email"
                            ? darkMode
                              ? "bg-linear-to-r from-purple-500/30 to-purple-400/20 border-2 border-purple-400 shadow-lg shadow-purple-500/30"
                              : "bg-linear-to-r from-purple-100 to-purple-50 border-2 border-purple-400 shadow-lg shadow-purple-300/50 text-black"
                            : darkMode
                              ? "bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-500 hover:border-gray-600"
                              : "bg-gray-100/50 border border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="mb-6 sm:mb-8 animate-slide-up delay-400">
                    <label
                      className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows="5"
                      minLength={5}
                      placeholder="Tell us about your project ideas, requirements, or any questions you have..."
                      disabled={isSubmitting}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm transition-all duration-300 focus:outline-none resize-none disabled:opacity-50 ${
                        focusedField === "message"
                          ? darkMode
                            ? "bg-linear-to-r from-pink-500/30 to-pink-400/20 border-2 border-pink-400 shadow-lg shadow-pink-500/30"
                            : "bg-linear-to-r from-pink-100 to-pink-50 border-2 border-pink-400 shadow-lg shadow-pink-300/50 text-black"
                          : darkMode
                            ? "bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-500 hover:border-gray-600"
                            : "bg-gray-100/50 border border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                      }`}
                    ></textarea>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div
                      className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg flex items-center gap-3 border animate-success-pop ${
                        darkMode
                          ? "bg-linear-to-r from-red-900/40 to-red-900/40 border-red-700/50 text-red-200 shadow-lg shadow-red-900/20"
                          : "bg-linear-to-r from-red-100 to-red-100 border-red-400 text-red-800 shadow-lg shadow-red-300/30"
                      }`}
                    >
                      <div>
                        <p className="font-bold">Error</p>
                        <p className="text-sm opacity-90">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center animate-slide-up delay-500">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`relative cursor-pointer py-3 sm:py-4 px-6 sm:px-10 text-sm sm:text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden border-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        darkMode
                          ? "border-purple-400/50 bg-purple-950/30 text-purple-200 active:bg-purple-800/70 active:border-purple-400"
                          : "border-blue-400/50 bg-blue-50/50 text-blue-700 active:bg-blue-200 active:border-blue-600"
                      }`}
                    >
                      {/* Content */}
                      <span className="relative hover:tracking-wide z-10 flex items-center gap-2 transition-all duration-300">
                        <Send
                          size={18}
                          className="transition-transform duration-300 group-hover:rotate-45"
                        />
                        <span>
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </span>
                      </span>
                    </button>
                  </div>

                  {/* Success Message */}
                  {submitted && (
                    <div
                      className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg flex items-center gap-3 animate-success-pop border ${
                        darkMode
                          ? "bg-linear-to-r from-green-900/40 to-emerald-900/40 border-green-700/50 text-green-200 shadow-lg shadow-green-900/20"
                          : "bg-linear-to-r from-green-100 to-emerald-100 border-green-400 text-green-800 shadow-lg shadow-green-300/30"
                      }`}
                    >
                      <CheckCircle
                        size={24}
                        className="shrink-0 animate-bounce-soft"
                      />
                      <div>
                        <p className="font-bold">Success!</p>
                        <p className="text-sm opacity-90">
                          We'll get back to you as soon as possible.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="contact" />
      ) : (
        <section
          id="contact"
          className="py-20 px-4 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mt-4 mb-16">
              <div className="inline-block mb-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border border-pink-200 backdrop-blur-sm flex items-center gap-2 ${darkMode ? "bg-pink-900/40 text-pink-300 border-pink-800" : "bg-pink-100 text-pink-600"}`}
                >
                  <MessageCircle size={16} /> Get In Touch
                </span>
              </div>
              <h2
                className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white/90" : "text-black/90"} mb-4`}
              >
                Let's Work Together
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                Have a project in mind? I'd love to hear from you!
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid justify-items-center place-self-baseline lg:grid-cols-2 gap-8 lg:gap-16 mb-8">
              {/* Contact Info Section */}
              <div className="lg:space-y-6 lg:place-content-start max-lg:w-full max-lg:flex items-center justify-center md:gap-8 gap-4 flex-wrap lg:mt-10 lg:mr-10">
                {[
                  {
                    icon: Phone,
                    title: "Phone",
                    info: "+91 6302504034",
                    link: "tel:+916302504034",
                    color: "purple",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    info: "sknbasknba@gmail.com",
                    link: "mailto:sknbasknba@gmail.com",
                    color: "blue",
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    info: "Badvel, Kadapa, Andhra Pradesh, 516227",
                    link: "https://maps.app.goo.gl/b5FJS9nsc9etuV5f7",
                    color: "pink",
                  },
                ].map((contact, idx) => {
                  const Icon = contact.icon;
                  const colorConfig = {
                    blue: {
                      light: "from-blue-50 to-blue-100/50 border-blue-200",
                      dark: "from-blue-950 to-blue-900/30 border-blue-800",
                      icon: `${darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-600"}`,
                    },
                    purple: {
                      light:
                        "from-purple-50 to-purple-100/50 border-purple-200",
                      dark: "from-purple-950 to-purple-900/30 border-purple-800",
                      icon: `${darkMode ? "text-purple-300 bg-purple-900/40" : "text-purple-600 bg-purple-100"}`,
                    },
                    pink: {
                      light: "from-pink-50 to-pink-100/50 border-pink-200",
                      dark: "from-pink-950 to-pink-900/30 border-pink-800",
                      icon: `${darkMode ? "text-pink-300 bg-pink-900/40" : "bg-pink-100 text-pink-600"}`,
                    },
                  };

                  return (
                    <a
                      key={idx}
                      href={contact.link}
                      className={`group max-w-fit contact-card block relative overflow-hidden rounded-xl p-3 pr-7 transition-all duration-500 transform active:scale-95 cursor-pointer animate-slide-in-left backdrop-blur-xl border ${
                        darkMode
                          ? `${colorConfig[contact.color].dark} bg-gray-900/50 shadow-2xl shadow-${contact.color}-900/20 hover:shadow-${contact.color}-500/30`
                          : `${colorConfig[contact.color].light} bg-white/70 shadow-lg hover:shadow-xl`
                      }`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                          darkMode
                            ? "bg-linear-to-br from-white/5 to-transparent"
                            : "bg-linear-to-br from-white/40 to-transparent"
                        }`}
                      ></div>

                      {/* Content */}
                      <div className="relative z-10 flex gap-2 items-center">
                        {/* Icon */}
                        <div
                          className={`shrink-0 w-8 h-8 rounded flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 ${colorConfig[contact.color].icon}`}
                        >
                          <Icon size={14} className="w-4 h-4" />
                        </div>

                        {/* Text */}
                        <div className="grow">
                          <h3
                            className={`text-sm font-bold mb-0.5 transition-all duration-300 group-hover:translate-x-1 ${
                              darkMode ? "text-white/85" : "text-black/85"
                            }`}
                          >
                            {contact.title}
                          </h3>
                          <p
                            className={`text-xs font-semibold transition-all duration-300 group-hover:translate-x-1 ${
                              darkMode ? "text-white/75" : "text-black/75"
                            }`}
                          >
                            {contact.info}
                          </p>
                        </div>

                        {/* Arrow icon */}
                        <ArrowRight
                          className={`w-3.5 h-3.5 shrink-0 transition-all duration-500 transform opacity-0 group-hover:opacity-100 group-hover:translate-x-2 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        />
                      </div>

                      {/* Bottom accent line */}
                      <div
                        className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-${contact.color}-500`}
                      ></div>
                    </a>
                  );
                })}
              </div>

              {/* Contact Form Section */}
              <div className="w-full max-w-2xl lg:mr-44">
                <form
                  onSubmit={handleSubmit}
                  className={`transition-all duration-500 animate-fade-in`}
                >
                  {/* Heading */}
                  <h3
                    className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${
                      darkMode ? "text-white/85" : "text-black/85"
                    }`}
                  >
                    Send us a Message
                  </h3>

                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-5">
                    {/* Full Name Field */}
                    <div className="animate-slide-up delay-200">
                      <label
                        className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="Your Name"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm transition-all duration-300 focus:outline-none ${
                          focusedField === "name"
                            ? darkMode
                              ? "bg-linear-to-r from-blue-500/30 to-blue-400/20 border-2 border-blue-400 shadow-lg shadow-blue-500/30"
                              : "bg-linear-to-r from-blue-100 to-blue-50 border-2 border-blue-400 shadow-lg shadow-blue-300/50 text-black"
                            : darkMode
                              ? "bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-500 hover:border-gray-600"
                              : "bg-gray-100/50 border border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                        }`}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="animate-slide-up delay-300">
                      <label
                        className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="your@email.com"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm transition-all duration-300 focus:outline-none ${
                          focusedField === "email"
                            ? darkMode
                              ? "bg-linear-to-r from-purple-500/30 to-purple-400/20 border-2 border-purple-400 shadow-lg shadow-purple-500/30"
                              : "bg-linear-to-r from-purple-100 to-purple-50 border-2 border-purple-400 shadow-lg shadow-purple-300/50 text-black"
                            : darkMode
                              ? "bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-500 hover:border-gray-600"
                              : "bg-gray-100/50 border border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="mb-6 sm:mb-8 animate-slide-up delay-400">
                    <label
                      className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows="5"
                      placeholder="Tell us about your project ideas, requirements, or any questions you have..."
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm transition-all duration-300 focus:outline-none resize-none ${
                        focusedField === "message"
                          ? darkMode
                            ? "bg-linear-to-r from-pink-500/30 to-pink-400/20 border-2 border-pink-400 shadow-lg shadow-pink-500/30"
                            : "bg-linear-to-r from-pink-100 to-pink-50 border-2 border-pink-400 shadow-lg shadow-pink-300/50 text-black"
                          : darkMode
                            ? "bg-gray-800/50 border border-gray-700 text-gray-200 placeholder-gray-500 hover:border-gray-600"
                            : "bg-gray-100/50 border border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400"
                      }`}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center animate-slide-up delay-500">
                    <button
                      type="submit"
                      className={`relative cursor-pointer py-3 sm:py-4 px-6 sm:px-10 text-sm sm:text-base font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden border-2 ${
                        darkMode
                          ? "border-purple-400/50 bg-purple-950/30 text-purple-200 active:bg-purple-800/70 active:border-purple-400"
                          : "border-blue-400/50 bg-blue-50/50 text-blue-700 active:bg-blue-200 active:border-blue-600"
                      }`}
                    >
                      {/* Content */}
                      <span className="relative hover:tracking-wide z-10 flex items-center gap-2 transition-all duration-300">
                        <Send
                          size={18}
                          className="transition-transform duration-300 group-hover:rotate-45"
                        />
                        <span>Send Message</span>
                      </span>
                    </button>
                  </div>

                  {/* Success Message */}
                  {submitted && (
                    <div
                      className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg flex items-center gap-3 animate-success-pop border ${
                        darkMode
                          ? "bg-linear-to-r from-green-900/40 to-emerald-900/40 border-green-700/50 text-green-200 shadow-lg shadow-green-900/20"
                          : "bg-linear-to-r from-green-100 to-emerald-100 border-green-400 text-green-800 shadow-lg shadow-green-300/30"
                      }`}
                    >
                      <CheckCircle
                        size={24}
                        className="shrink-0 animate-bounce-soft"
                      />
                      <div>
                        <p className="font-bold">Success!</p>
                        <p className="text-sm opacity-90">
                          We'll get back to you as soon as possible.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Contact;
