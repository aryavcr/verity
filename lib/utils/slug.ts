import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export function generateSlug(prefix?: string): string {
  const id = nanoid();
  return prefix ? `${prefix}-${id}` : id;
}
