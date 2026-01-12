import { useTranslation } from "react-i18next";
import { useCharacterContext } from "../context/CharacterContext";

export function Test() {
  const character = useCharacterContext();
  const { t } = useTranslation();

  return (
    <p className="">
      {`${character.name}, ${t("level")} ${character.level}. ${t(
        "notification",
        { count: 1 }
      )}`}
    </p>
  );
}
