import type { SkillProp } from "../../types/features.types/abilitiesAndSkills.type";

export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export function calculateAbilityDC(
  proficiency: number,
  abilityModifier: number,
): number {
  return 8 + proficiency + abilityModifier;
}

export function calculatePassiveSkill(skill: SkillProp): number {
  if (skill.hasAdvantage && skill.hasDisadvantage) {
    return 10 + skill.currentScore;
  } else if (skill.hasAdvantage) {
    return 15 + skill.currentScore;
  } else if (skill.hasDisadvantage) {
    return 5 + skill.currentScore;
  } else {
    return 10 + skill.currentScore;
  }
}