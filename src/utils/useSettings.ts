import { type Category, type SettingValue, type StorageKey } from '@/utils/dataSchema';
import { readSetting, resetSettings, subscribeToSetting, writeSetting, type KeyForCategory } from '@/utils/settingsStore';
import { useEffect, useRef, useState } from 'react';

export type UseSettingsResult<Value> = {
  value: Value;
  setValue: (value: Value) => Promise<void>;
  reset: () => Promise<void>;
  loading: boolean;
  error: Error | null;
};

export function useSettings<CategoryName extends Category, Key extends KeyForCategory[CategoryName] & StorageKey>(
  category: CategoryName,
  key: Key,
  defaultValue: SettingValue<Key>,
): UseSettingsResult<SettingValue<Key>> {
  type Value = SettingValue<Key>;

  const [value, setValue] = useState<Value>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToSetting(category, key, (newValue) => {
      if (active) {
        setValue(newValue ?? defaultValueRef.current);
      }
    });

    async function loadValue() {
      try {
        const storedValue = await readSetting(category, key, defaultValueRef.current);

        if (active) {
          setValue(storedValue ?? defaultValueRef.current);
          setLoading(false);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError : new Error(String(caughtError)));
          setLoading(false);
        }
      }
    }

    void loadValue();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [category, key]);

  async function setStoredValue(nextValue: Value) {
    setError(null);

    try {
      await writeSetting(category, key, nextValue);
      setValue(nextValue);
    } catch (caughtError) {
      const nextError = caughtError instanceof Error ? caughtError : new Error(String(caughtError));
      setError(nextError);
      throw nextError;
    }
  }

  async function resetStoredSettings() {
    setError(null);

    try {
      await resetSettings();
      setValue(defaultValueRef.current);
    } catch (caughtError) {
      const nextError = caughtError instanceof Error ? caughtError : new Error(String(caughtError));
      setError(nextError);
      throw nextError;
    }
  }

  return {
    value,
    setValue: setStoredValue,
    reset: resetStoredSettings,
    loading,
    error,
  };
}
