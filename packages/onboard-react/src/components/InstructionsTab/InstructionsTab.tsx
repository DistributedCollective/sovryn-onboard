import { FC } from 'react';

import { Link, Paragraph } from '@sovryn/ui';

import { formatDataPrefix } from '../../utils';
import styles from './InstructionsTab.module.css';

type InstructionsTabProps = {
  dataAttribute?: string;
};

export const InstructionsTab: FC<InstructionsTabProps> = ({
  dataAttribute,
}) => (
  <>
    <div className={styles.text}>
      <Paragraph>What is a wallet?</Paragraph>
      <Paragraph>
        A wallet is a home for your digital assets, such as cryptocurrencies or
        NFTs. You can use it to send, receive, and store digital assets.
      </Paragraph>
      <Paragraph>
        It’s also a new way to log in. Instead of creating a new account and
        password on every website or dapp, you can just connect your wallet.
      </Paragraph>
      <Paragraph>
        Find out how to get a wallet to use on Sovryn in the wiki.{' '}
      </Paragraph>
    </div>

    <Link
      href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
      text="Get a wallet to use on Sovryn"
      className={styles.link}
      dataAttribute={`${formatDataPrefix(dataAttribute)}instruction-link`}
    />
  </>
);
