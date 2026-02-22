import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Magnetic from '../Magnetic';

export default function Button({ children, backgroundColor = "#455CE9", className, ...attributes }) {

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
        className={`group relative flex items-center justify-center rounded-[3em] border border-[rgb(136,136,136)] cursor-pointer px-6 py-3 overflow-hidden ${className || ""}`}
        onMouseEnter={() => { manageMouseEnter() }}
        onMouseLeave={() => { manageMouseLeave() }}
        {...attributes}
      >
        <span className="relative z-10 transition-colors duration-400 ease-linear group-hover:text-white">
          {
            children
          }
        </span>
        <div
          ref={circle}
          style={{ backgroundColor }}
          className="w-full h-[150%] absolute rounded-[50%] top-full"
        ></div>
      </div>
    </Magnetic>
  )
}
