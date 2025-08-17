import React, { useEffect, useRef, useState } from "react";

const ShimmerWrapper = ({
    children,
    // sizing
    fallbackHeight = "200px",
    fallbackWidth = "100%",
    fixedHeight,
    fixedWidth,
    lockHeightWhileLoading = false,

    // visuals
    borderRadius = "12px",
    baseColor = "#3b0764",
    highlightColor = "#c084fc",
    duration = 1400,
    direction = "ltr",

    // control
    loading: controlledLoading,
    enterOnceKey,
    autoLoadTime = 600,
    pauseOnTabHide = true,
    className,
    style,
}) => {
    const isControlled = typeof controlledLoading === "boolean";
    const [internalLoading, setInternalLoading] = useState(!isControlled);
    const loading = isControlled ? controlledLoading : internalLoading;

    const toCss = (v, fallback) => (v == null ? fallback : typeof v === "number" ? `${v}px` : v);

    const [size, setSize] = useState({
        width: toCss(fallbackWidth, "100%"),
        height: toCss(fallbackHeight, "200px"),
    });

    const wrapperRef = useRef(null);

    // Measure child
    useEffect(() => {
        if (!wrapperRef.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect || {};
            setSize({
                width: width > 0 ? `${width}px` : toCss(fallbackWidth, "100%"),
                height: height > 0 ? `${height}px` : toCss(fallbackHeight, "200px"),
            });
        });
        ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, [fallbackHeight, fallbackWidth]);

    // Auto mode (optional)
    useEffect(() => {
        if (isControlled) return;
        const key = enterOnceKey ? `shimmer_once:${enterOnceKey}` : null;
        const already = typeof window !== "undefined" && key && sessionStorage.getItem(key) === "done";
        if (already) { setInternalLoading(false); return; }
        setInternalLoading(true);
        const t = setTimeout(() => {
            setInternalLoading(false);
            if (key) sessionStorage.setItem(key, "done");
        }, autoLoadTime);
        return () => clearTimeout(t);
    }, [isControlled, enterOnceKey, autoLoadTime]);

    // Pause CSS anim when tab hidden
    const [tabHidden, setTabHidden] = useState(false);
    useEffect(() => {
        if (!pauseOnTabHide || typeof document === "undefined") return;
        const onVis = () => setTabHidden(document.hidden);
        onVis();
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [pauseOnTabHide]);

    // Dimensions
    const resolvedWidth = toCss(fixedWidth, null) ?? size.width;
    const resolvedHeight = toCss(fixedHeight, null) ??
        (loading && lockHeightWhileLoading ? toCss(fallbackHeight, "200px") : size.height);

    return (
        <div
            className={className}
            style={{
                width: resolvedWidth,
                height: resolvedHeight,
                // IMPORTANT: don't clip the child/card except when loading
                overflow: loading ? "hidden" : "visible",
                position: "relative",
                transition: "height 0.3s ease, width 0.3s ease",
                // don't set borderRadius here; let the child control its own radii/shadows
                ...style,
            }}
        >
            {/* Child content (can cast shadow outside; we don't clip when !loading) */}
            <div
                ref={wrapperRef}
                style={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s ease" }}
            >
                {children}
            </div>

            {/* Shimmer mask that is clipped & rounded, WITHOUT clipping the child */}
            {loading && (
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius,         // clip the shimmer to rounded corners
                        overflow: "hidden",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            background: `linear-gradient(
                ${direction === "rtl" ? "270deg" : "90deg"},
                ${baseColor} 0%,
                ${highlightColor} 50%,
                ${baseColor} 100%
              )`,
                            backgroundSize: "200% 100%",
                            animation: `shimmer ${duration}ms infinite`,
                            animationPlayState: tabHidden ? "paused" : "running",
                        }}
                    />
                </div>
            )}

            <style>{`
        @keyframes shimmer {
          0% { background-position: ${direction === "rtl" ? "200%" : "-200%"} 0; }
          100% { background-position: ${direction === "rtl" ? "-200%" : "200%"} 0; }
        }
      `}</style>
        </div>
    );
};

export default ShimmerWrapper;
