import Searchbar from '@/components/Searchbar';
import UniList from '@/components/UniList';
import '@/styles/components/UniList.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Info() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const lang = i18n?.language && i18n.language.startsWith('en') ? 'en' : 'hu';

  return (
    <div>
      <h1>{t('Content.Info.supportedUni')}</h1>
      <Searchbar onSearch={setSearch} />
      <UniList search={search} lang={lang} />
    </div>
  );
}
