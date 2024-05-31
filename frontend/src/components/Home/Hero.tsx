import Section from './Section.tsx';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import heroBackground from '../Home/assets/hero-background.jpg';
import robot from '../Home/assets/file.png';
import 'animate.css'; // Import animate.css
interface HeroProps {
  openSignInModal: () => void; // Define the prop type
}
const Hero: React.FC<HeroProps> = ({ openSignInModal }) =>{
  const parallaxRef = useRef(null);


  return (
    <Section
    
      className=" pt-[17rem] -mt-[5.25rem] rounded-xl  border shadow-lg w-[80%] m-auto animate__animated animate__fadeIn animate__slow "
      crosses
      customPaddings
      id="Home"
    >
      <div className="relative ">
        <div className="container relative mx-auto">
          <div className="relative z-10 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight text-white">
              Discover the Potential of Interacting with AI through a Chatbot
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl text-gray-200 mb-10">
              Elevate your Efficiency with Chatbot, the Open AI Chat
              Application.
            </p>
            <button className="btn" onClick={openSignInModal}>Get started</button>

          </div>
          <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8 rounded-[1rem]">
                <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

                <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490] border-2 border-gray-500">
                  <img
                    src={robot}
                    className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                    width={1024}
                    height={490}
                    alt="AI"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
             
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
export default Hero;
