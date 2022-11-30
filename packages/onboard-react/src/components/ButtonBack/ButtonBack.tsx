import React, { FC } from "react";
import classNames from "classnames";
import styles from "./ButtonBack.module.css";
import { Icon, IconNames } from "@sovryn/ui";

type ButtonBackProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

export const ButtonBack: FC<ButtonBackProps> = ({
  onClick,
  label,
  className,
}) => {
  return (
    <button className={classNames(styles.button, className)} onClick={onClick}>
      <Icon icon={IconNames.ARROW_BACK} className={styles.icon} size={14} />
      {label}
    </button>
  );
};
