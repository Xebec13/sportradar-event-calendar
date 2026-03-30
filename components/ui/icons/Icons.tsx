import { iconRegistry } from "./icon-registry"

export type IconName = keyof typeof iconRegistry

interface IconProps {
    name: IconName
    size?: number
    className?: string
}
// Renders any registered icon by name.
// To add a new icon, update icon-registry.ts — this file stays unchanged.
// size sets base dimensions (default 14); override with className for responsive sizing.

export default function Icon({ name, size = 14, className }: IconProps) {
    const IconComponent = iconRegistry[name]
    return <IconComponent size={size} className={className} />
}
