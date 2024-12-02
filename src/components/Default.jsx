import React, {useState, useEffect} from 'react'

const Default = ({userName}) => {
    const [currTime, setCurrTime] = useState(new Date());

    useEffect(()=>{
        const timer = setInterval(()=>{
            setCurrTime(new Date())
        }, 1000);

        return ()=> clearInterval(timer);
    })

    const getGreeting = ()=>{
        if (currTime.getHours() < 12) return "Good Morning ";
        if (currTime.getHours()< 18) return "Good Afternoon ";
        return "Good Evening ";
    }

  return (
    <div className="h-full flex justify-center items-center bg-image">
        <div className='text-center flex flex-col gap-5 text-white'>
            <h1 className='text-8xl'>{currTime.toLocaleTimeString()}</h1>
            <h2 className='text-4xl font-light'>{getGreeting()} <br/> {userName}</h2>
        </div>
    </div>
  )
}

export default Default