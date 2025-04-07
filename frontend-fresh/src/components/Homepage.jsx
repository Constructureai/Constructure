// frontend/src/components/Homepage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const BannerContainer = styled.div`
  width: 100%;
  height: 200px;
  background-image: url('/src/assets/nightpic.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavBar = styled.nav`
  background-color: transparent;
  padding: 10px 20px;
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  color: white;
  font-size: 3rem;
  text-align: center;
`;

const LoginOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoginForm = styled.div`
  background: #FFFFFF;
  padding: 20px;
  border-radius: 5px;
  color: #2E3A59;
`;

function Homepage() {
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if authenticated
  if (isAuthenticated && user) {
    navigate('/dashboard');
  }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <BannerContainer>
          <NavBar>
            <NavLinks>
              <NavLink to="/">Home</NavLink>
              {isAuthenticated ? (
                <NavLink to="/dashboard">Dashboard</NavLink>
              ) : (
                <>
                  <NavLink to="/login" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>
                    Dashboard Login
                  </NavLink>
                  <NavLink to="/signup">Sign Up</NavLink>
                </>
              )}
            </NavLinks>
          </NavBar>
          <Title>Constructure</Title>
        </BannerContainer>
        {showLogin && (
          <LoginOverlay onClick={() => setShowLogin(false)}>
            <LoginForm onClick={(e) => e.stopPropagation()}>
              <Login inOverlay={true} closeOverlay={() => setShowLogin(false)} />
            </LoginForm>
          </LoginOverlay>
        )}
      </AppContainer>
    </>
  );
}

export default Homepage;