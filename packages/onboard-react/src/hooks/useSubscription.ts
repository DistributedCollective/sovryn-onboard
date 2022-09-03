import { useState, useEffect } from "react";
import type { BehaviorSubject } from "rxjs";
import { shareReplay, startWith } from "rxjs/operators";

export function useSubscription<T>(subject: BehaviorSubject<T>): T {
  const [value, setValue] = useState<T>(subject.value);

  useEffect(() => {
    const sub = subject
      .asObservable()
      .pipe(startWith(subject.value), shareReplay(1))
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
