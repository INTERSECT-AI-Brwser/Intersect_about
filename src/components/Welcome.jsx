import React, {useState} from 'react'
import {auth} from '../../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

import landingPage from '../assets/landingPage.png';
import { GiArtificialIntelligence } from "react-icons/gi";
import { PiBrowsers } from "react-icons/pi";
import { MdTerminal } from "react-icons/md";
import { GrSystem } from "react-icons/gr";



const Welcome = ({setIsAuthenticated, setUserName}) => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    if (!validateInputs()) return;
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setUserName(fName+ " " + lName);
      setIsAuthenticated(true); 
    } catch (err) {
      let formattedError = err.message.replace("Firebase: Error (auth/", "")
      setError(formattedError.slice(0,-2).toUpperCase());
    }
  };

  const validateInputs = () => {
    if (isSignUp) {
      if (!fName.trim()) {
        setError("First name is required.");
        return false;
      }
      if (!lName.trim()) {
        setError("Last name is required.");
        return false;
      }
    }
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  return (
    <div className="w-screen h-screen gradient-bg text-white flex items-center justify-center transition-all ease-in duration-100">
        <div className='w-1/2 h-full flex flex-col items-center p-10'>
            <img src={landingPage} alt="Landing-Page" className='w-48 h-48 rounded-full shadow-lg' />
            <h1 className='text-4xl font-bold my-10'>What's So Special?</h1>

            <div className='flex items-center justify-start w-1/2 mb-5 gap-5 '>
              <PiBrowsers className='w-16 h-16'/>
              <h3 className='font-light text-lg'>A powerful browser</h3>
            </div>

            <div className='flex items-center justify-start w-1/2 mb-5 gap-5'>
              <GrSystem className='w-16 h-16'/>
              <h3 className='font-light text-lg'>In-house operating system</h3>
            </div>

            <div className='flex items-center justify-start w-1/2 mb-5 gap-5'>
              <GiArtificialIntelligence className='w-16 h-16'/>
              <h3 className='font-light text-lg'>In-depth AI Search</h3>
            </div>

            <div className='flex items-center justify-start w-1/2 mb-5 gap-5'>
              <MdTerminal className='w-16 h-16'/>
              <h3 className='font-light text-lg'>Your own browser terminal</h3>
            </div>
        </div>

        <div className='w-1/2 h-full flex flex-col items-center justify-center'>
          <h1 className='text-5xl font-bold mb-5'>Welcome To Intersect</h1>
          <p className='font-light text-lg'>Your opearting system and browser in one place</p>
          <div className='flex flex-col gap-5 w-1/2 mt-10 text-black'>
            {isSignUp &&  <>
              <input
            type="text"
            placeholder="First Name"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl outline-none border-none"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl outline-none border-none"
          />
            </>}
         
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl outline-none border-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl outline-none border-none"
          />
        </div>

        <button onClick={handleAuth} className="bg-[#006080] text-white w-1/2 px-2 py-4 rounded-lg mt-10 mb-4 text-lg hover:scale-95 hover:bg-[#0083B0] shadow-lg">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-white text-lg font-light hover:text-blue-100">
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>

        {error && <p className="bg-red-500 text-white mt-5 p-2 rounded-md w-1/2 text-center">{error}</p>}
        </div>

        
    </div>
      
  )
}

export default Welcome