export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';

  const totalMinutes = Math.round(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} godz.`;
  return `${h} godz. ${m} min`;
};

/**
 * Prosty szacunek czasu (bez postojów) na bazie średniej prędkości.
 * Używany jako fallback, gdy nie mamy realnego duration z API.
 */
export const estimateDurationSecondsFromDistanceKm = (
  distanceKm: number,
  avgSpeedKmh = 90,
): number => {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;
  if (!Number.isFinite(avgSpeedKmh) || avgSpeedKmh <= 0) return 0;
  return (distanceKm / avgSpeedKmh) * 3600;
};

export const formatTravelTimeFromDistanceKm = (
  distanceKm: number,
  avgSpeedKmh = 90,
): string => {
  const seconds = estimateDurationSecondsFromDistanceKm(distanceKm, avgSpeedKmh);
  return formatDuration(seconds);
};
