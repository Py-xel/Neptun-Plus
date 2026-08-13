import InputField from '@/components/general/InputField';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Searchbar({ onSearch }) {
  const { t } = useTranslation();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (typeof onSearch === 'function') onSearch(value);
  }, [value, onSearch]);

  return (
    <div>
      <InputField icon="fa-solid fa-magnifying-glass" placeholder={t('Content.Info.search')} value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}
