import React, { useRef } from 'react'
import HeroSection from './Homepage/HeroSection'
import SearchSection from './Homepage/SearchSection'
import AboutSection from './Homepage/AboutSection'

import Navbar from './Homepage/Navbar'
import Latestjobs from './Homepage/Latestjobs'

const Home = () => {

     const aboutRef = useRef(null);
      const jobsRef = useRef(null);
      const subscribeRef = useRef(null);
    
      const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: "smooth" });
      const scrollToJobs = () => jobsRef.current?.scrollIntoView({ behavior: "smooth" });
      const scrollToSubscribe = () => subscribeRef.current?.scrollIntoView({ behavior: "smooth" });
    
  return (
    <div>
        <Navbar
        scrollToAbout={scrollToAbout}
        scrollToJobs={scrollToJobs}
        scrollToSubscribe={scrollToSubscribe}
      />

      <HeroSection />
      <SearchSection />

      <div ref={aboutRef}>
        <AboutSection />
      </div>

      <div ref={jobsRef}>
        <Latestjobs subscribeRef={subscribeRef} />
      </div>
    </div>
  )
}

export default Home;