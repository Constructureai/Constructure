import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`;

function ForgotPassword() {
    return (
        <FormContainer>
            <Title>Forgot Password</Title>
            <p>Placeholder for Forgot Password form.</p>
        </FormContainer>
    );
}

export default ForgotPassword;