export type Locale = "zh-CN" | "en-US" | "fr-FR" | "ja-JP";

export interface LocaleDict {
  /** nav */
  "nav.home": string;
  "nav.plans": string;
  "nav.signIn": string;
  "nav.signOut": string;
  "nav.profile": string;

  /** landing */
  "landing.subtitle": string;
  "landing.cta": string;
  "landing.footer": string;

  /** theme */
  "theme.light": string;
  "theme.dark": string;

  /** plans page */
  "plans.phasesCount": string;
  "plans.principles": string;
  "plans.recoveryRules": string;
  "plans.redFlags": string;
  "plans.phaseLabel": string;
  "plans.objective": string;
  "plans.cardio": string;
  "plans.strength": string;
  "plans.recovery": string;
  "plans.expectedResult": string;

  /** cardio table */
  "cardio.frequency": string;
  "cardio.rest": string;
  "cardio.notes": string;
  "cardio.warning": string;
  "cardio.elliptical": string;
  "cardio.sessions": string;

  /** table headers */
  "table.week": string;
  "table.duration": string;
  "table.speed": string;
  "table.incline": string;
  "table.note": string;
  "table.action": string;
  "table.type": string;
  "table.timesPerWeek": string;
  "table.intervals": string;
  "table.name": string;
  "table.setsReps": string;
  "table.startingWeight": string;
  "table.viewDetail": string;

  /** strength */
  "strength.status": string;
  "strength.frequency": string;
  "strength.interval": string;
  "strength.equipment": string;
  "strength.baseExercises": string;
  "strength.addedExercises": string;
  "strength.rules": string;
  "strength.progression": string;
  "strength.structure": string;
  "strength.weightRule": string;

  /** recovery */
  "recovery.restDays": string;
  "recovery.activeRecovery": string;
  "recovery.foamRolling": string;
  "recovery.sleep": string;

  /** weekly */
  "weekly.back": string;
  "weekly.weekTitle": string;
  "weekly.notFound": string;

  /** user */
  "user.title": string;
  "user.displayName": string;
  "user.gender": string;
  "user.age": string;
  "user.height": string;
  "user.weight": string;
  "user.bio": string;
  "user.save": string;
  "user.saving": string;
  "user.saved": string;
  "user.loginRequired": string;
}

export const localeNames: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "en-US": "English",
  "fr-FR": "Français",
  "ja-JP": "日本語",
};
