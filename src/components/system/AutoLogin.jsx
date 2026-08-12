import AddButton from '@/components/general/AddButton';
import UniList_Dropdown from '@/components/system/UniList_Dropdown';
import DisableWrapper from '@/hooks/DisableWrapper';
import '@/styles/components/system/AutoLogin.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AutoLogin({ disabled = false }) {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);

  const addCard = () => {
    setCards((prevCards) => [...prevCards, { id: prevCards.length + 1 }]);
  };

  return (
    <DisableWrapper disabled={disabled} className="credentialsContainer">
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
    </DisableWrapper>
  );
}
