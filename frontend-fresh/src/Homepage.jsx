import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useAuth } from "../contexts/AuthContext"; // Assuming path is correct
import Lenis from "@studio-freight/lenis"; // Assuming installed
import cityscapeBackground from "../assets/cityscape-background.jpg"; // Ensure this image exists
import FeatureTiles from './FeatureTiles.jsx'; // Assuming this exists (though not used directly in this layout)
import Login from './Login.jsx'; // Ensure path is correct
import { toast } from 'react-toastify'; // Assuming installed

// --- Global Style ---
const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; background-color: #000000; }
  html, body { height: 100%; }
`;

// --- Styled Components --- (Using transient props $)
const Container = styled.div`
  display: flex; flex-direction: column; background-color: #000000;
  color: #e5e7eb; font-family: "Roboto", sans-serif; min-height: 100vh;
`;

const Banner = styled.div`
  width: 100%; height: 30vh; background-image: url(${cityscapeBackground});
  background-size: cover; background-position: center; position: relative; /* Changed from sticky/fixed */
  display: flex; align-items: center; justify-content: center; z-index: 1;
`;

const HeaderLinks = styled.div`
  position: absolute; top: 20px; left: 20px; display: flex; gap: 2rem; z-index: 3;
`;

const HeaderLink = styled(Link)`
  color: #e5e7eb; text-decoration: none; font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  &:hover { color: #4b9cd3; }
`;

const BannerText = styled.h1`
  color: white; font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); z-index: 2;
`;

const MainContent = styled.main`
  position: relative; flex: 1;
`;

const TilesSection = styled.div`
  position: relative;
`;

const Tile = styled.div`
  height: 100vh; /* Full viewport height for each tile */
  display: flex; justify-content: center;
  align-items: center; padding: 4rem; background: #000000; color: #e5e7eb;
  /* Apply styles based on the transient prop $isVisible */
  transform: translateY(${(props) => (props.$isVisible ? "0" : "50px")});
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  text-align: left; box-sizing: border-box;
  /* overflow: hidden; */ /* Prevent content overflow issues */
`;

const TileContentWrapper = styled.div`
   max-width: 600px;
`;

const TileTitle = styled.h2`
  font-size: 2.5rem; margin-bottom: 1rem;
`;

const TileDescription = styled.p`
  font-size: 1.2rem;
`;

const Timeline = styled.div`
  position: fixed; right: 40px; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 30px; z-index: 10; /* Higher z-index */
`;

const TimelineLine = styled.div`
  width: 40px; height: 4px;
  /* Apply styles based on the transient prop $isActive */
  background-color: ${(props) => (props.$isActive ? "#4b9cd3" : "#e5e7eb")};
  transition: background-color 0.3s ease; cursor: pointer;
  &:hover { background-color: #6cb2ff; }
`;

const Footer = styled.footer`
  padding: 1rem 0; text-align: center; color: #e5e7eb; background: #000000;
  border-top: 1px solid #333; width: 100%;
`;

const FooterLink = styled(Link)`
  color: #4b9cd3; text-decoration: none; margin-left: 0.5rem;
  &:hover { color: #6cb2ff; }
`;

// Login Overlay Components
const LoginOverlay = styled.div` /* styles */ `;
const LoginFormContainer = styled.div` /* styles */ `;
const CloseButton = styled.button` /* styles */ `;

// --- Homepage Component ---
function Homepage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [visibleTiles, setVisibleTiles] = useState([true, false, false, false, false, false]);
  const [activeTile, setActiveTile] = useState(0);
  const lenisRef = useRef(null);
  const bannerRef = useRef(null); // Ref for banner to get its height
  const tileRefs = useRef([]); // Array of refs for each tile div

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, smoothWheel: true }); // Slightly longer duration
    lenisRef.current = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  // Navigate if authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) { navigate("/dashboard"); }
  }, [isAuthenticated, loading, navigate]);

  // Intersection Observer to update highlight based on manual scroll
  useEffect(() => {
    const currentTileRefs = tileRefs.current.filter(Boolean);
    if (currentTileRefs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index);
          const isVisible = entry.isIntersecting;

          // Update visibility for fade effect
          setVisibleTiles((prev) => {
            const newVisible = [...prev];
            newVisible[index] = isVisible;
            return newVisible;
          });

          // Update active tile based on intersection ratio
          // This threshold determines which tile highlights during manual scroll
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) { // Increased threshold
              setActiveTile(index);
          }
        });
      },
      {
        threshold: 0.6, // Trigger when 60% is visible
      }
    );

    currentTileRefs.forEach((tile) => { if (tile) observer.observe(tile); });

    return () => {
      currentTileRefs.forEach((tile) => { if (tile) observer.unobserve(tile); });
    };
  }, [tileRefs.current.length]);


  // Scroll handler for timeline clicks - Reverted to offset calculation
  const handleLineClick = (index) => {
    const tileElement = tileRefs.current[index];
    const bannerElement = bannerRef.current;

    if (tileElement) {
      // FIX 1: Set active tile immediately on click
      setActiveTile(index);

      // FIX 2: Use Lenis scroll with calculated offset
      const bannerHeight = bannerElement?.offsetHeight || 0; // Get banner height
      // Scroll to the top of the tile minus the banner height
      // Add a small positive offset (e.g., 1px) if it consistently lands slightly too high
      const targetPosition = tileElement.offsetTop - bannerHeight + 1;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetPosition, {
           // duration can be set here if needed, overrides instance default
           // duration: 1.5
        });
      } else {
        // Fallback to native scroll
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  };


  if (loading) return <div>Loading...</div>; // Handle loading state

  // Tile data
  const tiles = [
    { title: "Tile 1: Project Hub", description: "Manage projects, documents, and tasks centrally." },
    { title: "Tile 2: BIM & Design", description: "Visualize models, convert 2D to 3D, run analyses." },
    { title: "Tile 3: Content Studio", description: "Create 360 tours, edit media, generate timelapses." },
    { title: "Tile 4: Geospatial", description: "Plan drone missions, analyze site data." },
    { title: "Tile 5: VR/AR", description: "Immersive model reviews and collaboration." },
    { title: "Tile 6: Insights", description: "Generate reports, predict outcomes, detect anomalies." },
  ];

  const [showLogin, setShowLogin] = useState(false);
  const handleSuccessfulLogin = () => { setShowLogin(false); };

  return (
    <Container>
      <GlobalStyle />
      <Banner ref={bannerRef}> {/* Add ref to banner */}
        <HeaderLinks>
          <HeaderLink to="/">Home</HeaderLink>
          {/* Add other links */}
           {!isAuthenticated && <HeaderLink to="/login" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>Login</HeaderLink>}
           {!isAuthenticated && <HeaderLink to="/signup">Sign Up</HeaderLink> }
           {isAuthenticated && <HeaderLink to="/dashboard">Dashboard</HeaderLink> }
        </HeaderLinks>
        <BannerText>Constructure</BannerText>
      </Banner>
      <MainContent>
        <TilesSection>
          {tiles.map((tile, index) => {
             if (!tileRefs.current[index]) { tileRefs.current[index] = null; }
             return (
              <Tile
                key={index}
                id={`tile-${index}`}
                data-index={index}
                ref={(el) => (tileRefs.current[index] = el)}
                $isVisible={visibleTiles[index]} // Use transient prop
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
              $isActive={index === activeTile} // Use transient prop
              onClick={() => handleLineClick(index)}
              aria-label={`Scroll to Tile ${index + 1}`}
            />
          ))}
        </Timeline>
      </MainContent>
       <Footer>
         <p>&copy; {new Date().getFullYear()} Constructure. All rights reserved.</p>
         {/* <FooterLink to="/terms">Terms</FooterLink> */}
         {/* <FooterLink to="/privacy">Privacy</FooterLink> */}
       </Footer>

       {/* Login Overlay Logic */}
       {showLogin && !isAuthenticated && (
         <LoginOverlay onClick={() => setShowLogin(false)}>
           <LoginFormContainer onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setShowLogin(false)}>&times;</CloseButton>
             <Login onLoginSuccess={handleSuccessfulLogin} closeOverlay={() => setShowLogin(false)} />
           </LoginFormContainer>
         </LoginOverlay>
       )}
    </Container>
  );
}

export default Homepage;