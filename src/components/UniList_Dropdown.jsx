import { useMemo, useState } from 'react';
import '@/styles/components/UniList_Dropdown.css';
import data from '@/data/universities.json';

export default function UniList_Dropdown() {
  const supportedUniversities = useMemo(
    () =>
      Object.entries(data)
        .filter(([, university]) => university.supported)
        .map(([name]) => ({ value: name, label: name })),
    [],
  );

  const [selectedUniversity, setSelectedUniversity] = useState(supportedUniversities[0]?.value ?? '');

  return (
    <div className="uniListDropdownWrapper">
      <select className="uniListDropdown" value={selectedUniversity} onChange={(event) => setSelectedUniversity(event.target.value)}>
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
