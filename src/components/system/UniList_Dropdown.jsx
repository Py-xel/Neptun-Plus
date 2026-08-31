import data from '@/data/universities.json';
import '@/styles/components/system/UniList_Dropdown.css';
import { useMemo } from 'react';

export default function UniList_Dropdown({ lang = 'hu', value, onChange }) {
  const supportedUniversities = useMemo(
    () =>
      Object.entries(data)
        .filter(([, university]) => university.supported)
        .map(([huName, university]) => ({
          value: huName,
          label: lang === 'en' && university.en_name ? university.en_name : huName,
        })),
    [lang],
  );

  return (
    <div className="uniListDropdownWrapper">
      <select className="uniListDropdown" value={value ?? supportedUniversities[0]?.value ?? ''} onChange={(event) => onChange?.(event.target.value)}>
        {supportedUniversities.map((university) => (
          <option key={university.value} value={university.value}>
            {university.label}
          </option>
        ))}
      </select>
      <i className="fa-solid fa-chevron-down uniListDropdownChevron" />
    </div>
  );
}

export const getFirstSupportedUni = () => {
  return Object.entries(data).find(([, university]) => university.supported)?.[0] ?? '';
};
