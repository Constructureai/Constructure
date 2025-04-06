import React from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 10px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
`;

function ScreenshotWidget() {
    return (
        <WidgetContainer>
            <h3>Screenshot Widget</h3>
            <p>Placeholder for Screenshot Widget.</p>
        </WidgetContainer>
    );
}

export default ScreenshotWidget;