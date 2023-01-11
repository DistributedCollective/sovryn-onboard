import React, { FC } from 'react';

import classNames from 'classnames';

import { applyDataAttr, Icon, IconNames } from '@sovryn/ui';

import styles from './ButtonBack.module.css';

type ButtonBackProps = {
  onClick: () => void;
  label?: string;
  className?: string;
  dataAttribute?: string;
};

export const ButtonBack: FC<ButtonBackProps> = ({
  onClick,
  label,
  className,
  dataAttribute,
}) => (
  <button
    className={classNames(styles.button, className)}
    onClick={onClick}
    {...applyDataAttr(dataAttribute)}
  >
    <Icon icon={IconNames.ARROW_RIGHT} className={styles.icon} size={14} />
    {label}
  </button>
);
