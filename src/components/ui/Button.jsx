import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Magnetic from './Magnetic';

const VARIANT_STYLES = {
  primary:
    "border-white/15 bg-white/5 text-white hover:border-white/25 shadow-black/30 hover:shadow-black/50",
  solid:
    "border-transparent text-white shadow-black/40 hover:shadow-black/60",
  outline:
    "border-white/30 bg-transparent text-white/90 hover:border-white/50 hover:text-white",
  ghost:
    "border-transparent bg-white/5 text-white/90 hover:bg-white/10 hover:text-white",
};

const SIZE_STYLES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  backgroundColor = "#455CE9",
  className,
  variant = "primary",
  size = "md",
  ...attributes
}) {

  const circle = useRef(null);
  let timeline = useRef(null);
  let timeoutId = null;
  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true })
    timeline.current
      .to(circle.current, { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" }, "enter")
      .to(circle.current, { top: "-150%", width: "125%", duration: 0.25 }, "exit")
  }, [])

  const manageMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeline.current.tweenFromTo('enter', 'exit');
  }

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current.play();
    }, 300)
  }

  return (
    <Magnetic>
      <div
        className={`group relative flex items-center justify-center rounded-[3em] border backdrop-blur-md shadow-lg cursor-pointer overflow-hidden transition-all duration-300 ease-out active:scale-[0.98] ${VARIANT_STYLES[variant] || VARIANT_STYLES.primary} ${SIZE_STYLES[size] || SIZE_STYLES.md} ${className || ""}`}
        onMouseEnter={() => { manageMouseEnter() }}
        onMouseLeave={() => { manageMouseLeave() }}
        {...attributes}
      >
        <span className="relative z-10 transition-colors duration-400 ease-linear">
          {
            children
          }
        </span>
        <div
          ref={circle}
          style={{ backgroundColor }}
          className="w-full h-[150%] absolute rounded-[50%] top-full blur-[2px]"
        ></div>
      </div>
    </Magnetic>
  )
}
