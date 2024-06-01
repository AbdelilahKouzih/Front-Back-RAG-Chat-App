import Section from './Section';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import heroBackground from '../Home/assets/hero-background.jpg';
import robot from '../Home/assets/robot.jpg';
import 'animate.css'; // Import animate.css

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    tel: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {
      name: '',
      email: '',
      tel: '',
      message: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid Email is required';
      isValid = false;
    }

    const telRegex = /^[+]?[0-9]{10,13}$/;
    if (!formData.tel.trim() || !telRegex.test(formData.tel)) {
      newErrors.tel = 'Valid Telephone Number is required';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate() && form.current) {
      emailjs
        .sendForm('service_ajhpfxl', 'template_tfobjg1', form.current, {
          publicKey: '2p1RO1AHF_r7rcXeb',
        })
        .then(
          () => {
            console.log('SUCCESS!');
            resetForm(); // Reset form fields after successful email sending

          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
    } else {
      console.error('Form validation failed');
    }
  };

  const initialFormData = {
    name: '',
    email: '',
    tel: '',
    message: '',
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };
  return (
    <div
      id="contact"
      className="animate__animated animate__fadeIn animate__slow relative flex flex-col items-top w-[80%] m-auto border shadow-lg rounded-xl mb-10 justify-center min-h-screen dark:bg-gray-900 sm:items-center sm:pt-0"
    >
      <h1 className="text-4xl sm:text-5xl text-gray-800 font-extrabold tracking-tight mb-10">
        Contact Us
      </h1>
      <div className="w-[80%] border shadow-lg rounded-xl mx-auto sm:px-6 lg:px-8">
        <div className="mt-8 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
              <h1 className="text-4xl sm:text-5xl text-gray-800 font-extrabold tracking-tight">
                Get in touch
              </h1>
              <p className="text-normal text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400 mt-2">
                Fill in the form to start a conversation
              </p>

              <div className="flex items-center mt-8 text-gray-600 dark:text-gray-400">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="ml-4 text-md tracking-wide font-semibold w-40">
                  Morocoo Kénitra
                </div>
              </div>

              <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div className="ml-4 text-md tracking-wide font-semibold w-40">
                  +212 684457953
                </div>
              </div>

              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="ml-4 text-md tracking-wide font-semibold w-40">
                  abdelilah.kouzih@uit.ac.ma
                </div>
              </div>
            </div>

            <form className="p-6 flex flex-col justify-center" ref={form} onSubmit={sendEmail}>
              <div className="flex flex-col justify-center align-center">
                <label htmlFor="name" className="hidden">
                  Full Name
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-[#020617] dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="email" className="hidden">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-[#020617] dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="tel" className="hidden">
                  Number
                </label>
                <input
                  type="tel"
                  name="tel"
                  id="tel"
                  placeholder="Telephone Number"
                  value={formData.tel}
                  onChange={handleChange}
                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-[#020617] dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
                {errors.tel && <span className="text-red-500">{errors.tel}</span>}
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="message" className="hidden">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-100 h-32 mt-2 py-3 px-3 rounded-lg bg-[#020617] border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
                />
                {errors.message && <span className="text-red-500">{errors.message}</span>}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="md:w-32 hover:bg-[#0284c7] border font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 hover:text-white transition ease-in-out duration-300 mx-auto"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
