import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import universities from '@/data/universities.json';
import '@/styles/components/UniList.css';

export default function UniList({ search = '', lang = 'hu' }) {
  const { t } = useTranslation();

  const list = useMemo(() => {
    const entries = Object.entries(universities).map(([huName, info]) => ({
      huName,
      enName: info.en_name || '',
      supported: info.supported,
    }));
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((u) => {
      return (u.huName && u.huName.toLowerCase().includes(q)) || (u.enName && u.enName.toLowerCase().includes(q));
    });
  }, [search]);

  const supportedLabel = (supported) => {
    if (supported === null || supported === undefined) return lang === 'en' ? 'Unknown' : 'Ismeretlen';
    const isSupported = <i class="checkmark fa-solid fa-check" />;
    const notSupported = <i class="xmark fa-solid fa-x" />;
    return supported ? isSupported : notSupported;
  };

  return (
    <div className="uniList">
      <table>
        <thead>
          <tr>
            <th>{t('Content.Info.name')}</th>
            <th>{t('Content.Info.supported')}</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.huName}>
              <td>{lang === 'en' && u.enName ? u.enName : u.huName}</td>
              <td>{supportedLabel(u.supported)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
