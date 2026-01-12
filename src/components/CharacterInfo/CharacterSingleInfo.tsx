import type { JSX } from "react";
import { useTranslation } from "react-i18next";

type CharacterSingleInfo = {
    characterInfo: string,
    whichInfo: string,
    needTranslation: boolean
}

export function CharacterSingleInfo ({characterInfo, whichInfo, needTranslation} : CharacterSingleInfo) :JSX.Element {
    const {t} = useTranslation()
    return <div className="flex-v-start">
        <h1>{needTranslation ? t(characterInfo) : characterInfo}</h1>
        <div className="small-horizontal-line bg-color-text"></div>
        <p>{t(whichInfo)}</p>
    </div>
}