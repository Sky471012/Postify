import React, { useState } from 'react';
import logo1 from "../assets/images/logo-1.png";
import pfp from "../assets/images/pfp.jpg";
import { Link } from "react-router";

export default function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [search, setSearch] = useState('');


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
        <div className="side-bar text-white flex-column">
          <div className='p-3' style={{display: "flex", flexDirection: "row", height:"80px", gap:"6px", margin:"0 10px", justifyContent:"space-around"}}>
            <img src={logo1} className='logo' alt="logo" />
            <h3 style={{fontSize: "40px", color:"white"}}>Postify</h3>
          </div>

          <div className='side-bar-container'>


            <div className="profile pt-5">
              <img src={pfp} alt="img" className="profile-photo" />
              <h5 className='mt-3'>Aakash Sharma</h5>
            </div>
            <ul className="flex-column mt-5 text-start">
              <li className="nav-item mb-3">
                <Link className="nav-link " to="/"><i className="bi bi-house-door me-1"></i>Home</Link>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link " href="#"><i className="bi bi-linkedin me-2"></i>Go to Linkedin</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"><i className="bi bi-box-arrow-right me-1"></i> Logout</a>
              </li>
            </ul>
            <span><b>© sky</b></span>
          </div>
        
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 text-center" style={{ marginLeft: showSidebar ? 250 : 0 }}>
        
        {/* top-bar */}
        <div className="top-bar">
              <div className="search-bar">
                <i class="bi bi-search"></i>
                <input type="text" placeholder="Search your post..." value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
              </div>

        </div>


        <h1 className='mt-5 m-3 pt-5'>Your Previous Posts </h1>
        {/* <!-- row --> */}
          <div className="row ms-5">
                
              
            <div className="col-lg-6 col-md-7 col-sm-8">
            <div className="single-post mt-30">

              <div className="date">
              <span style={{fontWeight:"normal", color:"white"}}>Posted on:</span>
                  <h5 className="post-title" style={{fontWeight:"normal"}}>
                    22 May, 2024
                  </h5>

                  <div className="line"></div>
              </div>
              
            
                  <div className="post">

                    <div className="profile">
                      <img className='profile-preview-img' src={pfp} alt="img"/>
                      <div className="name">
                        <span style={{fontSize: "1rem", fontWeight: "bold"}}>Aakash Sharma</span>
                        <span>MSIT '27</span>
                        <div style={{display: "flex", flexDirection: "row"}}>
                          <span>Now</span>
                          <div className="dot"></div>
                          <i className="bi bi-globe-central-south-asia"></i>
                        </div>
                      </div>
                    </div>

                    <div className="content">
                      <div className="text-preview" id="postPreview">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </div>

                    <div className="reaction">
                      <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px"}}>
                        <img src={pfp} alt="sky" className="reactions"/>
                        <span>Udit Bhatia and 79 others</span>
                      </div>
                      <div className="comments">
                          <span>10 comments</span>
                          <div className="dot"></div>
                          <span>3 reposts</span>
                      </div>
                    </div>

                    <div className="horizontal-line"></div>

                    <div className="react">
                      <div className="react-type">
                        <i className="bi bi-hand-thumbs-up flip-horizontal"></i>
                        <span>Like</span>
                      </div>
                      <div className="react-type">
                        <i className="bi bi-chat"></i>
                        <span>Comment</span>
                      </div>
                      <div className="react-type">
                        <i className="bi bi-chat"></i>
                        <span>Share</span>
                      </div>
                      <div className="react-type">
                        <i className="bi bi-send"></i>
                        <span>Send</span>
                      </div>
                    </div>

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
