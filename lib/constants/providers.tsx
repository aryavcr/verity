import {
  OpenAI,
  Anthropic,
  Google,
  Groq,
  OpenRouter,
  Nvidia,
  Moonshot,
  Zhipu,
  Meta,
} from "@lobehub/icons";
import type { ComponentType } from "react";

export type ProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "groq"
  | "openrouter";

type IconC = ComponentType<{ size?: number; className?: string }>;

/** we prefer the colored brand variant & fallback to the base component if `.Color` is absent in the installed @lobehub/icons version. */
function colored(mark: unknown): IconC {
  const m = mark as { Color?: IconC } | undefined;
  return m && m.Color ? m.Color : (mark as IconC);
}

export const PROVIDER_META: Record<
  ProviderId,
  { label: string; hint: string; Icon: IconC }
> = {
  openai: { label: "OpenAI", hint: "sk-...", Icon: colored(OpenAI) },
  anthropic: {
    label: "Anthropic",
    hint: "sk-ant-...",
    Icon: colored(Anthropic),
  },
  google: { label: "Google AI", hint: "AIza...", Icon: colored(Google) },
  groq: { label: "Groq", hint: "gsk_...", Icon: colored(Groq) },
  openrouter: {
    label: "OpenRouter",
    hint: "sk-or-...",
    Icon: colored(OpenRouter),
  },
};

export const PROVIDER_LIST: ProviderId[] = [
  "openai",
  "anthropic",
  "google",
  "groq",
  "openrouter",
];

/** Brand key (from a model id) -> colored maker icon. */
const BRAND_ICON: Record<string, IconC> = {
  openrouter: colored(OpenRouter),
  openai: colored(OpenAI),
  nvidia: colored(Nvidia),
  google: colored(Google),
  moonshotai: colored(Moonshot),
  "z-ai": colored(Zhipu),
  meta: colored(Meta),
  groq: colored(Groq),
  anthropic: colored(Anthropic),
};

/** Resolve the underlying maker's colored logo for a model & it fallbsck to the openrouter mark for makers with no lobehub icon (e.g. poolside). */
export function getModelBrandIcon(model: {
  id: string;
  provider: string;
}): IconC {
  const id = model.id.toLowerCase();
  let key: string;
  if (id.includes("/"))
    key = id.split("/")[0]; // openai/…, nvidia/…, openrouter/free, groq/compound
  else if (id.startsWith("gemini"))
    key = "google"; // bare gemini-* ids
  else if (id.startsWith("llama"))
    key = "meta"; // bare llama-* ids
  else key = model.provider; // any other bare id
  return BRAND_ICON[key] ?? colored(OpenRouter);
}
