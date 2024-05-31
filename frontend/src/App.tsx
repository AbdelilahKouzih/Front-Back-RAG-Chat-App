import React, { useEffect, useState, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

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
import ProtectedRoute from './components/ProtectedRoute'; // Importer le composant ProtectedRoute
import AdminRoute from './components/AdminRoute'; // Importer le composant AdminRoute
import { UserContext } from './components/UserContext';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { user } = useContext(UserContext)!;

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
        <Route
          path="/auth/signin"
          element={
            <SignIn
              email={''}
              password={''}
              switchToSignUp={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
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
          index
          element={
            <>
              <PageTitle title="Home" />
              <Home />
            </>
          }
        />

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
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
        </Route>

        {/* Routes réservées aux admins */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={
              <>
                <PageTitle title="Admin" />
                <Admin />
              </>
            }
          />
          <Route
            path="/chatbot/files"
            element={<ChatbotFiles />}
          />
          <Route
            path="/chatbot/users/manage"
            element={<UserManage />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
