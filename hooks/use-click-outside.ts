import { useEffect, type RefObject } from "react"

// T extends HTMLElement lets the ref be typed to the specific element (e.g. HTMLDivElement)
// mousedown fires before blur and click — avoids race conditions when closing popovers
export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, callback: () => void): void {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [ref, callback])
}
