export const haversineKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const radiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return radiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export interface DeliveryThreshold {
  km: number;
  fee: number;
}

export const calculateDeliveryFee = (
  distanceKm: number,
  thresholds?: DeliveryThreshold[]
): number => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => a.km - b.km);
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
      if (distanceKm >= sorted[i].km) {
        return sorted[i].fee;
      }
    }
    return sorted[0].fee;
  }

  if (distanceKm <= 3) return 40;
  if (distanceKm <= 6) return 50;
  if (distanceKm <= 9) return 60;
  return 70;
};
