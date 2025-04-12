import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPassword.css'; // <- Link to the new CSS

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(res.data.message || 'Password reset link sent!');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="forgot-page">
      <form className="forgot-box" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          className="forgot-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="forgot-button" type="submit">Send Reset Link</button>
        {message && <p className="forgot-message">{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
