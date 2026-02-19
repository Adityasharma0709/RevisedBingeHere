import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';

export default function Magnetic({ children }) {
    const magnetic = useRef(null);

    useEffect(() => {
        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" })
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" })

        const node = magnetic.current; // Capture ref

        const mouseMove = (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = node.getBoundingClientRect();
            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)
            xTo(x * 0.35);
            yTo(y * 0.35)
        }

        const mouseLeave = (e) => {
            xTo(0);
            yTo(0)
        }

        if (node) {
            node.addEventListener("mousemove", mouseMove)
            node.addEventListener("mouseleave", mouseLeave)
        }

        return () => {
            if (node) {
                node.removeEventListener("mousemove", mouseMove)
                node.removeEventListener("mouseleave", mouseLeave)
            }
        }
    }, [])

    return (
        React.cloneElement(children, { ref: magnetic })
    )
}
