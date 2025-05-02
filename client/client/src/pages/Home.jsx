import React, {useEffect} from 'react'
import backgroundImg from "../assets/images/background.png";
import landingImg from "../assets/images/Landing-page.png";
import logo1 from "../assets/images/logo-1.png";
import working_img from "../assets/images/working.png";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Features from '../components/Features';

export default function Home() {

useEffect(() => {
  const pageLinks = document.querySelectorAll(".page-scroll");

  pageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const onScroll = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const scrollTopMinus = scrollPos + 73;

    pageLinks.forEach((currLink) => {
      const val = currLink.getAttribute("href");
      const refElement = document.querySelector(val);
      if (!refElement) return;

      if (
        refElement.offsetTop <= scrollTopMinus &&
        refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
      ) {
        pageLinks.forEach((l) => l.classList.remove("active"));
        currLink.classList.add("active");
      }
    });
  };

  document.addEventListener("scroll", onScroll);

  return () => {
    document.removeEventListener("scroll", onScroll);
  };
}, []);


  
  return (<>
    {/* <!--====== HEADER PART START ======--> */}
    <header className="header-area">
      <Navbar/>

      <div
      id="home"
      className="header-hero bg_cover"
      style={{ backgroundImage: `url(${backgroundImg})` }}
      >

        <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="header-hero-content text-center">
                  <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <div className="mb-3" style={{display: "flex", alignContent: "center"}}>
                      <img src={logo1} style={{height: "70px"}} alt=""/>
                      <h1 style={{color: "white", fontSize: "70px", fontWeight:"bolder"}}>
                        Postify
                      </h1>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="header-title">
                      Effortless Content, Automated Posting 
                    </h2>
                    <p className="text">
                      Create engaging LinkedIn posts effortlessly! Generate AI-powered content in your unique style, stay ahead with trending insights, and publish seamlessly—all in just a few clicks.
                    </p>
                    <a href="javascript:void(0)" className="main-btn">
                      Get Extension
                    </a>
                  </div>
                </div>
                {/* <!-- header hero content --> */}
              </div>
            </div>
            {/* <!-- row --> */}
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="header-hero-image text-center"
                >
                  <img src={landingImg} alt="hero" />
                </div>
                {/* <!-- header hero image --> */}
              </div>
            </div>
            {/* <!-- row --> */}
          </div>
          {/* <!-- container --> */}
        <div id="particles-1" className="particles"></div>
      </div>
        {/* <!-- header hero --> */}

    </header>
    {/* <!--====== HEADER PART ENDS ======--> */}

    <Features/>


    {/* <!--====== WORKING PART START ======--> */}
      <section className="pt-5" id='working'>
        <div className="line"></div>
        <div className="row justify-content-center m-10">
          <div className="col-lg-10">
            <div className="section-title text-center pb-40" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <div ></div>
              <h3 className="title ">
                Want to know more about the working?             
              </h3>
              <img id="work-image" src={working_img} alt="working-image" style={{margin: "50px", padding:"10px"}}/>
            </div>
            {/* <!-- section title --> */}
          </div>
        </div>
      </section>
    {/* <!--====== WORKING PART ENDS ======--> */}

    <Footer/>
    </>)
}
