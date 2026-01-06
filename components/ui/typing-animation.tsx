"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, MotionProps, useInView } from "motion/react"

import { cn } from "@/lib/utils"

interface TypingAnimationProps extends MotionProps {
  children?: string
  words?: string[]
  className?: string
  duration?: number
  typeSpeed?: number
  deleteSpeed?: number
  delay?: number
  pauseDelay?: number
  loop?: boolean
  as?: React.ElementType
  startOnView?: boolean
  showCursor?: boolean
  blinkCursor?: boolean
  cursorStyle?: "line" | "block" | "underscore"
}

/**
 * Renders a typewriter-style text animation with optional multi-word cycling, cursor, and in-view start behavior.
 *
 * The component types and optionally deletes characters from either the provided `words` array or the `children` string,
 * supports configurable speeds and delays, can loop through multiple words, and displays a cursor in selectable styles.
 *
 * @param children - A single string to animate when `words` is not provided
 * @param words - Array of words to cycle through; if omitted and `children` is provided the component animates that single string
 * @param className - Additional CSS class names applied to the root element
 * @param duration - Base timing value (ms) used when `typeSpeed` is not provided
 * @param typeSpeed - Milliseconds per character while typing; defaults to `duration` when omitted
 * @param deleteSpeed - Milliseconds per character while deleting; defaults to half of `typeSpeed`
 * @param delay - Initial delay (ms) before starting the first animation cycle
 * @param pauseDelay - Delay (ms) to wait after finishing a word before deleting when cycling
 * @param loop - If true, continuously cycles through `words`; otherwise stops after the last word
 * @param as - Element type to render as (e.g., "span", "div"); defaults to "span"
 * @param startOnView - If true, animation only starts when the element is scrolled into view
 * @param showCursor - If true, displays a cursor alongside the animated text
 * @param blinkCursor - If true, applies a blinking animation to the cursor
 * @param cursorStyle - Visual style of the cursor: `"line"` (default), `"block"`, or `"underscore"`
 * @param props - Additional props forwarded to the rendered element
 * @returns The rendered element containing the animated text and optional cursor
 */
export function TypingAnimation({
  children,
  words,
  className,
  duration = 100,
  typeSpeed,
  deleteSpeed,
  delay = 0,
  pauseDelay = 1000,
  loop = false,
  as: Component = "span",
  startOnView = true,
  showCursor = true,
  blinkCursor = true,
  cursorStyle = "line",
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  })

  const [displayedText, setDisplayedText] = useState<string>("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing")
  const elementRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const wordsToAnimate = useMemo(
    () => words || (children ? [children] : []),
    [words, children]
  )
  const hasMultipleWords = wordsToAnimate.length > 1

  const typingSpeed = typeSpeed || duration
  const deletingSpeed = deleteSpeed || typingSpeed / 2

  const shouldStart = startOnView ? isInView : true

  useEffect(() => {
    if (!shouldStart || wordsToAnimate.length === 0) return

    const timeoutDelay =
      delay > 0 && displayedText === ""
        ? delay
        : phase === "typing"
          ? typingSpeed
          : phase === "deleting"
            ? deletingSpeed
            : pauseDelay

    const timeout = setTimeout(() => {
      const currentWord = wordsToAnimate[currentWordIndex] || ""
      const graphemes = Array.from(currentWord)

      switch (phase) {
        case "typing":
          if (currentCharIndex < graphemes.length) {
            setDisplayedText(graphemes.slice(0, currentCharIndex + 1).join(""))
            setCurrentCharIndex(currentCharIndex + 1)
          } else {
            if (hasMultipleWords || loop) {
              const isLastWord = currentWordIndex === wordsToAnimate.length - 1
              if (!isLastWord || loop) {
                setPhase("pause")
              }
            }
          }
          break

        case "pause":
          setPhase("deleting")
          break

        case "deleting":
          if (currentCharIndex > 0) {
            setDisplayedText(graphemes.slice(0, currentCharIndex - 1).join(""))
            setCurrentCharIndex(currentCharIndex - 1)
          } else {
            const nextIndex = (currentWordIndex + 1) % wordsToAnimate.length
            setCurrentWordIndex(nextIndex)
            setPhase("typing")
          }
          break
      }
    }, timeoutDelay)

    return () => clearTimeout(timeout)
  }, [
    shouldStart,
    phase,
    currentCharIndex,
    currentWordIndex,
    displayedText,
    wordsToAnimate,
    hasMultipleWords,
    loop,
    typingSpeed,
    deletingSpeed,
    pauseDelay,
    delay,
  ])

  const currentWordGraphemes = Array.from(
    wordsToAnimate[currentWordIndex] || ""
  )
  const isComplete =
    !loop &&
    currentWordIndex === wordsToAnimate.length - 1 &&
    currentCharIndex >= currentWordGraphemes.length &&
    phase !== "deleting"

  const shouldShowCursor =
    showCursor &&
    !isComplete &&
    (hasMultipleWords || loop || currentCharIndex < currentWordGraphemes.length)

  const getCursorChar = () => {
    switch (cursorStyle) {
      case "block":
        return "▌"
      case "underscore":
        return "_"
      case "line":
      default:
        return "|"
    }
  }

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("leading-[2rem] tracking-[-0.02em]", className)}
      {...props}
    >
      {displayedText}
      {shouldShowCursor && (
        <span
          className={cn("inline-block", blinkCursor && "animate-blink-cursor")}
        >
          {getCursorChar()}
        </span>
      )}
    </MotionComponent>
  )
}