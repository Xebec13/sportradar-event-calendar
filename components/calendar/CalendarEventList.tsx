export default function CalendarEventList() {
    return (
        <section className="bg-blue-950/40 border-b border-r border-l border-blue-950 min-h-screen">
            <div className="flex items-center justify-between gap-2 text-sm">
                <div className="min-h-30 bg-blue-950/50 w-full px-4 py-3 flex items-center justify-start gap-6 shadow-2xl">
                    <div className="min-h-20 flex flex-col justify-center">
                        <div className="team">18:00</div>
                        
                    </div>
                    <div className="min-h-20 flex flex-col justify-center">
                        <div className="team">NAME</div>
                        <div className="team">NAME</div>
                    </div>
                </div>
            </div>
        </section>
    )
}