import React, {useState, useEffect, useMemo } from "react"
import { ImCross } from "react-icons/im";
import {RxReload } from "react-icons/rx";
import {IoIosAdd } from "react-icons/io";
import { FiSidebar } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { GoCopilot } from "react-icons/go";
import { LuHistory } from "react-icons/lu";
import { MdEdit } from "react-icons/md";

import {signOut} from 'firebase/auth';
import {collection, getDocs, query, orderBy} from "firebase/firestore";
import {auth, db} from '../../firebase'

import user1 from '../assets/user1.png'
import user2 from '../assets/user2.png'
import user3 from '../assets/user3.png'
import user4 from '../assets/user4.png'
import user5 from '../assets/user5.png'
import user6 from '../assets/user6.png'
import defaultPic from '../assets/defaultBrowser.png'


const Sidebar = (
    {isSidebarOpen, 
    setIsSidebarOpen, 
    isCopilotOpen, 
    setIsCopilotOpen, 
    fetchSearchResults,
    openNewTab,
    closeTab,
    tabs,
    activeTab,
    setActiveTab,
    reloadCurrentTab,
    goBackCurrentTab,
    goForwardCurrentTab,
    canGoBack,
    canGoForward,
    canReload,
    getFaviconUrl}) => {
    
    const [urlText, setUrlText] = useState("");
    const [isSignOutButton, setIsSignOutButton] = useState(false);
    const [isHistoryView, setIsHistoryView] = useState(false);
    const [history, setHistory] = useState([]);
    const [favEditOpen, setFavEditOpen] = useState(false);
    const [currFavTab, setCurrFavTab] = useState("");
    const [newFavTab, setNewFavTab] = useState("");
    const [favicons, setFavicons] = useState({
        firstUrl: "https://youtube.com",
        secondUrl: "https://google.com",
        thirdUrl: "https://facebook.com",
        first: getFaviconUrl("https://youtube.com"),
        second: getFaviconUrl("https://google.com"),
        third: getFaviconUrl("https://facebook.com"),
      });

    const userImages = [user1, user2, user3, user4, user5, user6];

    const userImage = useMemo(() => {
        const randNum = Math.floor(Math.random() * userImages.length);
        return userImages[randNum];
      }, []);


    const changeFavTab = () => {
        if (currFavTab === "first") {
          setFavicons((prev) => ({
            ...prev,
            firstUrl: `https://${newFavTab}`,
            first: getFaviconUrl(`https://${newFavTab}`),
          }));
        } else if (currFavTab === "second") {
          setFavicons((prev) => ({
            ...prev,
            secondUrl: `https://${newFavTab}`,
            second: getFaviconUrl(`https://${newFavTab}`),
          }));
        } else {
          setFavicons((prev) => ({
            ...prev,
            thirdUrl: `https://${newFavTab}`,
            third: getFaviconUrl(`https://${newFavTab}`),
          }));
        }
        setFavEditOpen(false);
    };
    
    const fetchHistory = async () => {
        if (!auth.currentUser) return;
    
        try {
          const userId = auth.currentUser.uid;
          const historyRef = collection(db, `users/${userId}/history`);
          const q = query(historyRef, orderBy("visitedAt", "desc"));
          const querySnapshot = await getDocs(q);
    
          const fetchedHistory = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
    
          setHistory(fetchedHistory);
        } catch (error) {
          console.error("Error fetching history:", error);
        }
    };

    const handleSearch =()=>{
        let trimmedUrlText = urlText.trim()
        const isLikelyUrl = trimmedUrlText.includes('.') && trimmedUrlText.split('.').pop().length > 1;

        if(urlText) {
            if (isLikelyUrl || trimmedUrlText.startsWith('http')){
                const formattedURL = trimmedUrlText.includes('http') ? trimmedUrlText: `https://${trimmedUrlText}`
                fetchSearchResults(formattedURL)
            }else{
                fetchSearchResults(trimmedUrlText)
            }
        }
    }

    const handleSignOut = async ()=>{
        await signOut(auth);
        window.location.reload();
    }

    const handleKeyDown = (e)=>{
        if (e.key == 'Enter'){
            if (urlText) handleSearch()
        }
    }

    useEffect(() => {
        const handleMouseMove = (e) => {
          if (!isSidebarOpen && e.clientX < 20) {
            setIsSidebarOpen(true);
          }
        };
    
        document.addEventListener("mousemove", handleMouseMove);
    
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
        };
      }, [isSidebarOpen]);

  return (
    <div className={`h-full px-4 py-2 transition-all duration-150 bottom-0 ${isSidebarOpen ? 'w-1/4': 'w-0 px-0 py-0'} flex flex-col`}>
        {isSidebarOpen && !isHistoryView && (
            <>        
            <div className="flex cursor-pointer items-center justify-between mt-5 mx-2">
                <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 hidden lg:block"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 hidden lg:block"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 hidden lg:block"></div>
                <div><FiSidebar className="text-xl hover:scale-125" onClick={()=>setIsSidebarOpen(!isSidebarOpen)}/></div>
            </div>

            <div className="flex gap-5 items-center">
                <FaArrowLeft className={`text-lg ${canGoBack ? 'text-black hover:scale-125 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`} onClick={canGoBack ? goBackCurrentTab : undefined}/>
                <FaArrowRight className={`text-lg ${canGoForward ? 'text-black hover:scale-125 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`} onClick={canGoForward ? goForwardCurrentTab: undefined}/>
                <RxReload className={`text-lg ${canReload ? 'text-black hover:scale-125 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`} onClick={canReload ? reloadCurrentTab : undefined}/>
            </div>
        </div>

        {/*Search Bar*/}
        <div className="relative p-4 mt-2">
            <input type="text" value={urlText} onChange={e=>setUrlText(e.target.value)} className="w-full rounded-lg pl-4 pr-12 py-2 bg-slate-200 text-black focus:outline-none truncate" onKeyDown={handleKeyDown}/>
            <div className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4 mr-2 flex gap-3">
                <FaSearch className="text-md hover:scale-125" onClick={()=>handleSearch()}></FaSearch>
                <GoCopilot className="text-lg hover:scale-125" onClick={()=>setIsCopilotOpen(!isCopilotOpen)}/>
            </div>
        </div>

        {/*History and Fav Apps */}
        <div className="flex items-center justify-evenly mt-5 cursor-pointer transition-all duration-100 ease-in-out flex-wrap gap-5">
            <div className="w-12 h-12 rounded-md bg-slate-200 hover:shadow-lg hover:scale-110 flex justify-center items-center" onClick={async()=>{
                await fetchHistory();
                setIsHistoryView(true);
            }}><LuHistory className="text-2xl"/>
            </div>
            <div className="w-12 h-12 rounded-md bg-slate-200 hover:shadow-lg hover:scale-110 flex justify-center items-center relative group cursor-pointer" onClick={()=>fetchSearchResults(favicons.firstUrl)}>
                <img src={favicons.first} alt="Youtube" className="w-6 h-6"/>
                <div className="absolute w-8 h-8 rounded-full bg-slate-600 -top-4 right-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-100" onClick={()=>{setFavEditOpen(true); setCurrFavTab("first")}}>
                    <MdEdit className="text-white"/>
                </div>
            </div>
            <div className="w-12 h-12 rounded-md bg-slate-200 hover:shadow-lg hover:scale-110 flex justify-center items-center relative group cursor-pointer" onClick={()=>fetchSearchResults(favicons.secondUrl)}>
                <img src={favicons.second} alt="Insta" className="w-6 h-6"/>
                <div className="absolute w-8 h-8 rounded-full bg-slate-600 -top-4 right-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-100" onClick={()=>{setFavEditOpen(true); setCurrFavTab("second")}}>
                    <MdEdit className="text-white"/>
                </div>
            </div>
            <div className="w-12 h-12 rounded-md bg-slate-200 hover:shadow-lg hover:scale-110 flex justify-center items-center relative group cursor-pointer" onClick={()=>fetchSearchResults(favicons.thirdUrl)}>
                <img src={favicons.third} alt="FB" className="w-6 h-6"/>
                <div className="absolute w-8 h-8 rounded-full bg-slate-600 -top-4 right-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-100" onClick={()=>{setFavEditOpen(true); setCurrFavTab("third")}}>
                    <MdEdit className="text-white"/>
                </div>
            </div>
        </div>

        {favEditOpen && 
        <div className="mt-10 flex items-center justify-center gap-2">
            <input type="text" className=" w-3/4 rounded-lg pl-4 pr-12 py-2 bg-slate-200 text-black focus:outline-none" placeholder="Enter New URL" onChange={e=>setNewFavTab(e.target.value)}/>
            <div className="py-2 px-4 bg-green-500 cursor-pointer flex justify-center items-center text-white rounded-md hover:bg-green-800" onClick={changeFavTab}>Save</div>
        </div>
        }

        {/*HR Line*/}
        <div className="w-full flex justify-center items-center my-10">
            <hr className="w-3/4"></hr>
        </div>

        {/*New and Open Tabs */}
        <div className="flex flex-col gap-5 h-3/4 overflow-scroll mb-5">
            <div 
                className="flex gap-3 items-center cursor-pointer transition-all duration-150 ease-in-out hover:bg-slate-200 rounded-lg p-2" 
                onClick={openNewTab}
            >
                <IoIosAdd className="text-2xl"/>
                <span className="hidden md:block">New Tab</span>
            </div>

            {tabs.map((tab,index)=>(
                <div key={tab.id} className={`relative group text-center flex gap-3 items-center cursor-pointer transition-all duration-150 ease-in-out hover:bg-slate-200 rounded-lg p-2 ${tab.id===activeTab ? "bg-slate-300" : ""}`} onClick={()=>setActiveTab(tab.id)}> 
                <img src={tab.favicon || defaultPic} 
                    alt="IB"
                    className="w-6 h-6" 
                    onError={(e)=>{
                        e.target.src= defaultPic; 
                    }}
                />
                <div className="absolute right-0 -top-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100"> 
                    <ImCross className="text-xs text-slate-100" onClick={()=>closeTab(tab.id)}/>
                </div>
                <span className="hidden md:block">{tab.name}</span>
            </div>
            ))}

        </div>

        <div className="self-start mt-auto mb-5 w-12 h-12 rounded-full cursor-pointer bg-slate-100 flex items-center justify-center p-2 shadow-md relative" onClick={()=>setIsSignOutButton(!isSignOutButton)}>
            <img src={userImage} alt="UserRandom" className="hover:animate-spin"/>
            {isSignOutButton &&<div className="w-24 text-center font-light bg-slate-100 text-black absolute left-14 top-1/2 -translate-y-1/2 rounded-md p-2 hover:scale-95 cursor-pointer" onClick={handleSignOut}>Sign Out</div>}
        </div>
            </>)}

        {
            isSidebarOpen && isHistoryView && (
            <>
                <div className="flex justify-between items-center text-white my-5">
                    <h1 className="text-xl font-bold">History</h1>
                    <button
                    className="text-red-500 text-lg font-bold hover:scale-90 transition-all duration-100 ease-out"
                    onClick={() => setIsHistoryView(false)}
                    >
                    <ImCross />
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow text-white font-light">
            {history.length === 0 ? ( 
                <div className="text-center mt-10">
                    <p className="text-gray-400">No history available</p>
                </div>
            ) : (
                <ul>
                    {history.map((item) => (
                        <li
                            key={item.id}
                            className="mb-4 flex justify-between items-center border-b border-gray-700 pb-2"
                        >
                            <p className="flex-1 truncate">{item.url}</p>
                            <small className="text-right font-extralight w-40">
                                {new Date(item.visitedAt).toLocaleString()}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
            </>
            )
        }

    </div>
  )
}

export default Sidebar