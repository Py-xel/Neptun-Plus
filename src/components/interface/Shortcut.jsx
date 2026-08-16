import InputField from '@/components/general/InputField';
import Icon_Picker from '@/components/interface/Icon_Picker';
import DisableWrapper from '@/hooks/DisableWrapper';
import '@/styles/components/interface/Shortcut.css';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Shortcut({ disabled = false }) {
  const { t } = useTranslation();
  const [savedShortcuts, setSavedShortcuts, loading] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, []);
  const [removingCardIds, setRemovingCardIds] = useState([]);

  const cards = useMemo(() => {
    if (loading || !Array.isArray(savedShortcuts) || savedShortcuts.length === 0) {
      // TODO: Add error handling
      return [];
    }

    return savedShortcuts.map((shortcut, index) => ({
      id: shortcut.id ?? index + 1,
      icon: shortcut.icon ?? 'file-lines',
      name: shortcut.name ?? '',
      link: shortcut.link ?? '',
    }));
  }, [loading, savedShortcuts]);

  const persistCards = (nextCards) => {
    const normalized = nextCards.map((card, index) => ({
      id: card.id ?? index + 1,
      icon: card.icon ?? 'file-lines',
      name: card.name ?? '',
      link: card.link ?? '',
    }));

    setSavedShortcuts(normalized);
  };

  const addCard = () => {
    const nextId = cards.length > 0 ? Math.max(...cards.map((card) => card.id), 0) + 1 : 1;
    persistCards([...cards, { id: nextId, icon: 'file-lines', name: '', link: '' }]);
  };

  const updateCard = (cardId, updates) => {
    const nextCards = cards.map((card) => (card.id === cardId ? { ...card, ...updates } : card));
    persistCards(nextCards);
  };

  /* Additional timeout so card removal anim can play */
  const removeCard = (cardId) => {
    setRemovingCardIds((prev) => [...prev, cardId]);

    window.setTimeout(() => {
      const nextCards = cards.filter((card) => card.id !== cardId);
      persistCards(nextCards);
      setRemovingCardIds((prev) => prev.filter((id) => id !== cardId));
    }, 200);
  };

  return (
    <DisableWrapper disabled={disabled} className="shortcutContainer">
      {cards.map((card) => (
        <div key={card.id} className={`shortcutCard${removingCardIds.includes(card.id) ? ' removing' : ''}`}>
          <Icon_Picker initialIcon={card.icon} onSelect={(icon) => updateCard(card.id, { icon })} />
          <InputField icon={'fa-regular fa-user'} value={card.name} placeholder={t('Content.Interface.name')} onChange={(event) => updateCard(card.id, { name: event.target.value })} />
          <InputField icon={'fa-regular fa-circle-right'} value={card.link} placeholder={t('Content.Interface.link')} onChange={(event) => updateCard(card.id, { link: event.target.value })} />
          <button type="button" className="removeShortcutButton" onClick={() => removeCard(card.id)} aria-label="Remove shortcut">
            <i className="fa-solid fa-remove" />
          </button>
        </div>
      ))}

      <button type="button" className="addShortcutButton" onClick={addCard} aria-label="Add shortcut">
        <i className="fa-solid fa-circle-plus" />
      </button>
    </DisableWrapper>
  );
}
