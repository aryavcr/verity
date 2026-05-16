"use client";
import { MODELS, getModelsByProvider } from "@/lib/constants/models";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { usePlaygroundStore } from "@/lib/stores/playground-store";
import { useApiKeysStore } from "@/lib/stores/api-keys-store";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { Tooltip } from "./ui/tooltip";
import { IconLockOpen2, IconPointer2 } from "@tabler/icons-react";

const TEMPLATES = [
  {
    id: "shipping",
    title: "Shipping Port Assistant",
    prompt: `You are a shipping port assistant for a major international cargo terminal. You help users track vessel arrivals and departures, container status, customs clearance requirements, and port scheduling. Be precise with times (always UTC), reference real maritime terminology, and never guess if you don't have the information.`,
  },
  {
    id: "support",
    title: "Customer Support Bot",
    prompt: `You are a customer support agent for a SaaS product management tool. Help users with billing questions, feature explanations, bug workarounds, and account management. Be empathetic, solution-oriented, and escalate to human support when you can't resolve an issue. Never make promises about future features.`,
  },
  {
    id: "code",
    title: "Code Reviewer",
    prompt: `You are a senior code reviewer. Review code snippets for bugs, security vulnerabilities, performance issues, and style improvements. Be specific about line numbers. Suggest fixes, not just problems. Prioritize issues by severity.`,
  },
  {
    id: "summarizer",
    title: "Content Summarizer",
    prompt: `Summarize articles and documents into clear, structured briefs. Preserve key facts, statistics, and quotes. Use bullet points for key findings. Flag any claims that seem unsubstantiated. Keep summaries under 200 words.`,
  },
];

const TEMPLATE_COLORS: Record<
  string,
  {
    bg: string;
    darkBg: string;
    badge: string;
    darkBadge: string;
    badgeText: string;
    category: string;
  }
> = {
  shipping: {
    bg: "oklch(0.95 0.03 250 / 0.35)",
    darkBg: "oklch(0.25 0.04 250 / 0.3)",
    badge: "oklch(0.90 0.06 250)",
    darkBadge: "oklch(0.35 0.08 250)",
    badgeText: "oklch(0.30 0.12 250)",
    category: "LOGISTICS",
  },
  support: {
    bg: "oklch(0.95 0.03 145 / 0.35)",
    darkBg: "oklch(0.25 0.04 145 / 0.3)",
    badge: "oklch(0.90 0.06 145)",
    darkBadge: "oklch(0.30 0.08 145)",
    badgeText: "oklch(0.25 0.10 145)",
    category: "SUPPORT",
  },
  code: {
    bg: "oklch(0.95 0.03 295 / 0.35)",
    darkBg: "oklch(0.25 0.04 295 / 0.3)",
    badge: "oklch(0.90 0.06 295)",
    darkBadge: "oklch(0.35 0.08 295)",
    badgeText: "oklch(0.30 0.12 295)",
    category: "ENGINEERING",
  },
  summarizer: {
    bg: "oklch(0.95 0.03 55 / 0.35)",
    darkBg: "oklch(0.28 0.04 55 / 0.3)",
    badge: "oklch(0.90 0.08 55)",
    darkBadge: "oklch(0.35 0.08 55)",
    badgeText: "oklch(0.30 0.12 55)",
    category: "CONTENT",
  },
  default: {
    bg: "oklch(0.95 0 0 / 0.3)",
    darkBg: "oklch(0.25 0 0 / 0.3)",
    badge: "oklch(0.90 0 0)",
    darkBadge: "oklch(0.35 0 0)",
    badgeText: "oklch(0.30 0 0)",
    category: "GENERAL",
  },
};

const TEMPLATE_PATTERNS: Record<string, React.ReactNode> = {
  shipping: (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className="absolute right-3 top-2 w-24 h-16 opacity-[0.15]"
    >
      <path
        d="M10 60L40 20L70 45L100 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 70L40 35L70 55L100 25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
      <circle cx="40" cy="20" r="2.5" fill="currentColor" />
      <circle cx="70" cy="45" r="2.5" fill="currentColor" />
      <circle cx="100" cy="15" r="2.5" fill="currentColor" />
      <rect
        x="5"
        y="55"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="95"
        y="10"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  ),
  support: (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className="absolute right-3 top-2 w-24 h-16 opacity-[0.15]"
    >
      <rect
        x="10"
        y="10"
        width="40"
        height="25"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M20 50L15 35"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="55"
        y="30"
        width="45"
        height="25"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M90 55L95 65"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="18"
        x2="38"
        y2="18"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="23"
        x2="32"
        y2="23"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="63"
        y1="38"
        x2="88"
        y2="38"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="63"
        y1="43"
        x2="80"
        y2="43"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="63"
        y1="48"
        x2="73"
        y2="48"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  ),
  code: (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className="absolute right-3 top-2 w-24 h-16 opacity-[0.15]"
    >
      <path
        d="M30 20L15 40L30 60"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 20L85 40L70 60"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="55"
        y1="12"
        x2="45"
        y2="68"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="95"
        y1="25"
        x2="115"
        y2="25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="95"
        y1="32"
        x2="110"
        y2="32"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="95"
        y1="39"
        x2="112"
        y2="39"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="92" cy="25" r="1.5" fill="currentColor" />
      <circle cx="92" cy="32" r="1.5" fill="currentColor" />
      <circle cx="92" cy="39" r="1.5" fill="currentColor" />
    </svg>
  ),
  summarizer: (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className="absolute right-1 top-2 w-24 h-16 opacity-[0.15]"
    >
      <rect
        x="10"
        y="8"
        width="55"
        height="65"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="18"
        y1="18"
        x2="55"
        y2="18"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="25"
        x2="50"
        y2="25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="32"
        x2="55"
        y2="32"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="39"
        x2="42"
        y2="39"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="50"
        x2="55"
        y2="50"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="57"
        x2="48"
        y2="57"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M75 25L85 15L110 15L110 55L85 55L75 45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="90"
        y1="25"
        x2="105"
        y2="25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="32"
        x2="102"
        y2="32"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="39"
        x2="105"
        y2="39"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const PROVIDERS = [
  { value: "openrouter", label: "OpenRouter" },
  { value: "google", label: "Google AI Studio" },
];

export function ConfigPanel() {
  const {
    systemPrompt,
    provider,
    model,
    executionStatus,
    setSystemPrompt,
    setProvider,
    setModel,
  } = usePlaygroundStore();

  const { setKey, getKey, hasKey } = useApiKeysStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [showTemplates, setShowTemplates] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyDraft, setKeyDraft] = useState("");
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRunning =
    executionStatus === "running" || executionStatus === "generating-tests";
  const models = getModelsByProvider(provider as "openrouter" | "google");
  const freeModels = models.filter((m) => m.free);
  const paidModels = models.filter((m) => !m.free);

  //free models grouped by provider
  const freeOpenRouter = MODELS.filter(
    (m) => m.provider === "openrouter" && m.free,
  );
  const freeGroq = MODELS.filter((m) => m.provider === "groq" && m.free);
  const freeGoogle = MODELS.filter((m) => m.provider === "google" && m.free);

  function handleModelChange(modelId: string) {
    setModel(modelId);
    const def = MODELS.find((m) => m.id === modelId);
    if (def) setProvider(def.provider);
  }

  function handleCopy() {
    if (!systemPrompt) return;
    navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setSystemPrompt(text);
    } catch {}
  }

  function handleTemplateSelect(prompt: string) {
    setSystemPrompt(prompt);
    setShowTemplates(false);
    textareaRef.current?.focus();
  }

  function handleSaveKey() {
    if (keyDraft.trim()) {
      setKey(provider, keyDraft.trim());
      setKeyDraft("");
      setShowKeyInput(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 rounded-lg">
      {/*card 1*/}
      <div className="bg-[#0f0f0f]  shadow-surface-6 rounded-xl border p-4 flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-indigo-300" />
          <span className="text-xs text-muted-foreground tracking-widest">
            BASE TASK
          </span>
        </div>

        {/*model select*/}
        <div className="flex mt-1 items-end overflow-auto gap-4">
          {/*Left*/}
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-sm flex items-center gap-1 font-medium ml-1 text-muted-foreground">
              <IconLockOpen2 size={13} />
              Free Models
            </span>

            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger
                placeholder="Choose a model"
                className="w-fit bg-surface-5 mb-1 shadow-surface-5
                            border rounded-lg max-w-5"
              />
              <SelectContent className="bg-surface-1/95">
                <SelectGroup className="">
                  <SelectLabel>OpenRouter</SelectLabel>
                  {freeOpenRouter.map((m, i) => (
                    <SelectItem
                      className="h-7"
                      key={m.id}
                      value={m.id}
                      index={i}
                    >
                      {m.name}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectLabel>Google AI Studio</SelectLabel>
                  {freeGoogle.map((m, i) => (
                    <SelectItem
                      className="h-7"
                      key={m.id}
                      value={m.id}
                      index={freeOpenRouter.length + i}
                    >
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/*sep*/}
          <span className="pb-1 text-2xl text-muted-foreground/40 select-none">
            /
          </span>
          {/*right*/}
          <div className="flex flex-col gap-2 mt-1 shrink-0">
            <div className="flex gap-1 items-end justify-start">
              <span className="text-sm font-medium ml-1 text-muted-foreground">
                Bring your own{" "}
              </span>
              <span className="text-xs font-medium text-muted-foreground/40">
                (soon)
              </span>
            </div>
            <button
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs mb-1 text-muted-foreground transition-colors hover:bg-surface-2 bg-surface-5 shadow-surface-5 hover:text-foreground whitespace-nowrap"
              onClick={() => {
                /*todo*/
              }}
            >
              <span className="flex items-center -space-x-0.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="#4285F4"
                    fillOpacity="0.18"
                  />
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="currentColor"
                    fillOpacity="0.10"
                  />
                  <path
                    d="M8 5L11 10H5L8 5Z"
                    fill="currentColor"
                    fillOpacity="0.45"
                  />
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="#FF6B35"
                    fillOpacity="0.15"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="2.5"
                    fill="#FF6B35"
                    fillOpacity="0.4"
                  />
                </svg>
              </span>
              <span>+</span>
              <span className="text-[13px] text-foreground/60">
                Add AI providers to select a model
              </span>
              <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {/*card 2*/}
      <div className="bg-surface-3 shadow-surface-6 rounded-xl border flex flex-1 flex-col min-h-0 overflow-hidden ">
        {/*toolbar*/}
        <div className="flex border-b shrink-0 items-center justify-between overflow-auto px-4 py-2">
          <span className="text-sm flex gap-2 font-mono uppercase font-medium tracking-wide items-end text-muted-foreground">
            <Terminal size={15} />
            System prompt
          </span>
          <div className="flex items-center gap-1">
            <Tooltip
              content="Choose a template"
              side="bottom"
              className="bg-black text-foreground rounded-sm"
            >
              <button
                onClick={() => setShowTemplates(true)}
                className="h-fit flex items-center rounded-md px-2 py-1 gap-1 text-xs border bg-surface-4 shadow-surface-4 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                <IconPointer2 size={14} />
                Use template
              </button>
            </Tooltip>
            <div className="w-px h-4 bg-border mx-1" />


            {/*copy*/}
            <Tooltip
              content="Copy prompt"
              side="bottom"
              className="bg-black text-foreground rounded-sm"
            >

              <button
                onClick={handleCopy}
                disabled={!systemPrompt}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors disabled:opacity-30"
              >
                {copied ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                      d="M1.5 6.5L5 10L11.5 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 13 13" fill="none">
                    <rect
                      x="1"
                      y="4"
                      width="8"
                      height="8"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    />
                    <path
                      d="M4 4V2.5A1.5 1.5 0 015.5 1H10A1.5 1.5 0 0111.5 2.5V7A1.5 1.5 0 0110 8.5H9"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    />
                  </svg>
                )}
              </button>
            </Tooltip>
            {/*paste button*/}
            <Tooltip
              content="Paste"
              side="bottom"
              className="bg-black text-foreground rounded-sm"
            >
              <button
                onClick={handlePaste}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 13 13" fill="none">
                  <rect
                    x="2.5"
                    y="2"
                    width="8"
                    height="10"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M5 2V1.5A.5.5 0 015.5 1h2a.5.5 0 01.5.5V2"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M4.5 6.5h4M4.5 8.5h2.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>

        {/*templates dialog*/}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="sm:max-w-lg bg-surface-1 max-h-150 shadow-surface-5 rounded-2xl p-0 gap-0 overflow-auto">
            <DialogHeader className="px-5 pt-5 pb-3">
              <DialogTitle
                className="text-xl font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Choose a template
              </DialogTitle>
              <DialogDescription className="text-foreground/70">
                Pick a starting point, then customize
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2 px-4 pb-4">
              {TEMPLATES.map((t) => {
                const colors = TEMPLATE_COLORS[t.id] ?? TEMPLATE_COLORS.default;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateSelect(t.prompt)}
                    className="group relative w-full text-left rounded-xl p-4 transition-all duration-150 hover:scale-[0.99] active:scale-[0.97] border border-transparent shadow-surface-2 hover:border-border"
                    style={{
                      backgroundColor: isDark ? colors.darkBg : colors.bg,
                    }}
                  >
                    {TEMPLATE_PATTERNS[t.id]}

                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold mb-2"
                      style={{
                        backgroundColor: isDark
                          ? colors.darkBadge
                          : colors.badge,
                        color: isDark ? colors.badge : colors.badgeText,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {colors.category}
                    </span>

                    <div className="flex relative flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground">
                        {t.title}
                      </span>
                      <span className="text-[13px] max-h-11 leading-relaxed overflow-scroll text-muted-foreground">
                        {t.prompt}
                      </span>
                    </div>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity text-foreground"
                    >
                      <path
                        d="M6 3l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
        {/*textarea*/}

        <textarea
          ref={textareaRef}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a..."
          spellCheck={false}
          className="min-h-0 flex-1 resize-none bg-[#0f0f0f] px-4 tracking-wide py-3 text-sm leading-relaxed text-foreground/80 placeholder:text-muted-foreground outline-none"
          style={{ fontFamily: "var(--font-sans)" }}
        />
      </div>

      {/*footer*/}
      <div className="flex shrink-0 items-center ml-1 justify-between ">
        <div className="flex gap-3">
          <span className="text-[13px] text-muted-foreground/40 font-mono">
            {systemPrompt.length > 0 ? `${systemPrompt.length} chars` : ""}
          </span>
          <span className="text-[13px] text-muted-foreground/40 font-mono">
            {systemPrompt.length > 0
              ? `~${Math.ceil(systemPrompt.length / 4)} tokens`
              : ""}
          </span>
        </div>

        <button
          disabled={isRunning || !systemPrompt.trim()}
          className={cn(
            "relative h-fit py-1 text-sm rounded-xl w-fit px-3 font-medium transition-all duration-200 active:scale-[0.97] flex items-center gap-2",
            isRunning
              ? "bg-primary/80 text-primary-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            !systemPrompt.trim() && "opacity-40 pointer-events-none",
          )}
          onClick={() => {
            import("@/lib/ai/execute-run").then(({ executeRun }) =>
              executeRun(),
            );
          }}
        >
          {/*glow when run button is ready*/}
          {!isRunning && systemPrompt.trim() && (
            <div className="absolute inset-0 rounded-full ring-2 ring-accent/20 animate-pulse pointer-events-none" />
          )}

          {isRunning ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="animate-spin"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="20 12"
                />
              </svg>
              <span>Running…</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 2.5L11.5 7L4 11.5V2.5Z" fill="currentColor" />
              </svg>
              <span>Run</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
