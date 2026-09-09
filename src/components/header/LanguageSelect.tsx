import '@/styles/components/header/languageSelect.css';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';

type Language = 'en' | 'hu';

export default function LanguageSelect() {
  const [selectedLanguage, setSelectedLanguage] = useStorage(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LANGUAGE, 'hu');

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="np-language-container">
      <div className={`np-language-option ${selectedLanguage === 'en' ? 'active' : ''}`} onClick={() => handleLanguageSelect('en')}>
        <img src="https://flagcdn.com/16x12/gb.png" srcSet="https://flagcdn.com/32x24/gb.png 2x, https://flagcdn.com/48x36/gb.png 3x" width="16" height="12" alt="English" />
      </div>
      <div className={`np-language-option ${selectedLanguage === 'hu' ? 'active' : ''}`} onClick={() => handleLanguageSelect('hu')}>
        <img src="https://flagcdn.com/16x12/hu.png" srcSet="https://flagcdn.com/32x24/hu.png 2x, https://flagcdn.com/48x36/hu.png 3x" width="16" height="12" alt="Hungarian" />
      </div>
    </div>
  );
}
