import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const FILTERS = {
  es_MX: 'individualValue=@&type=3&cp=1880',
  es_ES: 'power=4&type=3',
  en: 'type=3&individual_attack=15&individual_defense=15&individual_stamina=15'
};

const LANGUAGE_LABELS = {
  es_MX: { name: 'Español Latino', label: 'Selecciona idioma' },
  es_ES: { name: 'Español España', label: 'Selecciona idioma' },
  en: { name: 'English', label: 'Select language' }
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'language' | 'form'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [formData, setFormData] = useState({
    nickname: '',
    team: 'Valor',
    raids: '',
    perfectCurrentCount: '',
    perfectLegacyCount: '',
    currentImage: null as File | null,
    legacyImage: null as File | null
  });
  const [loading, setLoading] = useState(false);

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'currentImage' | 'legacyImage') => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const copyToClipboard = (filter: string) => {
    navigator.clipboard.writeText(filter);
    alert('Filtro copiado!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('nickname', formData.nickname);
      formDataObj.append('team', formData.team);
      formDataObj.append('raids', formData.raids);
      formDataObj.append('perfectCurrentCount', formData.perfectCurrentCount);
      formDataObj.append('perfectLegacyCount', formData.perfectLegacyCount);
      formDataObj.append('language', selectedLanguage);
      if (formData.currentImage) formDataObj.append('currentImage', formData.currentImage);
      if (formData.legacyImage) formDataObj.append('legacyImage', formData.legacyImage);

      await axios.post(`${process.env.REACT_APP_API_URL}/register`, formDataObj);
      alert('Registro exitoso!');
      navigate('/leaderboard');
    } catch (error) {
      alert('Error en el registro');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'language') {
    return (
      <div className="register-container">
        <h2>Selecciona tu idioma</h2>
        <div className="language-buttons">
          {Object.entries(LANGUAGE_LABELS).map(([lang, { name }]) => (
            <button
              key={lang}
              className="lang-btn"
              onClick={() => handleLanguageSelect(lang)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <h2>Registrar Jugador</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nickname:</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Equipo:</label>
          <select name="team" value={formData.team} onChange={handleInputChange}>
            <option>Valor</option>
            <option>Instinct</option>
            <option>Mystic</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cantidad de Raids:</label>
          <input
            type="number"
            name="raids"
            value={formData.raids}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>

        <div className="filter-section">
          <h3>Pokémon Perfectos Actuales</h3>
          <div className="filter-box">
            <code>{FILTERS[selectedLanguage as keyof typeof FILTERS]}</code>
            <button
              type="button"
              className="copy-btn"
              onClick={() => copyToClipboard(FILTERS[selectedLanguage as keyof typeof FILTERS])}
            >
              Copiar
            </button>
          </div>
          <input
            type="number"
            name="perfectCurrentCount"
            placeholder="Cantidad"
            value={formData.perfectCurrentCount}
            onChange={handleInputChange}
            required
            min="0"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'currentImage')}
          />
        </div>

        <div className="filter-section">
          <h3>Pokémon Perfectos Antiguos</h3>
          <div className="filter-box">
            <code>{FILTERS[selectedLanguage as keyof typeof FILTERS]}</code>
            <button
              type="button"
              className="copy-btn"
              onClick={() => copyToClipboard(FILTERS[selectedLanguage as keyof typeof FILTERS])}
            >
              Copiar
            </button>
          </div>
          <input
            type="number"
            name="perfectLegacyCount"
            placeholder="Cantidad"
            value={formData.perfectLegacyCount}
            onChange={handleInputChange}
            required
            min="0"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'legacyImage')}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};
