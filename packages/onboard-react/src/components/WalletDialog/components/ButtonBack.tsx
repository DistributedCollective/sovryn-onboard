import React, { FC } from "react";
import { Icon } from "@sovryn/ui";
import styles from "./ButtonBack.module.css";

type ButtonBackProps = {
  onClick: () => void;
  label: string;
};

export const ButtonBack: FC<ButtonBackProps> = ({ onClick, label }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <Icon icon="arrow-back" className={styles.icon} size={14} />
      {label}
    </button>
  );
};
