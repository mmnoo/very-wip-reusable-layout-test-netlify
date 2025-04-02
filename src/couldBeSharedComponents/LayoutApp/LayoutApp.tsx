import { ReactNode } from "react";
import appLayoutStyles from "./LayoutApp.module.scss";

export interface LayoutAppProps {
  children: ReactNode;
  footerContent?: ReactNode;
  headerContent?: ReactNode;
}
// column layout with header, main, footer.
export const LayoutApp = ({
  children,
  footerContent,
  headerContent,
}: LayoutAppProps) => (
  <div className={appLayoutStyles.layoutWrapper}>
    {headerContent ? <div>{headerContent}</div> : null}
    <main>{children}</main>
    {footerContent ? <div>{footerContent}</div> : null}
  </div>
);
