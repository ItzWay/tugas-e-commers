export function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function tanggal(value: Date) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

export const statusLabel: Record<string, string> = {
  created: "Dibuat",
  processing: "Diproses",
  completed: "Selesai",
};
