"use client"
import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/navigation';


// Lawyer Login
const LawyerLogin = ({ params }) => {

  // Error Verification
  const [isClient, setIsClient] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  // Input Fields
  const [EmailInput, setEmailInput] = useState("");
  const [UserInput, setUserInput] = useState("");
  const [PassInput, setPassInput] = useState("");
  const [ConformInput, setConformInput] = useState("");

  const signup = "Don't have an account? Sign up";
  const login = "Already have an account? Login";

  // get params
  const method = React.use(params).method;
  const isLogin = method === 'Login';

  // get session & redirect if session
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
    if (session) {
      router.push('/LawyerDashboard');
    }
  }, [session]);


  // split function design
  const SpannedText = ({ text }) => {
    return (
      <>
        {text.split(" ").map((char, index) => (
          <span key={index} className="hover:text-[#FF6F61] hover:underline">
            {char + " "}
          </span>
        ))}
      </>
    );
  };

  // -------------------------------------------------------------------------------------------------------------------

  // useEffect(() => {
  //   const fetchCsrfToken = async () => {
  //     const token = await getCsrfToken();
  //     setCsrfToken(token);
  //   };
  //   fetchCsrfToken();
  // }, []);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const res = await signIn('credentials', {
  //     redirect: false,
  //     email: EmailInput,
  //     password: PassInput,
  //     csrfToken,
  //   });

  //   if (res?.ok) {
  //     router.push('/Dashbord');
  //   } else {
  //     setErrorMessage('Failed to login. Check your credentials.');
  //   }
  // };

  // const handleSignUP = async (e) => {
  //   e.preventDefault();
  //   if (PassInput === ConformInput) {
  //     const res = await signIn('credentials', {
  //       redirect: false,
  //       name: UserInput,
  //       email: EmailInput,
  //       password: PassInput,
  //       csrfToken,
  //       isSignup: isSignup,
  //     });

  //     if (res?.ok) {
  //       router.push('/Dashbord');
  //     } else {
  //       setErrorMessage('Failed to sign up. Check your credentials.');
  //     }
  //   } else {
  //     setErrorMessage('Passwords do not match');
  //   }
  // };
  // -------------------------------------------------------------------------------------------------------------------

  // switch btw login & signup
  const switchAuth = () => {
    setIsSignup(!isSignup);
    router.push(isLogin ? "/Auth/signup/Lawyer" : "/Auth/Login/Lawyer");
  };

  return (

    <div className="w-full min-h-[70vh] flex items-center justify-center bg-[#000000] text-[#F1F1F1] mt-[-20px]">
      <div className="flex flex-col items-center min-h-[80vh] p-5 gap-5 w-full sm:max-w-[500px] justify-center bg-[#000000] text-[#F1F1F1]">
        <h1 className="font-bold text-center text-xl sm:text-4xl">
          {isLogin ? 'Welcome Back' : 'Hii, There'}
        </h1>
        {/* Form */}
        <form className="flex w-full  relative z-[9999] flex-col items-center justify-center gap-5">
          {!isLogin && (
            <input
              id="name"
              name="name"
              className="text-white w-full sm:w-[83%] bg-transparent border-2 border-white rounded-full p-2 z-10"
              placeholder="Username"
              value={UserInput}
              onChange={(e) => setUserInput(e.target.value)}
              type="text"
            />
          )}
          <input
            id="Email"
            name="Email"
            className="text-white w-full sm:w-[83%] bg-transparent border-2 border-white rounded-full p-2 z-10"
            placeholder="Email"
            type="email"
            value={EmailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <input
            id="Password"
            name="Password"
            className="text-white w-full sm:w-[83%] bg-transparent border-2 border-white rounded-full p-2 z-10"
            placeholder="Password"
            type="password"
            value={PassInput}
            onChange={(e) => setPassInput(e.target.value)}
          />
          {!isLogin && (
            <input
              id="confirmPassword"
              name="confirmPassword"
              className="text-white w-full sm:w-[83%] bg-transparent border-2 border-white rounded-full p-2 z-10"
              placeholder="Confirm Password"
              value={ConformInput}
              onChange={(e) => setConformInput(e.target.value)}
              type="password"
            />
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2 font-bold text-[#FF6F61] z-20">{errorMessage}</div>
          )}

          {/* Submit button */}
          {isLogin ? (
            <button

              className="text-white w-full sm:w-40 bg-transparent border-2 border-white rounded-full p-2 z-20"
            >
              Login
            </button>
          ) : (
            <button

              className="text-white w-full sm:w-40 bg-transparent border-2 border-white rounded-full p-2 z-20"
            >
              Sign Up
            </button>
          )}
        </form>

        {/* switch btw login & signup */}
        <div className="divider w-full flex items-center justify-center text-[#F1F1F1] z-0">
          <span className="w-full h-[1px] bg-[#F1F1F1]"></span>
        </div>
        <div className="text-[#F1F1F1]  relative z-[9999]">
          <button className="text-sm hover:cursor-pointer font-light" onClick={switchAuth}>
            {isLogin ?
              <SpannedText text={signup} />
              :
              <SpannedText text={login} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default LawyerLogin
