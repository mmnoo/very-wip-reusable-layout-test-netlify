import { Button, ButtonProps } from "react-aria-components";

import styles from "./ButtonX.module.scss";

interface ButtonXProps extends ButtonProps {
  classNamef?: string;
}

export const ButtonX = (props: ButtonXProps) => {
  const { className, ...restOfProps } = props;

  return (
    <Button {...restOfProps} className={`${styles.buttonX} ${className}`}>
      x
    </Button>
  );
};
