import Searchbar from '@/components/info/Searchbar';
import UniList from '@/components/info/UniList';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Info() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const lang = i18n?.language && i18n.language.startsWith('en') ? 'en' : 'hu';

  return (
    <div>
      <h1 className="np-title">{t('Popup.Info.supportedUni')}</h1>
      <Searchbar onSearch={setSearch} />
      <UniList search={search} lang={lang} />
    </div>
  );
}
