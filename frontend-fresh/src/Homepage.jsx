// File Path: frontend-fresh/src/components/Homepage.jsx
// Correct final version with dynamic header links and transient prop fixes

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useAuth } from "../contexts/AuthContext"; // Assuming path is correct
import Lenis from "@studio-freight/lenis"; // Assuming installed
import cityscapeBackground from "../assets/cityscape-background.jpg"; // Ensure this image exists or use a valid URL
// import FeatureTiles from './FeatureTiles.jsx'; // This component is not currently used on the homepage
import Login from './Login.jsx'; // Ensure path is correct
import { toast } from 'react-toastify'; // Assuming installed

// --- Global Style ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #000000;
    font-family: 'Roboto', sans-serif; /* Apply Roboto globally */
  }
  html, body {
    height: 100%;
  }
`;

// --- Styled Components --- (Using transient props $)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #000000;
  color: #e5e7eb;
  min-height: 100vh;
`;

const Banner = styled.div`
  width: 100%;
  height: 30vh;
  background-image: url(${cityscapeBackground}); // Make sure this path is correct or use a URL
  background-size: cover;
  background-position: center;
  position: relative; /* Needed for absolute positioning of children */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  /* TODO: Add banner blending effect */
`;

const HeaderLinks = styled.div`
  position: absolute;
  top: 20px;
  left: 20px; /* Adjust positioning as needed */
  display: flex;
  gap: 1.5rem; /* Adjust spacing */
  z-index: 3; /* Ensure links are above banner content */
`;

const HeaderLink = styled(Link)`
  color: #e5e7eb;
  text-decoration: none;
  font-size: 1.1rem; /* Adjust size */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7); /* Darker shadow for better contrast */
  padding: 5px 0; /* Add some padding for easier clicking */
  transition: color 0.3s ease;

  &:hover {
    color: #4b9cd3; /* Primary color on hover */
  }
`;

// Separate style for the button-like link to open modal
const HeaderActionLink = styled.a` // Use <a> for non-navigation links
  color: #e5e7eb;
  text-decoration: none;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  padding: 5px 0;
  transition: color 0.3s ease;
  cursor: pointer; // Indicate it's clickable

  &:hover {
    color: #4b9cd3;
  }
`;


const BannerText = styled.h1`
  color: white;
  font-family: 'Orbitron', sans-serif; /* Orbitron for logo/title */
  font-size: 3rem; /* Adjust size */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const MainContent = styled.main`
  position: relative; /* Needed for fixed timeline positioning relative to this */
  flex: 1;
  /* Add padding top if banner is fixed/sticky, otherwise remove */
  /* padding-top: 30vh; */
`;

const TilesSection = styled.div`
  position: relative; /* Or static if no special positioning needed */
`;

// Use transient prop $isVisible
const Tile = styled.div`
  height: 100vh; /* Full viewport height for each tile */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  background: #000000;
  color: #e5e7eb;
  /* Apply styles based on the transient prop $isVisible */
  transform: translateY(${(props) => (props.$isVisible ? "0" : "50px")});
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  text-align: left;
  box-sizing: border-box;
  /* overflow: hidden; */ /* Be careful with overflow */
`;

const TileContentWrapper = styled.div`
   max-width: 600px;
`;

const TileTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4b9cd3; /* Use primary color */
`;

const TileDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
`;

const Timeline = styled.div`
  position: fixed; /* Fixed position relative to viewport */
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 10; /* Ensure timeline is above tiles */
`;

// Use transient prop $isActive
const TimelineLine = styled.div`
  width: 40px;
  height: 4px;
  /* Apply styles based on the transient prop $isActive */
  background-color: ${(props) => (props.$isActive ? "#4b9cd3" : "#888")}; /* Make inactive darker */
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #6cb2ff; /* Lighter blue on hover */
  }
`;

const Footer = styled.footer`
  padding: 1.5rem 0;
  text-align: center;
  color: #aaa; /* Lighter footer text */
  background: #000000;
  border-top: 1px solid #333;
  width: 100%;
  font-size: 0.9rem;
`;

const FooterLink = styled(Link)`
  color: #4b9cd3;
  text-decoration: none;
  margin-left: 0.5rem;

  &:hover {
    color: #6cb2ff;
  }
`;

// --- Login Overlay Components ---
const LoginOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* Darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; /* Above navbar */
`;

const LoginFormContainer = styled.div`
  background-color: #2a2a2a; /* Match dashboard section bg */
  padding: 2rem 3rem;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid #444;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.8rem;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #fff;
  }
`;

// --- Homepage Component ---
function Homepage() {
  const { isAuthenticated, loading } = useAuth(); // Removed unused login/user from here
  const navigate = useNavigate();
  const [visibleTiles, setVisibleTiles] = useState([true, false, false, false, false, false]);
  const [activeTile, setActiveTile] = useState(0);
  const lenisRef = useRef(null);
  const bannerRef = useRef(null); // Ref for banner to get its height
  const tileRefs = useRef([]); // Array of refs for each tile div
  const [showLogin, setShowLogin] = useState(false); // State for login modal visibility

  // Initialize Lenis for smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, smoothWheel: true });
    lenisRef.current = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  // Navigate to dashboard if already authenticated (and not loading)
  useEffect(() => {
     // Check specifically for `isAuthenticated === true` after loading is finished
    if (!loading && isAuthenticated === true) {
        console.log("Homepage: User is authenticated, navigating to dashboard...");
        navigate("/dashboard");
    } else if (!loading && isAuthenticated === false) {
        console.log("Homepage: User is not authenticated.");
        // Stay on homepage, allow login modal
    } else {
        console.log("Homepage: Auth state loading...");
    }
  }, [isAuthenticated, loading, navigate]);


  // Setup Intersection Observer for tile visibility and active state
  useEffect(() => {
    const currentTileRefs = tileRefs.current.filter(Boolean);
    if (currentTileRefs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index);
          const isVisible = entry.isIntersecting;

          // Update visibility for fade/slide effect
          setVisibleTiles((prev) => {
            const newVisible = [...prev];
            newVisible[index] = isVisible;
            return newVisible;
          });

          // Update active tile based on which one is most visible (e.g., > 60% intersection)
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveTile(index);
          }
        });
      },
      {
        threshold: [0.5, 0.6, 0.7], // Trigger checks at multiple visibility points
        // Adjust rootMargin if needed, e.g., "-30% 0px -30% 0px" to activate earlier/later
      }
    );

    currentTileRefs.forEach((tile) => { if (tile) observer.observe(tile); });
    return () => { currentTileRefs.forEach((tile) => { if (tile) observer.unobserve(tile); }); };
  }, [tileRefs.current.length]); // Rerun when tileRefs array stabilizes


  // Scroll handler for timeline clicks
  const handleLineClick = (index) => {
    const tileElement = tileRefs.current[index];
    const bannerHeight = bannerRef.current?.offsetHeight || 0; // Use banner height if needed for offset

    if (tileElement && lenisRef.current) {
      lenisRef.current.scrollTo(tileElement, { offset: 0, duration: 1.5 }); // Adjust offset/duration as needed
      setActiveTile(index); // Set active immediately
    } else if (tileElement) {
       // Fallback to native scroll if Lenis isn't ready (less likely)
        window.scrollTo({
            top: tileElement.offsetTop,
            behavior: "smooth",
        });
        setActiveTile(index);
    }
  };

  // Handler for closing the login modal
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  // Handler for successful login (passed to Login component)
  const handleSuccessfulLogin = () => {
    setShowLogin(false); // Close modal
    // No explicit navigation here, the useEffect watching isAuthenticated will handle it
     toast.success("Login Successful!"); // Optional success message
  };


  // Show loading indicator while checking auth state
  if (loading) {
      return (
          <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div>Loading...</div>
              {/* Optionally add a spinner here */}
          </Container>
      );
  }

  // Tile data (adjust content as needed)
  const tiles = [
    { title: "Tile 1: Project Hub", description: "Manage projects, documents, and tasks centrally." },
    { title: "Tile 2: BIM & Design", description: "Visualize models, convert 2D to 3D, run analyses." },
    { title: "Tile 3: Content Studio", description: "Create 360 tours, edit media, generate timelapses." },
    { title: "Tile 4: Geospatial", description: "Plan drone missions, analyze site data." },
    { title: "Tile 5: VR/AR", description: "Immersive model reviews and collaboration." },
    { title: "Tile 6: Insights", description: "Generate reports, predict outcomes, detect anomalies." },
  ];

  return (
    <Container>
      {/* <GlobalStyle /> Rendered in App.jsx now */}
      <Banner ref={bannerRef}>
        {/* Header Links using the updated logic */}
        <HeaderLinks>
          <HeaderLink to="/">Home</HeaderLink>
          {/* Add other static links like About, Contact if needed */}

          {/* Combined Dashboard / Login Link */}
          {isAuthenticated ? (
            <HeaderLink to="/dashboard">Dashboard</HeaderLink>
          ) : (
            <HeaderActionLink // Use the styled <a> tag for modal trigger
              href="#" // Use href="#" for accessibility, preventDefault handles navigation
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top due to '#' href
                setShowLogin(true); // Open the login modal
              }}
            >
              Dashboard Login
            </HeaderActionLink>
          )}

          {/* Keep Sign Up link if needed, only show when logged out */}
          {!isAuthenticated && <HeaderLink to="/signup">Sign Up</HeaderLink>} {/* Ensure you have a /signup route or component */}

        </HeaderLinks>
        <BannerText>Constructure</BannerText>
        {/* TODO: Integrate Pannellum here for interactive banner */}
      </Banner>

      <MainContent>
        <TilesSection>
          {tiles.map((tile, index) => {
            // Ensure ref array element exists before assigning
            if (!tileRefs.current[index]) { tileRefs.current[index] = null; }
            return (
              <Tile
                key={index}
                id={`tile-${index}`}
                data-index={index} // Add data-index attribute
                ref={(el) => (tileRefs.current[index] = el)}
                $isVisible={visibleTiles[index]} // Use transient prop $isVisible
              >
                <TileContentWrapper>
                  <TileTitle>{tile.title}</TileTitle>
                  <TileDescription>{tile.description}</TileDescription>
                </TileContentWrapper>
              </Tile>
            );
          })}
        </TilesSection>
        <Timeline>
          {tiles.map((_, index) => (
            <TimelineLine
              key={index}
              $isActive={index === activeTile} // Use transient prop $isActive
              onClick={() => handleLineClick(index)}
              aria-label={`Scroll to Tile ${index + 1}`}
            />
          ))}
        </Timeline>
      </MainContent>

       <Footer>
         <p>&copy; {new Date().getFullYear()} Constructure. All rights reserved.</p>
         {/* Add footer links if needed */}
         {/* <FooterLink to="/privacy">Privacy Policy</FooterLink> */}
         {/* <FooterLink to="/terms">Terms of Service</FooterLink> */}
         {/* <FooterLink to="/contact">Contact Us</FooterLink> */}
       </Footer>

       {/* Login Overlay Logic */}
       {showLogin && !isAuthenticated && (
         <LoginOverlay onClick={handleCloseLogin}> {/* Close on overlay click */}
           <LoginFormContainer onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking form */}
             <CloseButton onClick={handleCloseLogin} aria-label="Close login form">&times;</CloseButton>
             {/* Pass the success handler to the Login component */}
             <Login onLoginSuccess={handleSuccessfulLogin} closeOverlay={handleCloseLogin} />
           </LoginFormContainer>
         </LoginOverlay>
       )}
    </Container>
  );
}

export default Homepage;