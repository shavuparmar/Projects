import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Common/NavBar";
function Home() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <NavBar />
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
