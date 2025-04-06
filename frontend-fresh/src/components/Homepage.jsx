import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components"; // Using styled-components now
import { useAuth } from "../contexts/AuthContext"; // Assuming path is correct
import Lenis from "@studio-freight/lenis"; // For smooth scroll
// Import the background image (Make sure the path is correct relative to this file)
import cityscapeBackground from "../assets/cityscape-background.jpg";

// Assuming FeatureTiles is still needed somewhere below the main 6 tiles?
// If not, you can remove this import.
import FeatureTiles from './FeatureTiles.jsx';
import Login from './Login.jsx'; // Keep for overlay

// --- Removed 3D Imports ---
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import buildingModel from "../assets/models/building.glb";


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #000000;
    /* Apply font globally if desired */
    /* font-family: "Roboto", sans-serif; */
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #000000;
  color: #e5e7eb; /* Light grey text, adjust if needed */
  font-family: "Roboto", sans-serif; /* Set base font */
  min-height: 100vh; /* Important for footer positioning */
`;

const Banner = styled.div`
  width: 100%;
  height: 30vh; /* As per locked-in design */
  background-image: url(${cityscapeBackground}); /* Use imported image */
  background-size: cover;
  background-position: center;
  position: relative; /* Changed from sticky if navbar isn't inside */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const HeaderLinks = styled.div`
  position: absolute;
  top: 20px;
  left: 20px; /* Position links top-left */
  display: flex;
  gap: 2rem; /* Spacing between links */
  z-index: 3; /* Ensure links are clickable */
`;

// Use styled(Link) for React Router links
const HeaderLink = styled(Link)`
  color: #e5e7eb;
  text-decoration: none;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  &:hover {
    color: #4b9cd3; /* NC Blue on hover */
  }
`;

const BannerText = styled.h1`
  color: white;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

const MainContent = styled.main`
  position: relative; /* Needed for absolute positioning of timeline? Check CSS */
  flex: 1; /* Fill remaining vertical space */
`;

const TilesSection = styled.div`
  position: relative;
`;

// Tile with parallax effect logic from Grok 3 example
const Tile = styled.div`
  height: calc(100vh - 30vh); /* Fill viewport below banner */
  display: flex;
  /* flex-direction: column; // Keep if content is complex */
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
  padding: 4rem;
  background: #000000;
  color: #e5e7eb;
  /* Parallax/Fade effect */
  transform: translateY(${(props) => (props.isVisible ? "0" : "50px")});
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  text-align: left; /* Align text left as per screenshot */
  box-sizing: border-box; /* Include padding in height */
`;

// Separate div for content within the tile if needed for layout
const TileContentWrapper = styled.div`
   max-width: 600px; /* Limit content width */
`;

const TileTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const TileDescription = styled.p`
  font-size: 1.2rem;
  /* max-width: 600px; // Apply max-width to wrapper instead */
`;

// Timeline component
const Timeline = styled.div`
  position: fixed; /* Fixed position */
  right: 40px;
  top: 50%;
  transform: translateY(-50%); /* Center vertically */
  display: flex;
  flex-direction: column;
  gap: 30px; /* Space between lines */
  z-index: 3; /* Above tiles */
`;

const TimelineLine = styled.div`
  width: 40px;
  height: 4px;
  background-color: ${(props) => (props.isActive ? "#4b9cd3" : "#e5e7eb")}; /* Blue if active, white otherwise */
  transition: background-color 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: #6cb2ff; /* Lighter blue on hover */
  }
`;

// Footer component (now separate)
const Footer = styled.footer`
  padding: 1rem 0;
  text-align: center;
  color: #e5e7eb;
  background: #000000; /* Match background */
  border-top: 1px solid #333; /* Optional separator */
  /* Removed z-index, should naturally be at bottom */
  width: 100%;
`;

const FooterLink = styled(Link)` /* Use Link for internal navigation */
  color: #4b9cd3;
  text-decoration: none;
  margin-left: 0.5rem;
  &:hover {
    color: #6cb2ff;
  }
`;

// --- REMOVED BuildingModel Component ---

function Homepage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [visibleTiles, setVisibleTiles] = useState([true, false, false, false, false, false]); // Initialize first tile as visible
  const [activeTile, setActiveTile] = useState(0);
  // Removed bannerHeight and tileHeight state, use refs directly if needed or recalculate
  const bannerRef = useRef(null);
  const tileRefs = useRef([]); // Array to hold refs for each tile

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
       smoothWheel: true, // Lenis options often include smoothWheel
       smoothTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Removed effect for setting heights from state

  // Navigate if authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  // Intersection Observer for parallax effect and active tile
  useEffect(() => {
    // Ensure refs are populated before observing
     const currentTileRefs = tileRefs.current.filter(Boolean); // Filter out null refs
     if (currentTileRefs.length === 0) return;


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index); // Use data-index attribute
          const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.4; // Adjust threshold

          // Update visibility state for parallax
           setVisibleTiles((prev) => {
             const newVisible = [...prev];
             newVisible[index] = isVisible;
             return newVisible;
           });

           // Update active tile based on which one is intersecting sufficiently
           // This simple logic might make the last visible one active, adjust if needed
           if (isVisible) {
              setActiveTile(index);
           }
        });
      },
      {
          threshold: [0.4, 0.6] // Trigger when 40% and 60% visible - experiment with this
      }
    );

    currentTileRefs.forEach((tile) => {
      observer.observe(tile);
    });

    return () => {
      currentTileRefs.forEach((tile) => {
        observer.unobserve(tile);
      });
    };
  // Re-run observer if the number of tiles changes (though it's fixed here)
  }, [tileRefs.current.length]); // Depend on the length potentially

  // Scroll handler for timeline clicks
  const handleLineClick = (index) => {
    const tileElement = tileRefs.current[index];
    if (tileElement) {
       // Scroll the tile into view - Lenis might interfere with window.scrollTo,
       // check Lenis docs for programmatic scrolling if needed.
       // Basic scrollIntoView as fallback:
       tileElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
       setActiveTile(index); // Set active state immediately
    }
  };

  if (loading) return <div>Loading...</div>;

  // Define tile content - Tile 1 now has description only
  const tiles = [
    { title: "Tile 1 Placeholder", description: "Description for Tile 1 goes here." }, // Placeholder content like locked-in screenshot
    { title: "Tile 2 Placeholder", description: "Description for Tile 2 goes here." },
    { title: "Tile 3 Placeholder", description: "Description for Tile 3 goes here." },
    { title: "Tile 4 Placeholder", description: "Description for Tile 4 goes here." },
    { title: "Tile 5 Placeholder", description: "Description for Tile 5 goes here." },
    { title: "Tile 6 Placeholder", description: "Description for Tile 6 goes here." },
    // Note: The footer is now separate, not part of the last tile's content
  ];

  return (
    <Container>
      <GlobalStyle />
      <Banner ref={bannerRef}>
        <HeaderLinks>
          <HeaderLink to="/">Home</HeaderLink>
          <HeaderLink to="/features">Features</HeaderLink>
          <HeaderLink to="/subscribe">Subscribe Now</HeaderLink> {/* Keep or remove based on design */}
          <HeaderLink to="/pricing">Pricing</HeaderLink>
          <HeaderLink to="/about">About Us</HeaderLink>
          <HeaderLink to="/dashboard">Dashboard</HeaderLink>
          <HeaderLink to="/login">Login</HeaderLink>
        </HeaderLinks>
        <BannerText>Welcome to Constructure</BannerText>
      </Banner>
      <MainContent>
        <TilesSection>
          {tiles.map((tile, index) => (
            <Tile
              key={index}
              id={`tile-${index}`} // ID for observer
              data-index={index} // Data attribute for observer callback
              ref={(el) => (tileRefs.current[index] = el)} // Assign ref to array
              isVisible={visibleTiles[index]} // Control visibility/animation
            >
              {/* Wrap content for styling/layout within tile */}
              <TileContentWrapper>
                <TileTitle>{tile.title}</TileTitle>
                <TileDescription>{tile.description}</TileDescription>
              </TileContentWrapper>
            </Tile>
          ))}
        </TilesSection>
        <Timeline>
          {tiles.map((_, index) => (
            <TimelineLine
              key={index}
              isActive={index === activeTile}
              onClick={() => handleLineClick(index)}
            />
          ))}
        </Timeline>
      </MainContent>
      {/* Render Footer outside MainContent */}
      <Footer>
        © {new Date().getFullYear()} Constructure. All rights reserved. |{/* Use current year */}
        <FooterLink to="/privacy">Privacy Policy</FooterLink> |{/* Use Link */}
        <FooterLink to="/terms">Terms of Service</FooterLink> |{/* Use Link */}
        <FooterLink to="/contact">Contact Us</FooterLink> {/* Use Link */}
      </Footer>
    </Container>
  );
}

export default Homepage;