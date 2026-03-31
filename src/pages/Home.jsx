import { useTranslation } from 'react-i18next';

import universitiesData from '../data/universities.json';

export default function Home() {
  const { t } = useTranslation();

  const universityNames = Object.keys(universitiesData);

  return (
    <div>
      <h1>{t('Content.selectUniversity')}</h1>
      <select id="universityDropdown">
        {universityNames.map((name) => (
          <option key={name} value={name}>
            {t(`${name}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
