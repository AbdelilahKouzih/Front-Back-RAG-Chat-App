import { useLocation } from 'react-router-dom';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import userSix from '../../images/user/Graident-Ai-Robot-1.png';
import MenuSvg from './assets/MenuSvg.tsx';
import { HamburgerMenu } from './Design/header';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../images/logo/logo-bot.png';

interface HeroProps {
  openSignInModal: () => void; // Define the prop type
}

const navigation = [
  {
    id: '0',
    title: 'Features',
    url: '#features',
    onlyMobile: 0,
  },
  {
    id: '1',
    title: 'Pricing',
    url: '#pricing',
    onlyMobile: 0,
  },
  {
    id: '2',
    title: 'How to use',
    url: '#how-to-use',
    onlyMobile: 0,
  },
  {
    id: '3',
    title: 'Roadmap',
    url: '#roadmap',
    onlyMobile: 0,
  }
];

const Header: React.FC<HeroProps> = ({ openSignInModal }) => {
  const location = useLocation();
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
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? 'bg-n-8' : 'bg-n-8/90 backdrop-blur-sm'
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link to="/" className="flex items-center justify-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-50 h-auto transition-transform duration-300 transform hover:scale-110"
          />
        </Link>

        <nav
          className={`${
            openNavigation ? 'flex' : 'hidden'
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? 'lg:hidden' : ''
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === location.hash
                    ? 'z-2 lg:text-n-1'
                    : 'lg:text-n-1/50'
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>

         
        </nav>

        <button onClick={openSignInModal}
          type="button"
          className="text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-black dark:hover:bg-blue-700 dark:focus:ring-blue-800 hidden "
        >
           Let's Go
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>

        <button className="ml-auto lg:hidden px-3" onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </button>
      </div>
    </div>
  );
};

export default Header;
