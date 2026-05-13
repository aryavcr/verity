import { ThemeToggle } from "@/components/theme-toggle";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { Ticket } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-12 shrink-0 border-b-2 bg-surface-3 shadow-surface-4 flex items-center justify-between sticky top-0 px-2 z-20">
      {/*left*/}
      <div className="flex gap-4 text-red-400 text-lg ">
        <div className="flex  items-center gap-1 bg-surface-5 shadow-surface-5 rounded-sm px-2 ">
          <Ticket />
          <span
            className="uppercase tracking-wide font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Verity
          </span>
        </div>
        <span className="text-muted-foreground">/</span>
        <span className="text-[14px] tracking-wide flex items-center gap-2 font-mono font-medium self-center text-muted-foreground/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-stars"
            viewBox="0 0 16 16"
          >
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
          </svg>
          using &apos;LLM-as-judge&apos; method
        </span>
      </div>
      {/*right*/}
      <div className="flex items-center gap-1">
        <div className="flex items-center  gap-4 mr-4">
          <a href="https://github.com/aryavcr">
            <IconBrandGithub />
          </a>
          <a href="https://x.com/aryavcr">
            <IconBrandX />
          </a>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
