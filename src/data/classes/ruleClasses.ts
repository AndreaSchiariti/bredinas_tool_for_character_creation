import type { RuleClass } from "../../types/characterClasses.types";

import barbarianJson from "./barbarian.json"
import monkJson from "./monk.json";

export const barbarian: RuleClass = barbarianJson as RuleClass
export const monk: RuleClass = monkJson as RuleClass;

export const ruleClasses: RuleClass[] = [barbarian, monk];
