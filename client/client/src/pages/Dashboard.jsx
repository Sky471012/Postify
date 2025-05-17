import { useState, useEffect } from 'react';
import logo1 from "../assets/images/logo-1.png";
import pfp from "../assets/images/pfp.jpg";
import { Link } from "react-router-dom";
import PreviousPosts from '../components/PreviousPosts';
import { useUser } from "../context/UserContext";
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Dashboard() {

  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    let timer;

    if (isOpen) {
      setShow(false); // Hide immediately when opening
      timer = setTimeout(() => setShow(true), 100); // Show after 1s
    } else {
      setShow(false); // Optionally hide on close
    }

    return () => clearTimeout(timer);
  }, [isOpen]);



  const { user } = useUser(); // Access the user data from context
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Dashboard mounted");
    // Simulate loading state (if necessary)
    if (user) {
      setIsLoading(false);
    } else {
      // If user is not available in the context, check localStorage as fallback
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setIsLoading(false);
      }
    }
  }, [user]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <h3 style={{color:"white", margin:"auto"}}>Please post some generated posts first.</h3>;
  }



  return (<>

  <div className="d-flex">
 

      {/* Sidebar */}

        <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
          <div className="sidebar-header">
            {/* <h3>{isOpen ?'' : ''}</h3> */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          
          <div style={{display: "flex", flexDirection: "row", margin:"15px 15px 0", gap:"6px"}}>
            <img src={logo1} className='logo tooltip-icon' alt="logo" />
            {isOpen && (show && <h3 style={{fontSize: "40px", color:"white", marginBottom:"0"}}>Postify</h3>)}
          </div>
  
          <ul className="sidebar-menu">
            <li>
              <Link className="menu-item" to={"/"}>
                <i className="bi bi-house-fill"></i>
                {isOpen && show && <span className="menu-text">Home</span>}
              </Link>
            </li>
            <li>
              <a href="https://www.linkedin.com/" className="menu-item">
                <i className="bi bi-linkedin"></i>
                {isOpen && show && <span className="menu-text">Linkedin</span>}
              </a>
            </li>
            <li>
              <a href="#" className="menu-item">
                <i className="bi bi-door-open-fill"></i>
                {isOpen && show && <span className="menu-text">Logout</span>}
              </a>
            </li>
            
          </ul>
          <div className="profile-section">
            <img
              className="profile-picture"
              src={user.picture}
              alt="Profile"
            />
            {isOpen && show && (
              <div className="profile-details">
                <h5 className="profile-name">{user.name}</h5>
              </div>
            )}
          </div>
        </div>


      {/* Main Content */}
 
      <div className="flex-grow-1 text-center mb-5 main-content">
        
              


        <PreviousPosts name={user.name} picture={user.picture}/>

        
      </div>
    </div>
  </>)
}
