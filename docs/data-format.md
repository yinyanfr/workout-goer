# Workout Plan JSON Format

This document describes the JSON schema accepted by Workout Goer's plan importer. The importer accepts **both camelCase and snake_case** field names — snake_case is the canonical storage format.

## Quick Start

Copy this prompt to any LLM (ChatGPT, Gemini, Claude):

```
You are a strict workout plan extractor. Based on the user's fitness needs, output a valid JSON object.

Rules:
1. Output ONLY the JSON — no explanation, no Markdown, no code fences
2. Follow the structure described below exactly
3. Field names must match case-sensitive
4. Don't invent information the user hasn't mentioned
5. Break down all extractable info into atomic items
6. For missing fields: use "" for strings, [] for arrays, omit optional objects
7. Preserve all numbers, ranges, frequencies, phases, exercises, risks, and recovery info found in the source text
8. If the input is incomplete, output empty values rather than guessing
```

## Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `goal` | `string` | Yes | Overall training goal, e.g. "半年减脂与体能提升" |
| `principles` | `string[]` | Yes | Training principles (one per string) |
| `phases` | `Phase[]` | Yes | Training phases (at least one) |
| `weekly_recovery_rules` | `string[]` | Yes | Weekly recovery rules |
| `red_flags` | `string[]` | Yes | Risk warnings |

## Phase Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phase` | `string` | Yes | Phase name, e.g. "第1-4周" |
| `objective` | `string` | Yes | Phase objective |
| `cardio` | `Cardio?` | No | Cardio training plan |
| `strength` | `Strength?` | No | Strength training plan |
| `recovery` | `Recovery?` | No | Recovery & rest plan |
| `expected_result` | `ExpectedResult?` | No | Expected outcomes |

## Cardio Object

| Field | Type | Description |
|-------|------|-------------|
| `frequency_per_week` | `string` | Weekly frequency, e.g. "5-6天" |
| `rest_days` | `string` | Rest day description |
| `plan` | `CardioWeek[]` | Week-by-week progression. Each entry has: `weeks` (e.g. "第1-2周") or `week` (e.g. 9), `duration_minutes`, `speed_kmh`, `incline_percent`, optional `interval_example` |
| `structure` | `CardioSession[]` | Structured session types. Each entry has: `type` (e.g. "主力日"), `times_per_week`, `duration_minutes`, optional `speed_kmh`, `incline_percent`, `intervals` |
| `notes` | `string[]` | Additional notes |
| `optional` | `object` | Alternatives, e.g. `{ "elliptical": "..." }` |
| `warning` | `string` | Risk notes |

> Use `plan` for week-by-week progression, `structure` for fixed session types (e.g. 主力日/间歇日/轻松日). You can use both or just one.

## Strength Object

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Status, e.g. "暂不安排" |
| `frequency_per_week` | `number \| string` | Weekly frequency |
| `interval_days` | `string` | Rest interval between sessions |
| `equipment` | `string` | Equipment used |
| `exercises` | `Exercise[]` | Base exercises. Each has: `name`, `sets_reps` (e.g. "2×12"), `starting_weight` |
| `added_exercises` | `Exercise[]` | New exercises added in this phase |
| `rules` | `string[]` | Training execution rules |
| `progression` | `string` | Progression description |
| `structure` | `string` | Training structure description |
| `weight_rule` | `string` | Weight increase rules |

## Recovery Object

| Field | Type | Description |
|-------|------|-------------|
| `weekly_rest_days` | `number` | Full rest days per week |
| `active_recovery` | `string` | Active recovery description |
| `foam_rolling` | `string` | Foam rolling instructions |
| `sleep` | `string` | Sleep requirements |

## Expected Result Object

| Field | Type | Description |
|-------|------|-------------|
| `weight_loss_kg` | `string` | Expected weight loss this phase, e.g. "4-7" |
| `cumulative_weight_loss_kg` | `string` | Cumulative weight loss |
| `expected_weight_kg` | `string` | Target weight |

## Minimal Example

```json
{
  "goal": "半年减脂与体能提升",
  "principles": [
    "保护关节优先于减脂速度",
    "一次只调整一个变量"
  ],
  "phases": [
    {
      "phase": "第1-4周",
      "objective": "建立基线",
      "cardio": {
        "frequency_per_week": "5-6天",
        "plan": [
          {
            "weeks": "第1-2周",
            "duration_minutes": 25,
            "speed_kmh": 3.0,
            "incline_percent": 0
          }
        ]
      },
      "expected_result": {
        "weight_loss_kg": "4-7"
      }
    }
  ],
  "weekly_recovery_rules": [
    "每周1天完全休息"
  ],
  "red_flags": [
    "膝盖持续疼痛"
  ]
}
```

## CamelCase Support

If your AI outputs camelCase (e.g. `durationMinutes`, `frequencyPerWeek`, `redFlags`), the importer automatically normalizes it to snake_case. Exception: `weeklyPlans` is renamed to `plan`. Object arrays like `[{ "content": "..." }]` are unwrapped to string arrays.
