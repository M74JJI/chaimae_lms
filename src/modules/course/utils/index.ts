export function formatCourseDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourPart = hours > 0 ? `${hours}h` : "";
  const minutePart = remainingMinutes > 0 ? `${remainingMinutes}m` : "";

  // Add a space only if both parts exist
  return [hourPart, minutePart].filter(Boolean).join(" ");
}
