export function getCenterFromSelection(source?: { latitude?: string; longitude?: string } | null,
                                       balangay?: { latitude?: string; longitude?: string } | null,
                                       purok?: { latitude?: string; longitude?: string } | null) {
  if (source?.latitude && source?.longitude) return source;
  if (balangay?.latitude && balangay?.longitude) return balangay;
  if (purok?.latitude && purok?.longitude) return purok;
  return null;
}
