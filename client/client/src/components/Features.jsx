import React from 'react'
import shape0 from "../assets/images/services-shape.svg";
import shape1 from "../assets/images/services-shape-1.svg";
import shape2 from "../assets/images/services-shape-2.svg";
import shape3 from "../assets/images/services-shape-3.svg";

export default function Features() {

    const features = [
        {
          title: "AI-Powered Post Creation",
          description: "Effortlessly generate professional LinkedIn posts tailored to your ideas using smart AI technology.",
          icon: <i className="lni lni-bolt"></i>,
          image: <img className="shape-1" src={shape1} alt="shape"/>
        },
        {
            title: "Smart Formatting & Live Preview",
            description: "Style your content with bold, italics, and lists — and see exactly how it will look before publishing.",
            icon: <i className="lni lni-cog"> </i>,
            image: <img className="shape-1" src={shape2} alt="shape"/>
        },
        {
            title: "LinkedIn Integration & History",
            description: "Log in with LinkedIn, browse your past posts, and stay organized with a personalized dashboard.",
            icon: <i className="lni lni-linkedin-original"></i>,
            image: <img className="shape-1" src={shape3} alt="shape"/>
        },
      ];

  return (<>
    {/* <!--====== SERVICES PART START ======--> */}
    <section id="features" className="services-area pt-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="section-title text-center pb-40">
              <div className="line"></div>
              <h3 className="title mt-3 mb-5">
                Key Features
              </h3>
            </div>
            {/* <!-- section title --> */}
          </div>
        </div>
        {/* <!-- row --> */}
        <div className="row justify-content-center">
              
            {features.map((feature, index) => (
          <div key={index} className="col-lg-4 col-md-7 col-sm-8">
            <div
              className="single-services text-center mt-30"
            >
              <div className="services-icon">
                <img
                  className="shape"
                  src={shape0}
                  alt="shape"
                />
                {feature.image}
                <div>{feature.icon} </div>
              </div>
              <div className="services-content mt-30">
                <h4 className="services-title">
                  {feature.title}
                </h4>
                <p className="text">
                  {feature.description}
                </p>
              </div>
            </div>
            
            {/* <!-- single services --> */}
          </div>
          ))}
        </div>
        {/* <!-- row --> */}
      </div>
      {/* <!-- container --> */}
    </section>
    {/* <!--====== SERVICES PART ENDS ======--> */}
  </>)
}
