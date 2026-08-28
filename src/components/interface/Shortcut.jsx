import InputField from '@/components/general/InputField';
import Icon_Picker from '@/components/interface/Icon_Picker';
import DisableWrapper from '@/hooks/DisableWrapper';
import '@/styles/components/interface/Shortcut.css';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const shortcutColumns = [
  {
    title: 'Content.Interface.column_1',
    shortcuts: [
      ['fa-regular fa-alarm-clock', 'Content.Interface.upcomingEvents'],
      ['fa-regular fa-pen-to-square', 'Content.Interface.exams'],
      ['fa-regular fa-newspaper', 'Content.Interface.news'],
    ],
  },
  {
    title: 'Content.Interface.column_2',
    shortcuts: [
      ['fa-solid fa-check-double', 'Content.Interface.toDo'],
      ['fa-solid fa-chart-line', 'Content.Interface.averages'],
      ['fa-solid fa-wallet', 'Content.Interface.debts'],
    ],
  },
  {
    title: 'Content.Interface.column_3',
    shortcuts: [
      ['fa-solid fa-check', 'Content.Interface.results'],
      ['fa-regular fa-message', 'Content.Interface.messages'],
      ['fa-solid fa-reply-all', 'Content.Interface.advancement'],
    ],
  },
];

export default function Shortcut({ disabled = false }) {
  const { t } = useTranslation();
  const [savedShortcuts, setSavedShortcuts, loading] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, []);
  const [removingCardIds, setRemovingCardIds] = useState([]);
  const [hiddenCardIds, setHiddenCardIds] = useState([]);

  const cardsByColumn = useMemo(() => {
    if (loading) {
      // TODO: Add error handling
      return shortcutColumns.map(() => []);
    }

    const storedColumns = Array.isArray(savedShortcuts?.[0]) ? savedShortcuts : [savedShortcuts];

    return shortcutColumns.map((_, columnIndex) =>
      (storedColumns[columnIndex] ?? []).map((shortcut, index) => ({
        id: shortcut.id ?? index + 1,
        icon: shortcut.icon ?? 'file-lines',
        name: shortcut.name ?? '',
        link: shortcut.link ?? '',
      })),
    );
  }, [loading, savedShortcuts]);

  const persistCards = (columnIndex, nextCards) => {
    const normalized = nextCards.map((card, index) => ({
      id: card.id ?? index + 1,
      icon: card.icon ?? 'file-lines',
      name: card.name ?? '',
      link: card.link ?? '',
    }));

    const nextColumns = cardsByColumn.map((columnCards, index) => (index === columnIndex ? normalized : columnCards));
    setSavedShortcuts(nextColumns);
  };

  const addCard = (columnIndex) => {
    const columnCards = cardsByColumn[columnIndex];
    const nextId = columnCards.length > 0 ? Math.max(...columnCards.map((card) => card.id), 0) + 1 : 1;
    persistCards(columnIndex, [...columnCards, { id: nextId, icon: 'file-lines', name: '', link: '' }]);
  };

  const updateCard = (columnIndex, cardId, updates) => {
    const nextCards = cardsByColumn[columnIndex].map((card) => (card.id === cardId ? { ...card, ...updates } : card));
    persistCards(columnIndex, nextCards);
  };

  /* Additional timeout so card removal anim can play */
  const removeCard = (columnIndex, cardId) => {
    const removingCardId = `${columnIndex}-${cardId}`;
    setRemovingCardIds((prev) => [...prev, removingCardId]);

    window.setTimeout(() => {
      const nextCards = cardsByColumn[columnIndex].filter((card) => card.id !== cardId);
      persistCards(columnIndex, nextCards);
      setRemovingCardIds((prev) => prev.filter((id) => id !== removingCardId));
    }, 200);
  };

  const hideCard = (columnIndex, iconClass) => {
    const cardId = `${columnIndex}-${iconClass}`;

    setHiddenCardIds((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]));
  };

  return (
    <div className="shortcutMain">
      <DisableWrapper disabled={disabled} className="shortcutWrapper">
        {shortcutColumns.map((column, columnIndex) => (
          <Fragment key={column.title}>
            <p className="shortcutColumn">{t(column.title)}</p>
            <div className="shortcutContainer">
              {column.shortcuts.map(([iconClass, textKey]) => (
                <div className={`shortcutCard${hiddenCardIds.includes(`${columnIndex}-${iconClass}`) ? ' hidden' : ''}`} key={textKey}>
                  <i className={iconClass}></i>
                  <p className="shortcutName">{t(textKey)}</p>
                  <i className={`fa-regular ${hiddenCardIds.includes(`${columnIndex}-${iconClass}`) ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => hideCard(columnIndex, iconClass)} />
                </div>
              ))}
              {cardsByColumn[columnIndex].map((card) => (
                <div key={card.id} className={`shortcutCard${removingCardIds.includes(`${columnIndex}-${card.id}`) ? ' removing' : ''}`}>
                  <Icon_Picker initialIcon={card.icon} onSelect={(icon) => updateCard(columnIndex, card.id, { icon })} />
                  <InputField
                    icon={'fa-regular fa-user'}
                    value={card.name}
                    placeholder={t('Content.Interface.name')}
                    onChange={(event) => updateCard(columnIndex, card.id, { name: event.target.value })}
                  />
                  <InputField
                    icon={'fa-regular fa-circle-right'}
                    value={card.link}
                    placeholder={t('Content.Interface.link')}
                    onChange={(event) => updateCard(columnIndex, card.id, { link: event.target.value })}
                  />
                  <button type="button" className="removeShortcutButton" onClick={() => removeCard(columnIndex, card.id)} aria-label="Remove shortcut">
                    <i className="fa-solid fa-remove" />
                  </button>
                </div>
              ))}

              <button type="button" className="addShortcutButton" onClick={() => addCard(columnIndex)} aria-label="Add shortcut">
                <i className="fa-solid fa-circle-plus" />
              </button>
            </div>
          </Fragment>
        ))}
      </DisableWrapper>
    </div>
  );
}
