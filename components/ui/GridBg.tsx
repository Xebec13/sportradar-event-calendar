export default function GridBg() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-red-600)_2%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-red-600)_15%,transparent)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_95%)] bg-size-[10%_10%]" />
        </div>
    );
}
