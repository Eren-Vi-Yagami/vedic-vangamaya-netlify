import Link from "next/link";
import Image from "next/image";
import styles from "./FloatingEngine.module.css";

/**
 * FloatingEngine Component
 * 
 * Displays a fixed floating widget with a rotating engine logo 
 * and a static foreground image (Tilak).
 * Rotation speed is set to 1 RPM (60s) via CSS module.
 */
export default function FloatingEngine() {
    return (
        <Link href="/about_engine" className="fixed bottom-4 right-4 z-50 max-sm:hidden max-md:hidden flex items-center space-x-3 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 group hover:bg-black/30 transition-all">

            {/* Logo stack */}
            <div className="relative w-[60px] h-[60px]">

                {/* Rotating engine (background layer) */}
                {/* We use the module class for the animation to be 100% sure it works */}
                <div className={`absolute inset-0 ${styles['engine-container']}`}>
                    <Image
                        src="/images/engines_logo.png"
                        alt="DSM Engine"
                        fill
                        className="object-contain opacity-90"
                        priority
                    />
                </div>

                {/* Static tilak (foreground layer) */}
                <div className="absolute translate-x-[23px] translate-y-[23px] z-10 w-[15px] h-[15px]">
                    <Image
                        src="/images/tilak.png"
                        alt="Tilak"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <span className="text-white text-sm font-medium tracking-wide">
                GARUDA: Prime-Engine
            </span>
        </Link>
    );
}
