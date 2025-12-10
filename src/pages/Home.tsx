import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Luck Ranking App</h1>
      <div className="button-group">
        <button 
          className="action-btn register-btn"
          onClick={() => navigate('/register')}
        >
          Registrar
        </button>
        <button 
          className="action-btn leaderboard-btn"
          onClick={() => navigate('/leaderboard')}
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
};
