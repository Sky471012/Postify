import { useState, useEffect } from 'react';
import logo1 from "../assets/images/logo-1.png";
import pfp from "../assets/images/pfp.jpg";
import { Link } from "react-router-dom";
import PreviousPosts from '../components/PreviousPosts';
import { useUser } from "../context/UserContext";

export default function Dashboard() {

  const [showSidebar, setShowSidebar] = useState(true);

  const { user } = useUser(); // Access the user data from context
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   console.log("Dashboard mounted");
  //   // Simulate loading state (if necessary)
  //   if (user) {
  //     setIsLoading(false);
  //   } else {
  //     // If user is not available in the context, check localStorage as fallback
  //     const storedUser = localStorage.getItem("user");
  //     if (storedUser) {
  //       setIsLoading(false);
  //     }
  //   }
  // }, [user]);

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // if (!user) {
  //   return <p>User data is not available. Please post some generated posts first.</p>;
  // }



  return (<>

  <div className="d-flex">
 

      {/* Sidebar */}

        <div className="side-bar">
          <div style={{display: "flex", flexDirection: "row", margin:"10px 0", gap:"6px", justifyContent:"space-between"}}>
            <img src={logo1} className='logo' alt="logo" />
            <h3 style={{fontSize: "40px", color:"white"}}>Postify</h3>
          </div>

          <div className='side-bar-container'>


            <div className="profile pt-3">
              <img src={pfp} alt="img" className="profile-photo" />
              <h5 className='mt-3'>Pizza Bhateja</h5>
            </div>
            <ul className="flex-column mt-5">
              <li className="nav-item mb-3">
                <Link className="nav-link " to="/"><i className="bi bi-house-door me-1"></i>Home</Link>
              </li>
              <li className="nav-item mb-3">
                <a className="nav-link " href="https://www.linkedin.com/"><i className="bi bi-linkedin me-2"></i>Go to Linkedin</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"><i className="bi bi-box-arrow-right me-1"></i> Logout</a>
              </li>
            </ul>
            <span><b>© sky</b></span>
          </div>
        
        </div>


      {/* Main Content */}
 
      <div className="flex-grow-1 text-center mb-5 main-content">
        
              


        <PreviousPosts name="Pizza Bhateja" picture={pfp}/>

        
      </div>
    </div>
  </>)
}
