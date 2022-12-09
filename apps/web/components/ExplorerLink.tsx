import { TransactionResponse } from '@ethersproject/providers';

import { FC, useMemo } from 'react';

import { Chain } from '@sovryn/onboard-common';

import { onboard } from '../lib/connector';

type ExplorerLinkProps = {
  tx: TransactionResponse;
};

export const ExplorerLink: FC<ExplorerLinkProps> = ({ tx }) => {
  const link = useMemo(() => {
    const chain = onboard.state
      .get()
      .chains.find((c: Chain) => Number(c.id) === tx.chainId);
    if (chain && chain.blockExplorerUrl) {
      return (
        <a
          href={`${chain.blockExplorerUrl}/tx/${tx.hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tx.hash}
        </a>
      );
    }
    return tx.hash;
  }, [tx.hash, tx.chainId]);

  return (
    <p>
      {link} {tx.confirmations > 0 && <span>(mined)</span>}
    </p>
  );
};
