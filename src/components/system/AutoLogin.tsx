import AddButton from '@/components/general/AddButton';
import Card from '@/components/general/Card';
import DisableWrapper from '@/components/general/DisableWrapper';
import InputField from '@/components/general/InputField';
import { useToast } from '@/components/general/ToastProvider';
import UniList_Dropdown, { getFirstSupportedUni } from '@/components/system/UniList_Dropdown';
import universities from '@/data/universities.json';
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
  const { showToast } = useToast();
  const { value: credentials, setValue: setCredentials, loading } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.CREDENTIALS, []);
  const [cards, setCards] = useState<AutoLoginCard[]>([]);
  const [editableCardIds, setEditableCardIds] = useState<Set<number>>(new Set());
  const nextCardId = useRef(1);
  const storedCardIds = useRef<Set<number> | null>(null);

  useEffect(() => {
    if (loading || !isStoredAutoLoginCards(credentials)) {
      return;
    }

    const savedCards = credentials.map((credential) => ({
      ...credential,
      uni: Object.entries(universities).find(([, university]) => university.id === credential.universityId)?.[0] ?? getFirstSupportedUni(),
    }));
    const nextStoredCardIds = new Set(credentials.map((card) => card.id));

    setCards((previousCards) => {
      if (!storedCardIds.current) {
        return savedCards;
      }

      const savedCardsById = new Map(savedCards.map((card) => [card.id, card]));
      const mergedCards = previousCards.flatMap((card) => {
        if (savedCardsById.has(card.id)) {
          return [savedCardsById.get(card.id)!];
        }

        return storedCardIds.current?.has(card.id) ? [] : [card];
      });

      const currentCardIds = new Set(previousCards.map((card) => card.id));
      return [...mergedCards, ...savedCards.filter((card) => !currentCardIds.has(card.id))];
    });
    setEditableCardIds((previousIds) => {
      if (!storedCardIds.current) {
        return new Set();
      }

      const nextIds = new Set(previousIds);
      credentials.forEach((card) => nextIds.delete(card.id));
      return nextIds;
    });
    storedCardIds.current = nextStoredCardIds;
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
    showToast(t('Popup.Toast.deleted'), { duration: 1200, type: 'success' });

    if (credentials.some((card) => card.id === cardId)) {
      await setCredentials(credentials.filter((card) => card.id !== cardId));
    }
  };

  const saveCard = async (card: AutoLoginCard) => {
    if (!card.loginName.trim() || !card.password.trim()) {
      // TODO Add error handling
      showToast(t('Popup.System.credentialsRequired'), { type: 'warning' });
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
    showToast('Success!', { type: 'success' });
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
          <Card key={card.id} isEditable={isEditable} onRemove={() => void removeCard(card.id)} onSave={() => (isEditable ? void saveCard(card) : toggleCardEditing(card.id))}>
            <div className="np-credentials-leftSide">
              <div className="np-credentials-input-container">
                <InputField
                  icon={'fa-regular fa-user'}
                  type="text"
                  value={card.loginName}
                  placeholder={t('Popup.System.loginName')}
                  onChange={(e) => updateCard(card.id, { loginName: e.target.value })}
                />
                <InputField
                  icon={'fa-regular fa-eye-slash'}
                  type="password"
                  value={card.password}
                  placeholder={t('Popup.System.password')}
                  onChange={(e) => updateCard(card.id, { password: e.target.value })}
                />
              </div>
              <UniList_Dropdown lang={language} value={card.uni} onChange={(value) => updateCard(card.id, { uni: value })} />
            </div>
          </Card>
        );
      })}
      <AddButton onClick={addCard} />
    </DisableWrapper>
  );
}
