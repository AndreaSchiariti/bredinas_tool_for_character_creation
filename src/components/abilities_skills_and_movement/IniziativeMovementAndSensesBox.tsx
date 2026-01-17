import type { JSX } from "react";
import { BoxWithTitle } from "../BowWithTitle";

interface IMS {
    info : "initiative" | "speed" | "size" | "passivePerception";
    infoValue : string
    gridArea : "initiative" | "movement" | "character-size" | "passive-perception"
}

export function InitiativeMovementAndSensesBox ({info, infoValue, gridArea} :IMS):JSX.Element {
    return (
      <div
        className={`initiative-movement-and-senses-details grid-area-${gridArea}`}
      >
        <BoxWithTitle title={`${info}`}>
            <div className="very-small-horizontal-line bg-color-text" />
          <h1 className="">{infoValue}</h1>
        </BoxWithTitle>
      </div>
    );
}