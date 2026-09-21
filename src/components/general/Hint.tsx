import hintHideHeaders from '@/assets/images/hint_hide_headers.png';
import '@/styles/components/general/hint.css';
import { useTranslation } from 'react-i18next';

type HintProps = {
  id: string;
};

const hints: Record<string, { image: string; descriptionKey: string }> = {
  'disable-headers': {
    image: hintHideHeaders,
    descriptionKey: 'Popup.Hints.disableHeaders',
  },
};

export default function Hint({ id }: HintProps) {
  const { t } = useTranslation();
  const hint = hints[id];

  if (!hint) return null;

  return (
    <div className="np-hint-window">
      <img src={hint.image} />
      <div className="np-hint-description">{t(hint.descriptionKey)}</div>
    </div>
  );
}
