import React, { useState } from 'react';
import Footer from '../../components/Home/Footer.tsx';
import ChatBot from '../../components/Home/chatBot.tsx';
import Header from '../../components/Home/Header.tsx';
import Hero from '../../components/Home/Hero.tsx';
import Pricing from '../../components/Home/Pricing.tsx';
import SignIn from '../Authentication/SignIn.tsx'; // Import the SignIn component
import SignUp from '../Authentication/SignUp.tsx'; // Import the SignIn component
import Services from '../../components/Home/Services.tsx';
import Contact from '../../components/Home/Contact.tsx';
import 'animate.css'; // Import animate.css

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [showSignIn, setShowSignIn] = useState<boolean>(false); // State to control the visibility of the sign-in popup
  const [showSignUp, setshowSignUp] = useState<boolean>(false); // State to control the visibility of the sign-in popup

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSwitchToSignUp = () => {
    setShowSignIn(false); // Fermer la fenêtre de connexion
    setshowSignUp(true); // Afficher la fenêtre d'inscription
  };

  const handleSwitchToSignIn = () => {
    setShowSignIn(true); // Afficher la fenêtre de connexion
    setshowSignUp(false); // Fermer la fenêtre d'inscription
  };

  const handleGetStartedClick = () => {
    setShowSignIn(true); // Show the sign-in popup when "Get started" is clicked
  };

  const handleCloseSignIn = () => {
    setShowSignIn(false); // Close the sign-in popup
  };

  return (
    <div className="flex flex-col justify-center align-center relative bg-[#020617]">
      <Header openSignInModal={handleGetStartedClick} />
      <div className="flex flex-col justify-center">
        <Hero  openSignInModal={handleGetStartedClick} />{' '}
        {/* Pass the function to handle "Get started" click */}
        <Services  />
        <Pricing  />
        <Contact  />
        <ChatBot  />
      </div>
      <Footer />
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black border bg-opacity-90 border-white w-[45rem] h-[40rem] rounded-lg shadow-lg flex items-center justify-center  ">
            <SignIn email={email} password={password} onClose={handleCloseSignIn} switchToSignUp={handleSwitchToSignUp} />
          </div>
        </div>
      )}
      {showSignUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black border bg-opacity-90 border-white w-[45rem] h-[40rem] rounded-lg shadow-lg flex items-center justify-center ">
            <SignUp email={email} password={password} switchToSignIn={handleSwitchToSignIn} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
