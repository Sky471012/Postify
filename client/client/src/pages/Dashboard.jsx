import React, { useState } from 'react';
import logo1 from "../assets/images/logo-1.png";
import pfp from "../assets/images/pfp.jpg";

export default function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (<>

  <div className="d-flex">
      {/* Toggle Button */}
      <button
        className="btn btn-outline-dark m-3 d-md-none"
        onClick={() => setShowSidebar(!showSidebar)}
        style={{ zIndex: 1000 }}
      >
        <i className={`bi ${showSidebar ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {/* Sidebar */}
      {showSidebar && (
        <div className="side-bar text-white p-3 flex-column text-center">
          <div style={{display: "flex", flexDirection: "row"}}>
            <img src={logo1} className='logo' alt="logo" />
            <h3 style={{fontSize: "40px", color:"white"}}>Postify</h3>
          </div>
          <div className="profile mt-5">
            <img src={pfp} alt="" className="profile-photo" />
            <h5 className='mt-3'>Aakash Sharma</h5>
          </div>
          <ul className="flex-column mt-5 text-start ">
            <li className="nav-item mb-3">
              <a className="nav-link " href="#"><i className="bi bi-house-door me-1"></i>Home</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link " href="#"><i class="bi bi-linkedin me-2"></i>Go to Linkedin</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#"><i className="bi bi-box-arrow-right me-1"></i> Logout</a>
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 p-4 text-center" style={{ marginLeft: showSidebar ? 270 : 0 }}>
        <h1 className='m-3'>Your Previous Posts </h1>
        {/* <!-- row --> */}
          <div className="row">
                
              
            <div className="col-lg-5 col-md-7 col-sm-8">
              <div className="single-post mt-30">
                
                <div className="post-content">
                  <span style={{fontWeight:"normal", color:"white"}}>Posted on:</span>
                  <h5 className="post-title" style={{fontWeight:"normal"}}>
                    22 May, 2024
                  </h5>

                  <div className="line"></div>

                  <h5>Post Content:</h5>
                  <p className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
              
              {/* <!-- single post --> */}
            </div>

            <div className="col-lg-5 col-md-7 col-sm-8">
              <div className="single-post mt-30">
                
                <div className="post-content">
                  <span style={{fontWeight:"normal", color:"white"}}>Posted on:</span>
                  <h5 className="post-title" style={{fontWeight:"normal"}}>
                    22 May, 2024
                  </h5>

                  <div className="line"></div>

                  <h5>Post Content:</h5>
                  <p className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
              
              {/* <!-- single post --> */}
            </div>
            <div className="col-lg-5 col-md-7 col-sm-8">
              <div className="single-post mt-30">
                
                <div className="post-content">
                  <span style={{fontWeight:"normal", color:"white"}}>Posted on:</span>
                  <h5 className="post-title" style={{fontWeight:"normal"}}>
                    22 May, 2024
                  </h5>

                  <div className="line"></div>

                  <h5>Post Content:</h5>
                  <p className="text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
              
              {/* <!-- single post --> */}
            </div>
            

            
          </div>
          {/* <!-- row --> */}
      </div>
    </div>
  </>)
}
