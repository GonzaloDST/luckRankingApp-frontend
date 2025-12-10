import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

interface LeaderboardEntry {
  rank: number;
  team: string;
  nickname: string;
  raids: number;
  totalPerfects: number;
  luck: number;
  perfectRate: number;
}

export const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/leaderboard`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <button onClick={() => navigate('/')} className="back-btn">Volver</button>
      
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Equipo</th>
            <th>Nickname</th>
            <th>Raids</th>
            <th>Perfectos</th>
            <th>Tasa (%)</th>
            <th>Suerte</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.nickname}>
              <td>{entry.rank}</td>
              <td>{entry.team}</td>
              <td>{entry.nickname}</td>
              <td>{entry.raids}</td>
              <td>{entry.totalPerfects}</td>
              <td>{(entry.perfectRate * 100).toFixed(2)}%</td>
              <td className={`luck-${entry.luck > 0 ? 'positive' : 'negative'}`}>
                {entry.luck.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
