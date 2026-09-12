import React from "react";
import "./Popup.css";
import homeIcon from "bootstrap-icons/icons/house-fill.svg";
import linkedinIcon from "bootstrap-icons/icons/linkedin.svg";
import downloadIcon from "bootstrap-icons/icons/download.svg";
import githubIcon from "bootstrap-icons/icons/github.svg";
import featureShape from "./assets/services-shape.svg";
import featureShape1 from "./assets/services-shape-1.svg";
import featureShape2 from "./assets/services-shape-2.svg";
import featureShape3 from "./assets/services-shape-3.svg";

const APP_URL = "https://postify-roan.vercel.app";
const EXTENSION_URL = "https://github.com/Sky471012/Postify/releases/download/v1.0.1/postify-extension.zip";
const REPOSITORY_URL = "https://github.com/Sky471012/Postify";
const featureShape4 = chrome.runtime.getURL("src/assets/services-shape-4.png");

export default function Popup() {
  return (
    <main className="popup-shell">
      <section className="popup-hero">
        <div className="brand-lockup">
          <img
            className="popup-logo"
            src={chrome.runtime.getURL("src/assets/logo.png")}
            alt="Postify logo"
            width="30"
            height="30"
          />
          <div>
            <p className="eyebrow">LINKEDIN, REIMAGINED</p>
            <h1>Postify</h1>
          </div>
        </div>
        <span className="status-dot" aria-label="Postify is ready" />
        <p className="hero-copy">
          Turn a rough idea into a polished post without leaving LinkedIn.
        </p>
      </section>

      <section className="action-card">
        <div>
          <span className="card-label">YOUR WORKSPACE</span>
          <h2>Keep your best posts close.</h2>
          <p>Open your history, review ideas and manage your account.</p>
        </div>
        <a className="primary-action" href={`${APP_URL}/dashboard`} target="_blank" rel="noreferrer">
          <img className="dashboard-button-icon" src={chrome.runtime.getURL("src/assets/dashboard.png")} alt="" />
          Go to Dashboard
        </a>
      </section>

      <nav className="link-grid" aria-label="Postify links">
        <a href={APP_URL} target="_blank" rel="noreferrer">
          <span className="link-icon home-icon"><img className="icon-base" src={featureShape} alt="" /><img className="icon-shape" src={featureShape2} alt="" /><img className="icon-art" src={homeIcon} alt="" /></span>
          <span><strong>Home</strong><small>Explore Postify</small></span>
        </a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          <span className="link-icon linkedin-icon"><img className="icon-base" src={featureShape} alt="" /><img className="icon-shape" src={featureShape1} alt="" /><img className="icon-art" src={linkedinIcon} alt="" /></span>
          <span><strong>LinkedIn</strong><small>Start creating</small></span>
        </a>
        <a href={EXTENSION_URL} target="_blank" rel="noreferrer">
          <span className="link-icon download-icon"><img className="icon-base" src={featureShape} alt="" /><img className="icon-shape" src={featureShape3} alt="" /><img className="icon-art" src={downloadIcon} alt="" /></span>
          <span><strong>Download Extension</strong><small>Get the latest build</small></span>
        </a>
        <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
          <span className="link-icon github-icon"><img className="icon-base" src={featureShape} alt="" /><img className="icon-shape" src={featureShape4} alt="" /><img className="icon-art" src={githubIcon} alt="" /></span>
          <span><strong>GitHub</strong><small>View the repository</small></span>
        </a>
      </nav>

      <footer className="popup-footer">
        <span>AI writing, right where you work.</span>
        <span className="version">v1.0.1</span>
      </footer>
    </main>
  );
}
