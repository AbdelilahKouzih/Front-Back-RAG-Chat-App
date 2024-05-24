import { useEffect, useState } from 'react';
import { Route, Routes, useLocation} from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Chat from './pages/Dashboard/Chat';
import Admin from './pages/Admin/Admin';
import ChatbotFiles from './pages/Admin/Chatbotfiles';
import UserManage from './pages/Admin/UserManage';
import Voice from './pages/Dashboard/VoiceAssistant';
import DataVis from './pages/Dashboard/dataVis';
import Home from './pages/Home/Home';
import Profile from './pages/Profile';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
      <Route path="/auth/signin" element={<SignIn email={''} password={''} switchToSignUp={function (): void {
            throw new Error('Function not implemented.');
          } } />} />
      <Route
        path="/dashboard"
        element={<Chat /> } // Redirigez vers SignIn si l'utilisateur n'est pas connecté
      />

      <Route
         
          index
          element={
            <>
              <PageTitle title="Home" />
              <Home />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <PageTitle title="Chat Bot" />
              <Chat />
            </>
          }
        />
         <Route
          path="/voice"
          element={
            <>
              <PageTitle title="VoiceAssistant" />
              <Voice />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile" />
              <Profile />
            </>
          }
        />
        <Route
          path="/datavis"
          element={
            <>
              <PageTitle title="Data Visualisation" />
              <DataVis />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn email={''} password={''} switchToSignUp={function (): void {
                throw new Error('Function not implemented.');
              } } />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup" />
              
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <PageTitle title="Admin" />
              <Admin />
            </>
          }
        />
        <Route path="/chatbot/files" element={<ChatbotFiles />} />
        <Route path="/chatbot/users/manage" element={<UserManage />} />

      </Routes>
    </>
  );
}

export default App;
