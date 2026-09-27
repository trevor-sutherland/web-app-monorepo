import { PREP_STEPS, type Preparation, type PrepStep } from './recipe';

function hasTime(value: PrepStep['time'] | undefined): boolean {
  return (
    value !== '' &&
    value !== null &&
    value !== undefined &&
    !Number.isNaN(Number(value))
  );
}

export function formatStepTime(step: PrepStep | undefined): string {
  if (!step || !hasTime(step.time)) return '—';
  const unit = step.unit || 'hours';
  return `${step.time} ${unit}`;
}

export function formatTemperature(step: PrepStep | undefined): string {
  if (
    !step ||
    step.temperature === '' ||
    step.temperature === null ||
    step.temperature === undefined
  ) {
    return '—';
  }
  return `${step.temperature} F`;
}

function stepTimeInHours(step: PrepStep | undefined): number {
  if (!step || !hasTime(step.time)) return 0;
  const time = Number(step.time);
  const unit = step.unit || 'hours';
  return unit === 'minutes' ? time / 60 : time;
}

export function totalPrepHours(preparation: Preparation): number {
  return PREP_STEPS.reduce(
    (sum, key) => sum + stepTimeInHours(preparation[key]),
    0,
  );
}

export function formatTotalHours(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded} hours`;
}
