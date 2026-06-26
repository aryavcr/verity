import {
  IconLayoutGridFilled,
  IconShieldFilled,
  IconAlertTriangleFilled,
  IconScaleFilled,
  IconBraces,
  IconClipboardCheckFilled,
  IconBulbFilled,
  IconMask,
} from "@tabler/icons-react";

// eval type icons in a tsx file to keep the server-side eval types data module free of react imports, shared by picker and gallery

export type IconComponent = React.ComponentType<{
  size?: number | string;
  className?: string;
  stroke?: number | string;
  style?: React.CSSProperties;
  color?: string;
}>;

export const EVAL_TYPE_ICONS: Record<string, IconComponent> = {
  general: IconLayoutGridFilled,
  security: IconShieldFilled,
  hallucination: IconAlertTriangleFilled,
  bias: IconScaleFilled,
  code: IconBraces,
  compliance: IconClipboardCheckFilled,
  reasoning: IconBulbFilled,
  persona: IconMask,
};

// get icon for eval type, falls back to general
export function getEvalTypeIcon(id: string | null | undefined): IconComponent {
  return (id && EVAL_TYPE_ICONS[id]) || EVAL_TYPE_ICONS.general;
}

// signature colors per eval type for gallery cards and charts

export const EVAL_TYPE_COLORS: Record<string, string> = {
  general: "#818CF8", // indigo-400
  security: "#F87171", // red-400
  hallucination: "#FBBF24", // amber-400
  bias: "#E879F9", // fuchsia-400
  code: "#38BDF8", // sky-400
  compliance: "#34D399", // emerald-400
  reasoning: "#A78BFA", // violet-400
  persona: "#FB7185", // rose-400
};

// get signature hex color for eval type, falls back to general
export function getEvalTypeColor(id: string | null | undefined): string {
  return (id && EVAL_TYPE_COLORS[id]) || EVAL_TYPE_COLORS.general;
}
