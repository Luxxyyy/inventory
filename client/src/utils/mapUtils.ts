export function getCenterFromSelection(
  source?: { latitude?: string; longitude?: string } | null,
  balangay?: { latitude?: string; longitude?: string } | null,
  purok?: { latitude?: string; longitude?: string } | null,
  sheet?: { latitude?: string; longitude?: string } | null
) {
  if (purok?.latitude && purok?.longitude) return purok;
  if (balangay?.latitude && balangay?.longitude) return balangay;
  if (sheet?.latitude && sheet?.longitude) return sheet;
  if (source?.latitude && source?.longitude) return source;
  return null;
}
