import React from 'react'
import backgroundImg from "../assets/images/background.png";
import logo1 from "../assets/images/logo-1.png";

export default function Footer() {
  return (
    // <!--====== FOOTER PART START ======-->
    <footer id="footer" className="footer-area pt-1 position-relative">
      <div
        style={{
          backgroundImage: `url(${backgroundImg})`,
          filter: 'blur(2px)',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          zIndex: -1,
        }}
      ></div>
      <div className="container mt-5">
        
      <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-8">
            <div className="footer-about mt-50">
              <div className="logo" >
                <div style={{display: "flex", flexDirection: "row"}}>
                  <img src={logo1} alt="logo" />
                  <h3>Postify</h3>
                </div>
              </div>
              <p className="text">
                Effortless Content, Automated Posting
              </p>
              <ul className="social">
                <li>
                  <a href="https://www.linkedin.com/in/aakash-sharma-a178062a7/">
                    <i className="lni lni-linkedin-original"> </i>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Sky471012">
                    <i className="lni lni-github-original"> </i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/sky_101247/">
                    <i className="lni lni-instagram-filled"> </i>
                  </a>
                </li>
              </ul>
            </div>
            {/* <!-- footer about --> */}
          </div>
          <div className="col-lg-5 col-md-7 col-sm-12">
            <div className="footer-link d-flex mt-50 justify-content-sm-between">
              
            </div>
            {/* <!-- footer link --> */}
          </div>
          <div className="col-lg-3 col-md-5 col-sm-12">
            <div className="footer-contact mt-50">
              <div className="footer-title ms-4">
                <h4 className="title">Contact Us</h4>
              </div>
              <ul className="contact">
                <li>+91 8929676776</li>
                <li>postify@gmail.com</li>
                <li>www.postify.com</li>
                <li>
                  Janakpuri, New Delhi.
                </li>
              </ul>
            </div>
            {/* <!-- footer contact --> */}
          </div>
        </div>
        {/* <!-- row --> */}
        {/* <!-- footer widget --> */}
        <div className="footer-copyright">
          <div className="row">
            <div className="col-lg-12">
              <div className="copyright d-sm-flex justify-content-between">
                <div className="copyright-content">
                  <p className="text">
                    Designed and Developed by <b>"Sky"</b>
                  </p>
                </div>
                {/* <!-- copyright content --> */}
              </div>
              {/* <!-- copyright --> */}
            </div>
          </div>
          {/* <!-- row --> */}
        </div>
        {/* <!-- footer copyright --> */}
      </div>
      {/* <!-- container --> */}
      <div id="particles-2"></div>
    </footer>
    // <!--====== FOOTER PART ENDS ======-->
  )
}
