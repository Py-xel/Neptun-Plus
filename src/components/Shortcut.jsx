import Icon_Picker from '@/components/Icon_Picker';
import '@/styles/components/Shortcut.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Shortcut({ disabled = false }) {
  const { t } = useTranslation();
  const [cards, setCards] = useState([{ id: 0 }]);
  const [removingCardIds, setRemovingCardIds] = useState([]);

  const addCard = () => {
    setCards((prev) => [...prev, { id: prev[prev.length - 1].id + 1 }]);
  };

  /* Additional timeout so card removal anim can play */
  const removeCard = (cardId) => {
    setRemovingCardIds((prev) => [...prev, cardId]);

    window.setTimeout(() => {
      setCards((prev) => prev.filter((card) => card.id !== cardId));
      setRemovingCardIds((prev) => prev.filter((id) => id !== cardId));
    }, 200);
  };

  return (
    <div
      className="shortcutContainer"
      style={{
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}>
      {cards.map((card, index) => (
        <div key={card.id} className={`shortcutCard${removingCardIds.includes(card.id) ? ' removing' : ''}`}>
          <Icon_Picker />
          <div className="shortcutField nameField">
            <input type="text" className="shortcutName" placeholder={t('Content.Interface.name')} />
          </div>
          <div className="shortcutField linkField">
            <input type="text" className="shortcutLink" placeholder={t('Content.Interface.link')} />
          </div>
          {index > 0 && (
            <button type="button" className="removeShortcutButton" onClick={() => removeCard(card.id)} aria-label="Remove shortcut">
              <i className="fa-solid fa-remove" />
            </button>
          )}
        </div>
      ))}

      <button type="button" className="addShortcutButton" onClick={addCard} aria-label="Add shortcut">
        <i className="fa-solid fa-circle-plus" />
      </button>
    </div>
  );
}
