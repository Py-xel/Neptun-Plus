import AddButton from '@/components/general/AddButton';
import InputField from '@/components/general/InputField';
import UniList_Dropdown, { getFirstSupportedUni } from '@/components/system/UniList_Dropdown';
import universities from '@/data/universities.json';
import DisableWrapper from '@/hooks/DisableWrapper';
import '@/styles/components/system/autoLogin.css';
import { CATEGORIES, KEYS, normalizeLanguage, type AutoLoginCredential } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AutoLoginProps = {
  disabled?: boolean;
};

type AutoLoginCard = {
  id: number;
  loginName: string;
  password: string;
  uni: string;
};

type AutoLoginCardUpdates = Partial<Omit<AutoLoginCard, 'id'>>;

const isStoredAutoLoginCards = (value: unknown): value is AutoLoginCredential[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (card) => card && typeof card === 'object' && typeof card.id === 'number' && typeof card.loginName === 'string' && typeof card.password === 'string' && typeof card.universityId === 'string',
    )
  );
};

export default function AutoLogin({ disabled = false }: AutoLoginProps) {
  const { t, i18n } = useTranslation();
  const { value: credentials, setValue: setCredentials, loading } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.CREDENTIALS, []);
  const [cards, setCards] = useState<AutoLoginCard[]>([]);
  const [editableCardIds, setEditableCardIds] = useState<Set<number>>(new Set());
  const nextCardId = useRef(1);

  useEffect(() => {
    if (loading || !isStoredAutoLoginCards(credentials)) {
      return;
    }

    setCards(
      credentials.map((credential) => ({
        ...credential,
        uni: Object.entries(universities).find(([, university]) => university.id === credential.universityId)?.[0] ?? getFirstSupportedUni(),
      })),
    );
    setEditableCardIds(new Set());
    nextCardId.current = Math.max(0, ...credentials.map((card) => card.id)) + 1;
  }, [credentials, loading]);

  const addCard = () => {
    const id = nextCardId.current++;
    setCards((prevCards) => [...prevCards, { id, loginName: '', password: '', uni: getFirstSupportedUni() }]);
    setEditableCardIds((prevIds) => new Set(prevIds).add(id));
  };

  const updateCard = (cardId: number, updates: AutoLoginCardUpdates) => {
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)));
  };

  const removeCard = async (cardId: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));

    if (credentials.some((card) => card.id === cardId)) {
      await setCredentials(credentials.filter((card) => card.id !== cardId));
    }
  };

  const saveCard = async (card: AutoLoginCard) => {
    if (!card.loginName.trim() || !card.password.trim()) {
      // TODO Add error handling
      return;
    }

    const universityId = universities[card.uni as keyof typeof universities]?.id;
    if (!universityId) {
      // TODO Add error handling
      return;
    }

    const savedCard: AutoLoginCredential = {
      id: card.id,
      loginName: card.loginName,
      password: card.password,
      universityId,
    };
    const nextCredentials = [...credentials.filter((storedCard) => storedCard.id !== card.id), savedCard];

    await setCredentials(nextCredentials);
    setEditableCardIds((prevIds) => {
      const nextIds = new Set(prevIds);
      nextIds.delete(card.id);
      return nextIds;
    });
  };

  const toggleCardEditing = (cardId: number) => {
    setEditableCardIds((prevIds) => {
      const nextIds = new Set(prevIds);

      if (nextIds.has(cardId)) {
        nextIds.delete(cardId);
      } else {
        nextIds.add(cardId);
      }

      return nextIds;
    });
  };

  const language = normalizeLanguage(i18n.language);

  return (
    <DisableWrapper disabled={disabled} className="np-credentials-container">
      {cards.map((card) => {
        const isEditable = editableCardIds.has(card.id);

        return (
          <div key={card.id} className="np-credentials-card">
            <div className={`np-credentials-leftSide${isEditable ? '' : ' disabled'}`}>
              <div className="np-credentials-input-container">
                <InputField
                  icon={'fa-regular fa-user'}
                  type="text"
                  value={card.loginName}
                  placeholder={t('Content.System.loginName')}
                  onChange={(e) => updateCard(card.id, { loginName: e.target.value })}
                />
                <InputField
                  icon={'fa-regular fa-eye-slash'}
                  type="password"
                  value={card.password}
                  placeholder={t('Content.System.password')}
                  onChange={(e) => updateCard(card.id, { password: e.target.value })}
                />
              </div>
              <UniList_Dropdown lang={language} value={card.uni} onChange={(value) => updateCard(card.id, { uni: value })} />
            </div>
            <div className="np-action-button-container">
              <button type="button" className="np-action-button-remove" onClick={() => void removeCard(card.id)}>
                <i className="fa-solid fa-remove" />
              </button>
              <button
                type="button"
                className="np-action-button-save"
                disabled={isEditable && (!card.loginName.trim() || !card.password.trim())}
                onClick={() => (isEditable ? void saveCard(card) : toggleCardEditing(card.id))}>
                <i className={isEditable ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-pen'} />
              </button>
            </div>
          </div>
        );
      })}
      <AddButton onClick={addCard} />
    </DisableWrapper>
  );
}
