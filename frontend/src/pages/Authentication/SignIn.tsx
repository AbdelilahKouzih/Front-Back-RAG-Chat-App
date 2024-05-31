import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import 'animate.css'; // Import animate.css
import { UserContext } from './../../components/UserContext'; // Importez le contexte

interface SignInProps {
  switchToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const { setUser } = useContext(UserContext)!; // Utilisez le contexte

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Récupérer le token JWT du stockage local

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setAuthenticated(true);
        setRole(data.user.role); // Set the role based on the server response
        setUser({ id: data.user.id, role: data.user.role }); // Stocker l'utilisateur dans le contexte

        // Stocker le token JWT dans le stockage local
        localStorage.setItem('token', data.token);

        console.log('User is authenticated');
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error occurred during authentication:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  if (authenticated) {
    if (role === 'admin') {
      return <Navigate to="/chatbot/files" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return (
    <div className=" w-full flex justify-center items-center h-screen animate__animated animate__fadeIn animate__faster">
    <div className="w-full flex items-center justify-center border-stroke dark:border-strokedark xl:w-1/2">
      <div className="w-full p-4 sm:p-12.5 xl:p-2.5">
        <span className="block text-center text-lg font-medium mb-4">
          Start for free
        </span>
        <h2 className="text-3xl font-bold text-center text-white dark:text-white mb-6">
          Sign In to Chat Bot
        </h2>
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="relative">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </label>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="relative">
              <input
                type="password"
                id="password"
                placeholder="6+ Characters, 1 Capital letter"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </label>
          </div>

          <div className="mb-5">
            <input
              type="submit"
              value="Sign In"
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            />
          </div>

          <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
            <span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_191_13499)">
                  <path
                    d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                    fill="#34A853"
                  />
                  <path
                    d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                    fill="#EB4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_191_13499">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Sign in with Google
          </button>

          <div className="mt-6 text-white text-center">
            <p>
              Don’t have any account?{' '}
              <button onClick={props.switchToSignUp} className="text-primary">
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default SignIn;
