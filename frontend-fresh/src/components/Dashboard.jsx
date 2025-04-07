// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #4B9CD3;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #ffffff;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NavItem = styled.li`
  margin-bottom: 10px;
`;

const NavLink = styled(Link)`
  display: block;
  padding: 10px 15px;
  border-radius: 5px;
  color: #333;
  text-decoration: none;
  background-color: #fff;
  transition: background-color 0.2s;
  &:hover {
    background-color: #e9e9e9;
  }
  &.active {
    background-color: #2E3A59;
    color: white;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 15px;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: #B87333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Dashboard = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <h2>Dashboard</h2>
        <NavList>
          <NavItem><NavLink to="/dashboard/projecthub" activeClassName="active">Project Hub</NavLink></NavItem>
          <NavItem><NavLink to="/dashboard/bim" activeClassName="active">BIM Studio</NavLink></NavItem>
          <NavItem><NavLink to="/dashboard/design" activeClassName="active">Design Studio</NavLink></NavItem>
          <NavItem><NavLink to="/dashboard/content" activeClassName="active">Content Studio</NavLink></NavItem>
          <NavItem><NavLink to="/dashboard/geospatial" activeClassName="active">Geospatial & Autonomous Robotics</NavLink></NavItem>
          <NavItem><NavLink to="/dashboard/thermal" activeClassName="active">Thermal Analysis</NavLink></NavItem>
          <NavItem><NavLink to="/dashboard/vrar" activeClassName="active">VR/AR Viewer</NavLink></NavItem>
          <NavItem><NavLink to="/dashboard/my-account" activeClassName="active">My Account</NavLink></NavItem>
          {user.role === 'CEO' && (
            <NavItem><NavLink to="/dashboard/ceo" activeClassName="active">CEO</NavLink></NavItem>
          )}
        </NavList>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
      <MainContent>
        <h2>Welcome to Your Dashboard, {user.username}!</h2>
        <Outlet />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;