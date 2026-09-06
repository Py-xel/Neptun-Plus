import universities from '@/data/universities.json';
import '@/styles/components/info/uniList.css';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function UniList({ search = '', lang = 'hu' }) {
  const { t } = useTranslation();

  const list = useMemo(() => {
    const entries = Object.entries(universities).map(([huName, info]) => ({
      huName,
      enName: info.en_name || '',
      supported: info.supported,
    }));
    const query = search.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter((university) => {
      return (university.huName && university.huName.toLowerCase().includes(query)) || (university.enName && university.enName.toLowerCase().includes(query));
    });
  }, [search]);

  return (
    <div className="np-uniList-container">
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
              <td>
                <i className={u.supported ? 'checkmark fa-solid fa-check' : 'xmark fa-solid fa-x'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
