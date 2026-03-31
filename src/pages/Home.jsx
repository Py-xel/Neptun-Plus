import { useTranslation } from 'react-i18next';

import universitiesData from '../data/universities.json';

export default function Home() {
  const { t } = useTranslation();

  /* showing only supported universities */
  const universityNames = Object.keys(universitiesData).filter((name) => universitiesData[name].supported === true);

  return (
    <div>
      <h1>{t('Content.selectUniversity')}</h1>
      <select>
        {universityNames.map((key) => (
          <option key={key} value={key}>
            {/* Change translation based off of selected language later */}
            {universitiesData[key].en_name || key}
          </option>
        ))}
      </select>
      <h1>{t('Content.periods')}</h1>
      {/* Currently contains dummy data - to be replaced with dynamic data */}
      <table>
        <thead>
          <tr>
            <th>{t('Content.type')}</th>
            <th>{t('Content.startDate')}</th>
            <th>{t('Content.endDate')}</th>
            <th>{t('Content.remaining')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kurzusjelentkezési időszak</td>
            <td>2026.02.09 9:00</td>
            <td>2026.02.15 23:59</td>
            <td>114 Nap</td>
          </tr>
          <tr>
            <td>Végleges tárgyjelentkezés</td>
            <td>2026.02.09 9:00</td>
            <td>2026.02.15 23:59</td>
            <td>114 Nap</td>
          </tr>
          <tr>
            <td>Bejelentkezési időszak</td>
            <td>2026.02.09 9:00</td>
            <td>2026.02.15 23:59</td>
            <td>114 Nap</td>
          </tr>
          <tr>
            <td>Bejelentkezési időszak</td>
            <td>2026.02.09 9:00</td>
            <td>2026.02.15 23:59</td>
            <td>114 Nap</td>
          </tr>
          <tr>
            <td>Bejelentkezési időszak</td>
            <td>2026.02.09 9:00</td>
            <td>2026.02.15 23:59</td>
            <td>114 Nap</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
