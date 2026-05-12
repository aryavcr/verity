import { ThemeToggle } from "@/components/theme-toggle"
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react"
import { Ticket, } from "lucide-react"


export function Navbar() {
    return (
        <header className="h-12 shrink-0 border-b border-border backdrop-blur-md bg-surface-1/80 shadow-surface-1 flex items-center justify-between px-4 sticky top-0 z-20">
            {/*left*/}
            <div className="flex ml-3 gap-3 items-center text-red-400 text-lg ">
                <Ticket /><span className="uppercase font-semibold">Verity</span>
                <span className="text-muted-foreground">/</span>
                <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                    Classic Mode
                </span>
            </div>
            {/*right*/}
            <div className="flex items-center gap-1">
                <div className="flex items-center  gap-4 mr-4">
                    <a href="https://github.com/aryavcr"><IconBrandGithub /></a>
                    <a href="https://x.com/aryavcr"><IconBrandX /></a>
                </div>
                <ThemeToggle />
            </div>
        </header>
    )
}