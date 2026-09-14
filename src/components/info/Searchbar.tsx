import InputField from '@/components/general/InputField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type SearchProps = {
  onSearch: (value: string) => void;
};

export default function Searchbar({ onSearch }: SearchProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setValue(newValue);
    onSearch(newValue);
  };

  return (
    <div>
      <InputField type="text" icon="fa-solid fa-magnifying-glass" placeholder={t('Popup.Info.search')} value={value} onChange={handleChange} />
    </div>
  );
}
