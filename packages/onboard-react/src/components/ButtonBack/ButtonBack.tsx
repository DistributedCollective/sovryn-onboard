import React, { FC } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '@sovryn/ui';

import styles from './ButtonBack.module.css';

type ButtonBackProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

export const ButtonBack: FC<ButtonBackProps> = ({
  onClick,
  label,
  className,
}) => (
  <button className={classNames(styles.button, className)} onClick={onClick}>
    <Icon icon={IconNames.ARROW_RIGHT} className={styles.icon} size={14} />
    {label}
  </button>
);
