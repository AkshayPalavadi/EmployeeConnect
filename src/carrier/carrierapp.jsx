import React, { useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Homepage/Navbar";
import HeroSection from "./Homepage/HeroSection";
import SearchSection from "./Homepage/SearchSection";
import AboutSection from "./Homepage/AboutSection";
import Latestjobs from "./Homepage/Latestjobs";
import Login from "./Login/CarrierLogin";
import QuickDetails from "./Pages/QuickDetails";
import PersonIndex from "./carriercomponents/PersonIndex";
import "./App.css";
import Header from "./carriercomponents/Header.jsx";
import Job from "./Jobs/Job.jsx";
import JobDetail from "./Jobs/JobDetail";
import Contact from "./Jobs/Contact";
import SavedJobList from "./Profile/SavedJobList";
import AppliedJobList from "./Profile/AppliedJobList";
import PersonApp from "./carriercomponents/PersonApp";

// Layout with Navbar (Home + Profile buttons will work)
function Layout({ children, aboutRef, jobsRef, subscribeRef }) {
  const location = useLocation();

  const hideNavbarPaths = ["/login", "/register"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && (
        <Navbar
          scrollToAbout={() =>
            aboutRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          scrollToJobs={() =>
            jobsRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          scrollToSubscribe={() =>
            subscribeRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        />
      )}

      {children}
    </>
  );
}

function CarrierApp() {
  const aboutRef = useRef(null);
  const jobsRef = useRef(null);
  const subscribeRef = useRef(null);

  return (
    <Routes>
      {/* Homepage */}
      <Route
        path="/"
        element={
          <Layout
            aboutRef={aboutRef}
            jobsRef={jobsRef}
            subscribeRef={subscribeRef}
          >
            <>
              <HeroSection />
              <SearchSection />
              <div ref={aboutRef}>
                <AboutSection />
              </div>
              <div ref={jobsRef}>
                <Latestjobs subscribeRef={subscribeRef} />
              </div>
            </>
          </Layout>
        }
      />

      <Route path="/login" element={<Login />} />

      {/* Other Pages */}
      <Route path="/quickdetails" element={<QuickDetails />} />
      <Route path="/apply" element={<PersonApp />} />
      <Route path="/jobs" element={<Job />} />

      {/* ✅ ADDED: JobDetail now wrapped with Layout — Header will appear */}
      <Route
        path="/job/:id"
        element={
          <>
            <JobDetail />
          </>
        }
      />


      <Route path="/contact" element={<Contact />} />
      <Route path="/savedjoblist" element={<SavedJobList />} />
      <Route path="/appliedjoblist" element={<AppliedJobList />} />
    </Routes>
  );
}

export default CarrierApp;
