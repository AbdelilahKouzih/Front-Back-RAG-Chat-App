import { useState } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';
import Section from "./Section.tsx";

const socials = [
  {
    id: "0",
    title: "Twitter",
    url: "#",
    icon: FiTwitter,
  },
  {
    id: "1",
    title: "Instagram",
    url: "#",
    icon: FiInstagram,
  },
  {
    id: "2",
    title: "Facebook",
    url: "#",
    icon: FiFacebook,
  },
];

const Footer = () => {
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <section  className="">
      <div className="  bottom-0 left-0 w-full bg-transparent border-t border-gray-300 flex justify-between items-center px-6 py-10">
        <p className="text-sm lg:text-base text-white">© {new Date().getFullYear()}. All rights reserved.</p>

        <ul className="flex gap-5 flex-wrap">
          {socials.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-gray-800"
              >
                <item.icon className="w-6 h-6 text-white" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Footer;
