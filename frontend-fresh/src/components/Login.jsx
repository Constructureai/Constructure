import React from "react";

function Login({ closeOverlay }) {
  return (
    <div>
      <h2>Login</h2>
      <p>Login form goes here.</p>
      <button onClick={closeOverlay}>Close</button>
    </div>
  );
}

export default Login;