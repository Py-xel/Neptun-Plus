import AddButton from '@/components/AddButton';
import '@/styles/components/AutoLogin.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UniList_Dropdown from '@/components/UniList_Dropdown';

export default function AutoLogin({ disabled = false }) {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);

  const addCard = () => {
    setCards((prevCards) => [...prevCards, { id: prevCards.length + 1 }]);
  };

  return (
    <div
      className="credentialsContainer"
      style={{
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}>
      {cards.map((card) => (
        <div key={card.id} className="credentialCard">
          <div className="leftSide">
            <div className="inputFields">
              <input type="text" placeholder={t('Content.System.loginName')} />
              <input type="password" placeholder={t('Content.System.password')} />
            </div>
            <UniList_Dropdown />
          </div>
          <button type="button" className="removeCardButton">
            <i className="fa-solid fa-remove" />
          </button>
        </div>
      ))}

      <AddButton onClick={addCard} />
    </div>
  );
}
