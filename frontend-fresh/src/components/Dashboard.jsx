import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
    padding: 20px;
    text-align: center;
`;

function Dashboard() {
    return (
        <DashboardContainer>
            <h2>Dashboard</h2>
            <p>Welcome to the Dashboard! This is a placeholder.</p>
        </DashboardContainer>
    );
}

export default Dashboard;