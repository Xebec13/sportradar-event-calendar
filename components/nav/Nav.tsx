"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Calendar, CalendarPlus, type LucideIcon } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useClickOutside } from "@/hooks/use-click-outside";

/**
 * Nav — primary navigation bar, visible on all breakpoints.
 *
 * Structure:
 * - Left: Logo wrapped in a home Link
 * - Right: hamburger trigger + animated dropdown menu
 *
 * navItems defines all navigation links (href, label, title, Lucide icon).
 * To add a new route, add a single entry to the array — no JSX changes needed.
 *
 * Hamburger: three lines generated from Array.from({ length: 3 }).
 * On group-hover the lines transition to red-600/80.
 *
 * Dropdown animation uses the CSS grid trick:
 * - grid-rows-[0fr] + opacity-0 → hidden (collapsed, no height)
 * - grid-rows-[1fr] + opacity-100 → visible (expanded)
 * - overflow-hidden on the inner div is required for the 0fr collapse to work.
 *
 * isOpen is toggled via toggleMenu using the functional setState form (prev)
 * to avoid stale closure issues on rapid clicks.
 */
const navItems: { href: string; label: string; title: string; icon: LucideIcon }[] = [
    { href: "/", label: "Calendar", title: "Calendar", icon: Calendar },
    { href: "/add-event", label: "Add Event", title: "Add Event", icon: CalendarPlus },
];
export default function Nav() {
    const navRef = useRef<HTMLElement>(null)
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    useClickOutside(navRef, () => setIsOpen(false))

    return (
        <nav ref={navRef} className="relative flex items-center justify-between min-h-15 py-1.5 px-4 rounded-md bg-blue-950">
            <Link href="/">
                <Logo />
            </Link>

            <div className="group flex flex-col items-center justify-center gap-1 size-full max-w-fit cursor-pointer" onClick={toggleMenu}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-0.5 w-5 md:h-0.75 md:w-6 bg-current rounded-md transition-colors duration-150 ease-in group-hover:bg-red-600/80" />
                ))}
            </div>

            <div className={`absolute z-50 top-full min-w-1/3 md:min-w-1/5 right-0 grid transition-all duration-150 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}>
                <div className="overflow-hidden">
                    <div className="flex flex-col justify-end rounded-md bg-blue-950 border border-neutral-950/50 text-xs md:text-sm p-2">
                        {navItems.map(({ href, label, title, icon: Icon }) => (
                            <Link key={href} href={href} title={title} className="flex justify-between items-center gap-1 py-2 px-4 rounded-md bg-transparent transition-colors duration-150 ease-in hover:bg-blue-900/80">
                                <Icon className="size-4 md:size-5"/>
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
