export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function absoluteNumber(value: string) {
  return value.replace(/[^\d.]/g, "");
}

