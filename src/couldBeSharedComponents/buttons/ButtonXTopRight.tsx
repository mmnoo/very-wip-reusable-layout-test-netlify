import { ButtonProps } from "react-aria-components";
import { ButtonX } from "./ButtonX";
import styles from "./ButtonXTopright.module.scss";

export const ButtonXTopRight = (props: ButtonProps) => {
  // Not sure if this is a good idea for componnent lib to export this,
  // but this x/close button will posiition itself in the
  // top right of the nearest positioned ancestor.
  // Given it needs a positioned ancestor to work properly
  // this could make dx poor for external consumption/
  // better to export just the unpositioned x/close button and let the
  // consuming app handle positioning
  const { className, ...restOfProps } = props;

  return (
    <ButtonX
      {...restOfProps}
      className={`${styles.buttonXTopRight} ${className}`}
    />
  );
};
