export function Flash({ message, error }: { message?: string; error?: string }) {
  if (!message && !error) return null;
  return <div className={error ? "notice error" : "notice"}>{error || message}</div>;
}
