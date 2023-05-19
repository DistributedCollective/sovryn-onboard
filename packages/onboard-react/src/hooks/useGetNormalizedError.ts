import { useMemo } from 'react';

import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';

import { useSubscription } from './useSubscription';

export const useGetNormalizedError = () => {
  const { error } = useSubscription(connectWallet$);

  const hasUserDeclinedTx = useMemo(() => {
    return (
      error?.includes('User denied transaction signature') ||
      error?.includes('UserDeclinedError')
    );
  }, [error]);

  const normalizedError = useMemo(() => {
    if (hasUserDeclinedTx) {
      return 'User declined transaction signature';
    }

    if (error?.includes('LIQUALITY_ERROR_FROM_ERROR_PARSER_PACKAGE')) {
      const searchReason = error.match(
        /(?:\\"reason\\":\\")([A-Za-z0-9 ]+)(?=\\")/g,
      );
      if (searchReason?.length) {
        return searchReason[0];
      }

      const searchErrorName = error.match(
        /(?:\\"name\\":\\")([A-Za-z0-9 ]+)(?=\\")/g,
      );
      if (searchErrorName?.length) {
        return searchErrorName[0];
      }
    }

    return error;
  }, [hasUserDeclinedTx, error]);

  return {
    hasUserDeclinedTx,
    normalizedError,
  };
};
