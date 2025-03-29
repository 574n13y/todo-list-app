// frontend/src/components/Auth.js
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isRegister
        ? await registerUser({ username, password })
        : await loginUser({ username, password });
      localStorage.setItem('token', response.data.access_token);
      onLogin();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default Auth;
