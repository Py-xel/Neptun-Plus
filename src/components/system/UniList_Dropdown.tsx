import data from '@/data/universities.json';
import '@/styles/components/system/uniList_dropdown.css';
import { useMemo } from 'react';

type UniList_DropdownProps = {
  lang: 'hu' | 'en';
  value: string;
  onChange: (value: string) => void;
};

export default function UniList_Dropdown({ lang = 'hu', value, onChange }: UniList_DropdownProps) {
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
    <div className="np-uniList-dropdown-container">
      <select className="np-uniList-dropdown" value={value || supportedUniversities[0]?.value || ''} onChange={(event) => onChange(event.target.value)}>
        {supportedUniversities.map((university) => (
          <option key={university.value} value={university.value}>
            {university.label}
          </option>
        ))}
      </select>
      <i className="fa-solid fa-chevron-down np-uniList-dropdown-chevron" />
    </div>
  );
}

export const getFirstSupportedUni = () => {
  return Object.entries(data).find(([, university]) => university.supported)?.[0] ?? '';
};
