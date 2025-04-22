"use client"
import React, { useState, useEffect } from 'react';
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// User Login Page
const UserLogin = ({ params }) => {

  // Error Verification States
  const [isClient, setIsClient] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
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

  // get Session & redirect if session
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
    if (session) {
      if(session.user.role === 'user'){
        router.push('/UserDashboard');
      }else{
        router.push('/LawyerDashboard');
      }
    }
  }, [session]);

  // split color design function
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

  // csrf token generation
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  // handleLogin with credentials
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      role: 'user',
      email: EmailInput,
      password: PassInput,
      csrfToken,
    });

    if (res?.ok) {
      router.push('/UserDashboard');
    } else {
      setErrorMessage('Failed to login. Check your credentials.');
    }
  };

  // handleSignup with credentials
  const handleSignUP = async (e) => {
    e.preventDefault();
    if (PassInput === ConformInput) {
      const res = await signIn('credentials', {
        redirect: false,
        role: 'user',
        name: UserInput,
        email: EmailInput,
        password: PassInput,
        csrfToken,
        isSignup: 'true',
      });

      if (res?.ok) {
        router.push('/UserDashboard');
      } else {
        setErrorMessage('Failed to sign up. Check your credentials.');
      }
    } else {
      setErrorMessage('Passwords do not match');
    }
  };

  // google login handler
  const handleUserLogin = async () => {
    signIn("google", {
      callbackUrl: "/UserDashboard",
    });
  };

  // switch btw login & signup
  const switchAuth = () => {
    setIsSignup(!isSignup);
    router.push(isLogin ? "/Auth/signup" : "/Auth/Login");
  };

  return (

    <div className="w-full min-h-[70vh] flex items-center justify-center bg-[#000000] text-[#F1F1F1] mt-[-20px]">
      <div className="flex flex-col items-center min-h-[70vh] p-5 gap-5 w-full sm:max-w-[500px] justify-center bg-[#000000] text-[#F1F1F1]">
        <h1 className="font-bold text-center text-2xl sm:text-4xl">
          {isLogin ? 'Welcome Back' : 'Hii, there'}
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

          {/* Error message */}
          {errorMessage && (
            <div className="p-2 font-bold text-[#FF6F61] z-20">{errorMessage}</div>
          )}

          {/* Submit buttons */}
          {isLogin ? (
            <button onClick={handleLogin}
              className="text-white cursor-pointer w-full sm:w-40 bg-transparent border-2 border-white rounded-full p-2 z-20"
            >
              Login
            </button>
          ) : (
            <button onClick={handleSignUP}
              className="text-white cursor-pointer w-full sm:w-40 bg-transparent border-2 border-white rounded-full p-2 z-20"
            >
              Sign Up
            </button>
          )}
        </form>

        <div className="divider w-full flex items-center justify-center gap-1 text-[#F1F1F1] z-0">
          <span className="w-full h-[1px] bg-[#F1F1F1]"></span>
          <h1 className="font-bold text-[#F1F1F1]">OR</h1>
          <span className="w-full h-[1px] bg-[#F1F1F1]"></span>
        </div>

        {/* Google Button */}
        <button
          onClick={handleUserLogin}
          className="flex mx-auto cursor-pointer relative z-[9999] items-center justify-center w-full sm:max-w-xs bg-transparent border-2 border-gray-300 rounded-full shadow-md py-2 text-sm font-medium text-[#F1F1F1] "
        >
          <svg
            className="h-6 w-6 mr-2 z-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.5 0 48 48"
            version="1.1"
          >
            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Color-" transform="translate(-401.000000, -860.000000)">
                <g id="Google" transform="translate(401.000000, 860.000000)">
                  <path
                    d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                    fill="#EA4335"
                  ></path>
                  <path
                    d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3977333 C6.44540909,42.1577333 14.4268636,47.4666667 23.7136364,47.4666667 C29.5177727,47.4666667 34.7292045,45.3552 39.1733182,41.0021333 L31.1366818,35.1434667 C29.1480682,36.5552 26.5609091,37.8666667 23.7136364,37.8666667"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M46.1454545,24 C46.1454545,22.9226667 46.0477273,21.8 45.881,20.6933333 L23.7136364,20.6933333 L23.7136364,28.3733333 L36.3272727,28.3733333 C35.6904545,31.3488 34.0353636,33.5829333 31.1366818,35.1445333 L39.1733182,41.0032 C43.3027727,36.2448 46.1454545,30.0666667 46.1454545,24"
                    fill="#4285F4"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
          <span className="text-[#F1F1F1] z-20">Sign in with Google</span>
        </button>

        {/* Switch btw login & signup */}
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

export default UserLogin
