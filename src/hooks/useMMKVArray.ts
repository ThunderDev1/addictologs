import react, { useCallback, useEffect, useState } from "react";
import { storage } from "../mmkv";

type TUseMMKVArray = <T>(
  key: string
) => [T | undefined, (v: T | undefined) => void];

export const useMMKVArray: TUseMMKVArray = <T>(key: string) => {
  const [value, setValue] = useState<T | undefined>();

  useEffect(() => {
    const strV = storage.getString(key);
    if (strV != null) {
      setValue(JSON.parse(strV) as T);
    } else {
      setValue(undefined);
    }
  }, [key]);

  const setArrValue = useCallback(
    (v: T | undefined) => {
      if (v == null) {
        setValue(undefined);
        storage.delete(key);
      } else {
        const jsonV = JSON.stringify(v);
        storage.set(key, jsonV);
        setValue(v);
      }
    },
    [key]
  );

  return [value, setArrValue];
};
