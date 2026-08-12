import Icon_Picker from '@/components/interface/Icon_Picker';
import DisableWrapper from '@/hooks/DisableWrapper';
import '@/styles/components/interface/Shortcut.css';
import { CATEGORIES, KEYS, useStorage } from '@/utils/useStorage';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Shortcut({ disabled = false }) {
  const { t } = useTranslation();
  const [savedShortcuts, setSavedShortcuts, loading] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, []);
  const [cards, setCards] = useState([]);
  const [removingCardIds, setRemovingCardIds] = useState([]);

  useEffect(() => {
    if (loading) return;

    if (Array.isArray(savedShortcuts) && savedShortcuts.length > 0) {
      const normalized = savedShortcuts.map((shortcut, index) => ({
        id: shortcut.id ?? index,
        icon: shortcut.icon ?? 'file-lines',
        name: shortcut.name ?? '',
        link: shortcut.link ?? '',
      }));
      setCards(normalized);
    } else {
      setCards([]);
    }
  }, [loading, savedShortcuts]);

  const persistCards = (nextCards) => {
    const normalized = nextCards.map((card, index) => ({
      id: card.id ?? index,
      icon: card.icon ?? 'file-lines',
      name: card.name ?? '',
      link: card.link ?? '',
    }));

    setCards(normalized);
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
      setCards((prevCards) => {
        const nextCards = prevCards.filter((card) => card.id !== cardId);
        persistCards(nextCards);
        return nextCards;
      });
      setRemovingCardIds((prev) => prev.filter((id) => id !== cardId));
    }, 200);
  };

  return (
    <DisableWrapper disabled={disabled} className="shortcutContainer">
      {cards.map((card, index) => (
        <div key={card.id} className={`shortcutCard${removingCardIds.includes(card.id) ? ' removing' : ''}`}>
          <Icon_Picker initialIcon={card.icon} onSelect={(icon) => updateCard(card.id, { icon })} />
          <div className="shortcutField nameField">
            <input type="text" value={card.name} className="shortcutName" placeholder={t('Content.Interface.name')} onChange={(event) => updateCard(card.id, { name: event.target.value })} />
          </div>
          <div className="shortcutField linkField">
            <input type="text" value={card.link} className="shortcutLink" placeholder={t('Content.Interface.link')} onChange={(event) => updateCard(card.id, { link: event.target.value })} />
          </div>
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
