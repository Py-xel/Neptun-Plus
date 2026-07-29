import { useState } from 'react';
import '@/styles/components/LanguageSelect.css';

export default function LanguageSelect() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="LanguageContainer">
      <div
        className={`LanguageOption ${selectedLanguage === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageSelect('en')}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleLanguageSelect('en');
          }
        }}>
        <img src="https://flagcdn.com/16x12/gb.png" srcSet="https://flagcdn.com/32x24/gb.png 2x, https://flagcdn.com/48x36/gb.png 3x" width="16" height="12" alt="English" />
      </div>
      <div
        className={`LanguageOption ${selectedLanguage === 'hu' ? 'active' : ''}`}
        onClick={() => handleLanguageSelect('hu')}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleLanguageSelect('hu');
          }
        }}>
        <img src="https://flagcdn.com/16x12/hu.png" srcSet="https://flagcdn.com/32x24/hu.png 2x, https://flagcdn.com/48x36/hu.png 3x" width="16" height="12" alt="Hungarian" />
      </div>
    </div>
  );
}
