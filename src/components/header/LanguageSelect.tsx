import { useToast } from '@/components/general/ToastProvider';
import '@/styles/components/header/languageSelect.css';
import i18n from '@/i18n';
import { CATEGORIES, KEYS, type Language } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useTranslation } from 'react-i18next';

export default function LanguageSelect() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { value: selectedLanguage, setValue: setSelectedLanguage } = useSettings(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LANGUAGE, 'hu');

  const handleLanguageSelect = async (language: Language) => {
    if (language === selectedLanguage) {
      return;
    }

    await setSelectedLanguage(language);
    await i18n.changeLanguage(language);
    showToast(i18n.t('Popup.Toast.saved'), { duration: 1200, type: 'success' });
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
