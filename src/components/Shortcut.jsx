import '@/styles/components/Shortcut.css';
import { useState } from 'react';
import Icon_Picker from '@/components/Icon_Picker';

export default function Shortcut() {
  const [cards, setCards] = useState([{ id: 0 }]);

  const addCard = () => {
    setCards((prev) => [...prev, { id: prev.length }]);
  };

  return (
    <div className="shortcutContainer">
      {cards.map((card) => (
        <div key={card.id} className="shortcutCard">
          <i className="fa-solid fa-bars" />
          <Icon_Picker />
          <div className="shortcutField nameField">
            <input type="text" className="shortcutName" placeholder="Name" />
          </div>
          <div className="shortcutField linkField">
            <input type="text" className="shortcutLink" placeholder="https://www.example.com/" />
          </div>
        </div>
      ))}

      <button type="button" className="addShortcutButton" onClick={addCard} aria-label="Add shortcut">
        <i className="fa-solid fa-circle-plus" />
      </button>
    </div>
  );
}
