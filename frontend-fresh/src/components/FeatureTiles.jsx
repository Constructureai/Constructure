// File Path: frontend-fresh/src/components/FeatureTiles.jsx
import React from 'react';
import styled from 'styled-components';

// Basic styling for the container and individual tiles
const TilesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid */
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 2rem auto; /* Center the section */
`;

const TilePlaceholder = styled.div`
  background-color: #2a2a2a; /* Dark background for tiles */
  color: #ccc;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #444;
  min-height: 150px; /* Give tiles some height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function FeatureTiles() {
  // Placeholder content - replace with actual logic and data later
  // This component is currently NOT the one used for the scrolling tiles
  // on the homepage. The scrolling tiles are currently defined directly
  // within Homepage.jsx. This FeatureTiles.jsx component was likely intended
  // for a different part of the site or an earlier design idea.
  const features = [
    "Project Hub",
    "BIM & Design",
    "Content Studio",
    "Geospatial",
    "VR/AR",
    "Insights"
  ];

  return (
    <TilesContainer>
      {features.map((feature, index) => (
        <TilePlaceholder key={index}>
          <h3>{feature}</h3>
          <p>(Feature details go here)</p>
          <p>[Placeholder for dynamic/sliding effect]</p>
        </TilePlaceholder>
      ))}
    </TilesContainer>
  );
}

// Ensure this line is present and correct
export default FeatureTiles;