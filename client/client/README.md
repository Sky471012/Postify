// useEffectHome.js (React equivalent)
import { useEffect } from "react";
import GLightbox from "glightbox";
import WOW from "wowjs";
import counterUp from "counterup2";
import "glightbox/dist/css/glightbox.css";

export default function useHomeEffects() {
  useEffect(() => {
    // ==== Preloader
    const fadeout = () => {
      const preloader = document.querySelector(".preloader");
      if (preloader) {
        preloader.style.opacity = "0";
        preloader.style.display = "none";
      }
    };
    window.onload = () => setTimeout(fadeout, 500);

    

    // Lightbox
    GLightbox({
      href: "https://www.youtube.com/watch?v=r44RKWyfcFw",
      type: "video",
      source: "youtube",
      width: 900,
      autoplayVideos: true,
    });

    // Counter
    const cu = new counterUp({
      start: 0,
      duration: 2000,
      intvalues: true,
      interval: 100,
      append: "k",
    });
    document.querySelectorAll(".counter").forEach((el) => cu.start(el));

    // WOW animation
    new WOW.WOW().init();

    // Particles
    const loadParticles = (id) => {
      if (!document.getElementById(id)) return;
      particlesJS(id, {
        particles: {
          number: {
            value: 40,
            density: {
              enable: true,
              value_area: 4000,
            },
          },
          color: { value: ["#FFFFFF"] },
          shape: { type: "circle" },
          opacity: {
            value: 0.15,
            random: true,
            anim: { enable: true, speed: 0.2, opacity_min: 0.15 },
          },
          size: {
            value: 50,
            random: true,
            anim: { enable: true, speed: 2, size_min: 5 },
          },
          line_linked: { enable: false },
          move: { enable: true, speed: 1, direction: "top", random: true },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true,
          },
        },
        retina_detect: true,
      });
    };
    loadParticles("particles-1");
    loadParticles("particles-2");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);
}
