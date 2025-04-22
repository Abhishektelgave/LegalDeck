"use client"
import React, { useState, useEffect } from 'react';
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CategorySelector from '@/app/Auth/[method]/components/CategorySelector';

// Lawyer Login Page
const LawyerLogin = ({ params }) => {

  // Error Verification
  const [isClient, setIsClient] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  // Input Fields
  const [EmailInput, setEmailInput] = useState("");
  const [UserInput, setUserInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [UserFile, setUserFile] = useState("");
  const [PassInput, setPassInput] = useState("");
  const [ConformInput, setConformInput] = useState("");

  const signup = "Don't have an account? Sign up";
  const login = "Already have an account? Login";

  // Category change
  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  // get params
  const method = React.use(params).method;
  const isLogin = method === 'Login';

  // get session & redirect if session
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
    if (session) {
      if (session.user.role === 'user') {
        router.push('/UserDashboard');
      } else {
        router.push('/LawyerDashboard');
      }
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
      role: 'lawyer',
      email: EmailInput,
      password: PassInput,
      csrfToken,
    });

    if (res?.ok) {
      router.push('/LawyerDashboard');
    } else {
      setErrorMessage('Failed to login. Check your credentials.');
    }
  };

  // handleSignup with credentials
  const handleSignUP = async (e) => {
    e.preventDefault();

    if (PassInput !== ConformInput) {
      return setErrorMessage('Passwords do not match');
    }

    if (!UserFile) {
      return setErrorMessage('Please select a file');
    }

    const formData = new FormData();
    formData.append('username', UserInput);
    formData.append('file', UserFile);

    // upload doc and store in assests
    const uploadRes = await fetch('/api/file/upload', {
      method: 'POST',
      body: formData,
    });

    let uploadData = {};

    try {
      uploadData = await uploadRes.json();
    } catch (err) {
      console.error("Failed to parse JSON response from upload API");
      return setErrorMessage("File upload failed unexpectedly.");
    }

    if (!uploadRes.ok) {
      return setErrorMessage('File upload failed: ' + (uploadData.error || "Unknown error"));
    }

    // Continue signup logic 
    const res = await signIn('credentials', {
      redirect: false,
      role: 'lawyer',
      name: UserInput,
      email: EmailInput,
      categories: JSON.stringify(selectedCategories),
      fileName: uploadData.filename,
      password: PassInput,
      csrfToken,
      isSignup: 'true',
    });

    if (res?.ok) {
      router.push('/LawyerDashboard');
    } else {
      await fetch('/api/file/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: uploadData.filename }),
      });
      setErrorMessage('Failed to sign up. Check your credentials.');
    }
  };

  // switch btw login & signup
  const switchAuth = () => {
    setIsSignup(!isSignup);
    router.push(isLogin ? "/Auth/signup/Lawyer" : "/Auth/Login/Lawyer");
  };

  return (

    <div className="w-full min-h-[70vh] flex items-center justify-center bg-[#000000] text-[#F1F1F1] mt-[-20px]">
      <div className="flex flex-col items-center min-h-[70vh] p-5 gap-5 w-full sm:max-w-[500px] justify-center bg-[#000000] text-[#F1F1F1]">
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

          {/* CategorySelector */}
          {!isLogin && (
            <CategorySelector
              value={selectedCategories}
              onChange={handleCategoryChange}
            />
          )}

          {!isLogin && (
            <input
              id="userfile"
              name="userfile"
              className="text-[#a2e840] w-full sm:w-[83%] bg-transparent border-2 border-white rounded-full p-2 z-10"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setUserFile(file);
                }
              }}
            />
          )}

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
              onClick={handleLogin}
              className="text-white w-full sm:w-40 bg-transparent border-2 cursor-pointer border-white rounded-full p-2 z-20"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleSignUP}
              className="text-white w-full sm:w-40 bg-transparent border-2 cursor-pointer border-white rounded-full p-2 z-20"
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
          <button onClick={switchAuth} className="text-sm hover:cursor-pointer font-light" >
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
