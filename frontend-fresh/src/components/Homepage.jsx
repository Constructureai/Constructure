// File Path: frontend-fresh/src/components/Homepage.jsx
// Updated to use nightpic.png background image.

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useAuth } from "../contexts/AuthContext"; // Assuming path is correct
import Lenis from "@studio-freight/lenis"; // Assuming installed

// --- vvvvv IMPORTING THE .PNG FILE vvvvv ---
// Ensure the file in src/assets/ is actually named nightpic.png
import nightPicBackground from "../assets/nightpic.png";
// --- ^^^^^ IMPORTING THE .PNG FILE ^^^^^ ---

// import FeatureTiles from './FeatureTiles.jsx'; // This component is not currently used on the homepage
import Login from './Login.jsx'; // Ensure path is correct
import { toast } from 'react-toastify'; // Assuming installed

// --- Global Style ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #000000;
    font-family: 'Roboto', sans-serif;
  }
  html, body {
    height: 100%;
  }
`;

// --- Styled Components ---
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
  /* This uses the imported variable nightPicBackground */
  background-image: url(${nightPicBackground});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const HeaderLinks = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 1.5rem;
  z-index: 3;
`;

const HeaderLink = styled(Link)`
  color: #e5e7eb;
  text-decoration: none;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  padding: 5px 0;
  transition: color 0.3s ease;
  &:hover { color: #4b9cd3; }
`;

const HeaderActionLink = styled.a`
  color: #e5e7eb;
  text-decoration: none;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  padding: 5px 0;
  transition: color 0.3s ease;
  cursor: pointer;
  &:hover { color: #4b9cd3; }
`;

const BannerText = styled.h1`
  color: white;
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const MainContent = styled.main`
  position: relative;
  flex: 1;
`;

const TilesSection = styled.div`
  position: relative;
`;

const Tile = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  background: #000000;
  color: #e5e7eb;
  transform: translateY(${(props) => (props.$isVisible ? "0" : "50px")});
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  text-align: left;
  box-sizing: border-box;
`;

const TileContentWrapper = styled.div`
    max-width: 600px;
`;

const TileTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4b9cd3;
`;

const TileDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
`;

const Timeline = styled.div`
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 10;
`;

const TimelineLine = styled.div`
  width: 40px;
  height: 4px;
  background-color: ${(props) => (props.$isActive ? "#4b9cd3" : "#888")};
  transition: background-color 0.3s ease;
  cursor: pointer;
  &:hover { background-color: #6cb2ff; }
`;

const Footer = styled.footer`
  padding: 1.5rem 0;
  text-align: center;
  color: #aaa;
  background: #000000;
  border-top: 1px solid #333;
  width: 100%;
  font-size: 0.9rem;
`;

const FooterLink = styled(Link)`
  color: #4b9cd3;
  text-decoration: none;
  margin-left: 0.5rem;
  &:hover { color: #6cb2ff; }
`;

const LoginOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const LoginFormContainer = styled.div`
  background-color: #2a2a2a;
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
  &:hover { color: #fff; }
`;

// --- Homepage Component ---
function Homepage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [visibleTiles, setVisibleTiles] = useState([true, false, false, false, false, false]);
  const [activeTile, setActiveTile] = useState(0);
  const lenisRef = useRef(null);
  const bannerRef = useRef(null);
  const tileRefs = useRef([]);
  const [showLogin, setShowLogin] = useState(false);

  // Lenis Scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, smoothWheel: true });
    lenisRef.current = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  // Auth Navigation
  useEffect(() => {
    if (!loading && isAuthenticated === true) {
        console.log("Homepage: User is authenticated, navigating to dashboard...");
        navigate("/dashboard");
    } else if (!loading && isAuthenticated === false) {
        console.log("Homepage: User is not authenticated.");
    } else {
        console.log("Homepage: Auth state loading...");
    }
  }, [isAuthenticated, loading, navigate]);

  // Intersection Observer for Tiles
  useEffect(() => {
    const currentTileRefs = tileRefs.current.filter(Boolean);
    if (currentTileRefs.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index);
          const isVisible = entry.isIntersecting;
          setVisibleTiles((prev) => {
            const newVisible = [...prev];
            if (!isVisible && prev[index] === true) newVisible[index] = false;
            else if (isVisible) newVisible[index] = true;
            return newVisible;
          });
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
             setActiveTile(index);
          }
        });
      }, { threshold: 0.75 }
    );
    currentTileRefs.forEach((tile) => { if (tile) observer.observe(tile); });
    return () => { currentTileRefs.forEach((tile) => { if (tile) observer.unobserve(tile); }); };
  }, [tileRefs.current.length]);

  // Timeline Click Handler
  const handleLineClick = (index) => {
    const tileElement = tileRefs.current[index];
    if (tileElement && lenisRef.current) {
      lenisRef.current.scrollTo(tileElement, { offset: 0, duration: 1.5 });
      setActiveTile(index);
    } else if (tileElement) {
        window.scrollTo({ top: tileElement.offsetTop, behavior: "smooth" });
        setActiveTile(index);
    }
  };

  // Login Modal Handlers
  const handleCloseLogin = () => setShowLogin(false);
  const handleSuccessfulLogin = () => {
    setShowLogin(false);
    toast.success("Login Successful!");
  };

  // Loading State Render
  if (loading) {
      return <Container style={{ justifyContent: 'center', alignItems: 'center' }}><div>Loading...</div></Container>;
  }

  // Tile Data
  const tiles = [
    { title: "Tile 1: Project Hub", description: "Manage projects, documents, and tasks centrally." },
    { title: "Tile 2: BIM & Design", description: "Visualize models, convert 2D to 3D, run analyses." },
    { title: "Tile 3: Content Studio", description: "Create 360 tours, edit media, generate timelapses." },
    { title: "Tile 4: Geospatial", description: "Plan drone missions, analyze site data." },
    { title: "Tile 5: VR/AR", description: "Immersive model reviews and collaboration." },
    { title: "Tile 6: Insights", description: "Generate reports, predict outcomes, detect anomalies." },
  ];

  // Main Render
  return (
    <Container>
      {/* <GlobalStyle /> */}
      <Banner ref={bannerRef}>
        <HeaderLinks>
          <HeaderLink to="/">Home</HeaderLink>
          {isAuthenticated ? ( <HeaderLink to="/dashboard">Dashboard</HeaderLink> ) :
            ( <HeaderActionLink href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}> Dashboard Login </HeaderActionLink> )
          }
          {!isAuthenticated && <HeaderLink to="/signup">Sign Up</HeaderLink>}
        </HeaderLinks>
        <BannerText>Constructure</BannerText>
      </Banner>

      <MainContent>
        <TilesSection>
          {tiles.map((tile, index) => {
            if (!tileRefs.current[index]) { tileRefs.current[index] = null; }
            return (
              <Tile key={index} id={`tile-${index}`} data-index={index} ref={(el) => (tileRefs.current[index] = el)} $isVisible={visibleTiles[index]} >
                <TileContentWrapper> <TileTitle>{tile.title}</TileTitle> <TileDescription>{tile.description}</TileDescription> </TileContentWrapper>
              </Tile>
            );
          })}
        </TilesSection>
        <Timeline>
          {tiles.map((_, index) => ( <TimelineLine key={index} $isActive={index === activeTile} onClick={() => handleLineClick(index)} aria-label={`Scroll to Tile ${index + 1}`} /> ))}
        </Timeline>
      </MainContent>

      <Footer> <p>&copy; {new Date().getFullYear()} Constructure. All rights reserved.</p> </Footer>

      {showLogin && !isAuthenticated && (
        <LoginOverlay onClick={handleCloseLogin}>
          <LoginFormContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseLogin} aria-label="Close login form">&times;</CloseButton>
            <Login onLoginSuccess={handleSuccessfulLogin} closeOverlay={handleCloseLogin} />
          </LoginFormContainer>
        </LoginOverlay>
      )}
    </Container>
  );
}

export default Homepage;