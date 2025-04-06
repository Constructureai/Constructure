import React from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
`;

function AIAssistant() {
    return (
        <WidgetContainer>
            <h3>AI Assistant</h3>
            <p>Placeholder for AI Assistant widget.</p>
        </WidgetContainer>
    );
}

export default AIAssistant;