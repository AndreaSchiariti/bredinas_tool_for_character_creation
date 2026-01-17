import type { JSX } from "react";
import type { Children } from "../types/react-types";
import { useTranslation } from "react-i18next";

type BoxTitle = {
  title: string;
  children: Children;
};

export function BoxWithTitle({ title, children }: BoxTitle): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex-v-center-between gap-10 w-100-perc">
      <h1 className="title-of-box">{t(title).toUpperCase()}</h1>
      {children}
    </div>
  );
}
