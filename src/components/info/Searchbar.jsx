import '@/styles/components/info/Searchbar.css';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Searchbar({ onSearch }) {
  const { t } = useTranslation();

  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof onSearch === 'function') onSearch(value);
  }, [value, onSearch]);

  const focusInput = () => inputRef.current && inputRef.current.focus();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      focusInput();
    }
  };

  return (
    <div className="searchContainer" role="search" tabIndex={0} onClick={focusInput} onKeyDown={handleKeyDown}>
      <i className="fa-solid fa-magnifying-glass" />
      <input ref={inputRef} type="text" className="searchBar" placeholder={t('Content.Info.search')} value={value} onChange={(e) => setValue(e.target.value)} aria-label={t('Content.Info.search')} />
    </div>
  );
}
