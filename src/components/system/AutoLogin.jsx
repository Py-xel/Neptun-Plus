import AddButton from '@/components/general/AddButton';
import InputField from '@/components/general/InputField';
import UniList_Dropdown from '@/components/system/UniList_Dropdown';
import DisableWrapper from '@/hooks/DisableWrapper';
import '@/styles/components/system/AutoLogin.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AutoLogin({ disabled = false }) {
  const { t, i18n } = useTranslation();
  const [cards, setCards] = useState([]);

  const addCard = () => {
    setCards((prevCards) => [...prevCards, { id: prevCards.length + 1, loginName: '', password: '' }]);
  };

  const updateCard = (cardId, updates) => {
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)));
  };

  const removeCard = (cardId) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  async function pushCredentials(card) {
    const response = await chrome.runtime.sendMessage({
      type: 'SAVE_CREDENTIALS',
      credentials: {
        username: card.loginName,
        password: card.password,
      },
    });

    if (!response?.success) {
      // TODO Add error handling
      return false;
    }

    return true;
  }

  return (
    <DisableWrapper disabled={disabled} className="credentialsContainer">
      {cards.map((card) => (
        <div key={card.id} className="credentialCard">
          <div className="leftSide">
            <div className="inputFields">
              <InputField icon={'fa-regular fa-user'} value={card.loginName} placeholder={t('Content.System.loginName')} onChange={(e) => updateCard(card.id, { loginName: e.target.value })} />
              <InputField
                icon={'fa-regular fa-eye-slash'}
                type="password"
                value={card.password}
                placeholder={t('Content.System.password')}
                onChange={(e) => updateCard(card.id, { password: e.target.value })}
              />
            </div>
            <UniList_Dropdown lang={i18n.language} />
          </div>
          <div className="actionButtonContainer">
            <button type="button" className="removeCardButton" onClick={() => removeCard(card.id)}>
              <i className="fa-solid fa-remove" />
            </button>
            <button type="button" className="saveCardButton" onClick={() => pushCredentials(card)}>
              <i className="fa-solid fa-floppy-disk" />
            </button>
          </div>
        </div>
      ))}
      <AddButton onClick={addCard} />
    </DisableWrapper>
  );
}
