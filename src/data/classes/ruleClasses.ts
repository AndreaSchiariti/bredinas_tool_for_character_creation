import type { RuleClass } from "../../types/characterClasses.types";

import barbarianJson from "./barbarian.json"
import bardJson from "./bard.json"
import monkJson from "./monk.json";

export const barbarianRuleClass: RuleClass = barbarianJson as RuleClass;
export const bardRuleClass: RuleClass = bardJson as RuleClass;
export const monkRuleClass: RuleClass = monkJson as RuleClass;

export const ruleClasses: RuleClass[] = [
  barbarianRuleClass,
  bardRuleClass,
  monkRuleClass,
];
