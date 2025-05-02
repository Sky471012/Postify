import React, { useEffect } from "react";
import logo1 from "../assets/images/logo-1.png";

export default function Navbar() {
  useEffect(() => {
    const handleScroll = () => {
      const header_navbar = document.querySelector(".navbar-area");
      const backToTop = document.querySelector(".back-to-top");
      if (!header_navbar) return;
      const sticky = header_navbar.offsetTop;

      if (window.pageYOffset > sticky) {
        header_navbar.classList.add("sticky");
        header_navbar.classList.remove("top-spacing");
      } else {
        header_navbar.classList.remove("sticky");
        header_navbar.classList.add("top-spacing");
      }      

      if (backToTop) {
        if (
          document.body.scrollTop > 50 ||
          document.documentElement.scrollTop > 50
        ) {
          backToTop.style.display = "flex";
        } else {
          backToTop.style.display = "none";
        }
      }
    };

    const pageLinks = document.querySelectorAll(".page-scroll");
    pageLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }

        const navbarToggler = document.querySelector(".navbar-toggler");
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarToggler) navbarToggler.classList.remove("active");
        if (navbarCollapse) navbarCollapse.classList.remove("show");
      });
    });

    const navbarToggler = document.querySelector(".navbar-toggler");
    if (navbarToggler) {
      navbarToggler.addEventListener("click", () => {
        navbarToggler.classList.toggle("active");
      });
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="navbar-area">
      <div className="container" >
        <div className="row">
          <div className="col-lg-12">
            <nav className="navbar navbar-expand-lg">
              <div className="navbar-brand" style={{ display: "flex", alignContent:"center"}}>
                <img src={logo1} alt="Logo" />
                <h3 style={{color: "white", fontWeight:"bolder"}}>
                  Postify
                </h3>
              </div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="toggler-icon"> </span>
                <span className="toggler-icon"> </span>
                <span className="toggler-icon"> </span>
              </button>

              <div
                className="collapse navbar-collapse sub-menu-bar"
                id="navbarSupportedContent"
              >
                <ul id="nav" className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <a className="page-scroll active" href="#home">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="page-scroll" href="#features">
                      Features
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="page-scroll" href="#working">
                      Working
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="page-scroll" href="#footer">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              <div className="navbar-btn d-none d-sm-inline-block">
                <a
                  className="main-btn"
                  data-scroll-nav="0"
                  href="https://uideck.com/templates/basic/"
                  rel="nofollow"
                >
                  Login / Signup
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
