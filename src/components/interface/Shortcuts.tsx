import AddButton from '@/components/general/AddButton';
import Card from '@/components/general/Card';
import DisableWrapper from '@/components/general/DisableWrapper';
import Icon_Picker from '@/components/general/IconPicker';
import InputField from '@/components/general/InputField';
import { useToast } from '@/components/general/ToastProvider';
import '@/styles/components/interface/shortcuts.css';
import { CATEGORIES, KEYS, type ShortcutItem } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ShortcutProps = {
  disabled?: boolean;
};

type ShortcutCard = ShortcutItem;

type ShortcutCardUpdates = Partial<Omit<ShortcutCard, 'id'>>;

const isStoredShortcuts = (value: unknown): value is ShortcutItem[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (shortcut) =>
        shortcut && typeof shortcut === 'object' && typeof shortcut.id === 'number' && typeof shortcut.icon === 'string' && typeof shortcut.name === 'string' && typeof shortcut.link === 'string',
    )
  );
};

export default function Shortcut({ disabled = false }: ShortcutProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { value: savedShortcuts, setValue: setSavedShortcuts, loading } = useSettings(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, [] as ShortcutItem[]);
  const [cards, setCards] = useState<ShortcutCard[]>([]);
  const [editableCardIds, setEditableCardIds] = useState<Set<number>>(new Set());
  const [removingCardIds, setRemovingCardIds] = useState<number[]>([]);
  const nextCardId = useRef(1);
  const storedCardIds = useRef<Set<number> | null>(null);

  useEffect(() => {
    if (loading || !isStoredShortcuts(savedShortcuts)) {
      return;
    }

    const nextStoredCardIds = new Set(savedShortcuts.map((card) => card.id));

    setCards((previousCards) => {
      if (!storedCardIds.current) {
        return savedShortcuts;
      }

      const savedCardsById = new Map(savedShortcuts.map((card) => [card.id, card]));
      const mergedCards = previousCards.flatMap((card) => {
        if (savedCardsById.has(card.id)) {
          return [savedCardsById.get(card.id)!];
        }

        return storedCardIds.current?.has(card.id) ? [] : [card];
      });

      const currentCardIds = new Set(previousCards.map((card) => card.id));
      return [...mergedCards, ...savedShortcuts.filter((card) => !currentCardIds.has(card.id))];
    });
    setEditableCardIds((previousIds) => {
      if (!storedCardIds.current) {
        return new Set();
      }

      const nextIds = new Set(previousIds);
      savedShortcuts.forEach((card) => nextIds.delete(card.id));
      return nextIds;
    });
    storedCardIds.current = nextStoredCardIds;
    nextCardId.current = Math.max(0, ...savedShortcuts.map((card) => card.id)) + 1;
  }, [loading, savedShortcuts]);

  const addCard = () => {
    const id = nextCardId.current++;
    setCards((prevCards) => [...prevCards, { id, icon: 'file-lines', name: '', link: '' }]);
    setEditableCardIds((prevIds) => new Set(prevIds).add(id));
  };

  const updateCard = (cardId: number, updates: ShortcutCardUpdates) => {
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, ...updates } : card)));
  };

  const removeCard = async (cardId: number) => {
    setRemovingCardIds((prev) => [...prev, cardId]);

    const nextCards = cards.filter((card) => card.id !== cardId);
    setCards(nextCards);
    if (savedShortcuts.some((card) => card.id === cardId)) {
      await setSavedShortcuts(savedShortcuts.filter((card) => card.id !== cardId));
    }
    setRemovingCardIds((prev) => prev.filter((id) => id !== cardId));
    setEditableCardIds((prevIds) => {
      const nextIds = new Set(prevIds);
      nextIds.delete(cardId);
      return nextIds;
    });
    showToast(t('Popup.Toast.deleted'), { duration: 1200, type: 'success' });
  };

  const saveCard = async (cardId: number) => {
    const card = cards.find((currentCard) => currentCard.id === cardId);

    if (!card) {
      return;
    }

    if (!card.name.trim() || !card.link.trim()) {
      showToast(t('Popup.Interface.shortcutRequired'), { type: 'warning' });
      return;
    }

    const nextSavedShortcuts = [...savedShortcuts.filter((savedCard) => savedCard.id !== card.id), card];
    await setSavedShortcuts(nextSavedShortcuts);
    setEditableCardIds((prevIds) => {
      const nextIds = new Set(prevIds);
      nextIds.delete(cardId);
      return nextIds;
    });
    showToast(t('Popup.Toast.saved'), { type: 'success' });
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

  return (
    <DisableWrapper disabled={disabled} className="np-shortcuts-container">
      {cards.map((card) => {
        const isEditable = editableCardIds.has(card.id);

        return (
          <Card isEditable={isEditable} onRemove={() => void removeCard(card.id)} onSave={() => (isEditable ? void saveCard(card.id) : toggleCardEditing(card.id))}>
            <Icon_Picker initialIcon={card.icon} onSelect={(icon) => updateCard(card.id, { icon })} />
            <div className="np-shortcut-input-container">
              <InputField
                type="text"
                icon={'fa-regular fa-address-card'}
                value={card.name}
                placeholder={t('Popup.Interface.name')}
                onChange={(event) => updateCard(card.id, { name: event.target.value })}
              />
              <InputField
                type="text"
                icon={'fa-regular fa-circle-right'}
                value={card.link}
                placeholder={t('Popup.Interface.link')}
                onChange={(event) => updateCard(card.id, { link: event.target.value })}
              />
            </div>
          </Card>
        );
      })}
      <AddButton onClick={addCard} />
    </DisableWrapper>
  );
}
