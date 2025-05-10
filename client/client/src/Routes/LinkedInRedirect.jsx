import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const LinkedInRedirect = () => {
  const { setUserData } = useUser(); // Access global state setter
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const picture = params.get("picture");

    console.log("LinkedIn redirect query:", window.location.search);
    console.log("Parsed params:", { name, picture });


    if (name) {
      const user = { name, picture };

      // Set the user data globally using context
      setUserData(user);

      // Store in localStorage for persistence (optional)
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to the dashboard
      if (window.location.pathname === "/linkedin-redirect") {
        navigate("/dashboard", { replace: true });
      }
    } else {
      // If no name param exists, redirect to login page
      if (window.location.pathname === "/linkedin-redirect") {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, setUserData]);

  return <p>Redirecting...</p>;
};

export default LinkedInRedirect;
