import { useState, useEffect } from 'react';
import type { Observable } from 'rxjs';

export function useObservable<T>(
  observable: Observable<T>,
  defaultValue: T,
): T {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const sub = observable.subscribe(result => {
      setValue(result);
    });

    return () => {
      sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
