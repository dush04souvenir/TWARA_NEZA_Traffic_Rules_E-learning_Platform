import Image from "next/image"

export function Logo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                <Image
                    src="/icon.png"
                    alt="TWARA NEZA Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                />
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className="font-bold text-xl text-foreground tracking-tight leading-none">TWARA NEZA</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Rwanda Traffic Rules</span>
                </div>
            )}
        </div>
    )
}
