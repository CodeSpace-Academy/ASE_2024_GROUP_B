"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import SpeedAdjuster from "./SpeedAdjuster";

/**
 * A button that reads the instructions aloud using speech synthesis.
 * It also listens for voice commands to stop, pause, and resume the speech synthesis.
 *
 * @component
 * @example
 * // Example usage
 * <ReadInstructionsButton instructions={["Step 1: Do this", "Step 2: Do that"]} />
 */
export default function ReadInstructionsButton({ instructions }) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [speed, setSpeed] = useState(1); // State for speech speed

  /**
   * Scrolls to the instructions section in the document.
   */
  const scrollToInstructions = () => {
    document.getElementById("instructions-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  /**
   * Stops reading instructions and cancels speech synthesis.
   */
  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  /**
   * Pauses reading instructions.
   */
  const pauseReading = useCallback(() => {
    if (isReading && !isPaused) {
      console.log("Pausing reading...");
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isReading, isPaused]);

  /**
   * Resumes reading instructions if paused.
   */
  const resumeReading = useCallback(() => {
    if (isReading && isPaused) {
      console.log("Resuming reading...");
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isReading, isPaused]);

  /**
   * Reads the instructions aloud step by step using speech synthesis.
   * If no instructions are provided, an alert will be shown.
   * If speech synthesis is not supported, an alert will be shown.
   */
  const readInstructions = () => {
    if (!instructions || instructions.length === 0) {
      alert("No instructions available to read.");
      return;
    }

    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsReading(true);

    // Create speech utterances for each instruction
    instructions.forEach((instruction, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Step ${index + 1}: ${instruction}`
      );
      utterance.lang = "en-UK";
      utterance.rate = speed; // Use the speed from state
      window.speechSynthesis.speak(utterance);
    });
  };

  /**
   * Handles the button click to start reading instructions and scroll to instructions.
   */
  const handleButtonClick = () => {
    scrollToInstructions();
    readInstructions();
  };

  /**
   * Initializes speech recognition to listen for commands ("stop", "pause", "resume").
   * Sets up error handling if speech recognition fails.
   */
  useEffect(() => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-UK";
    recognition.continuous = true;
    recognition.interimResults = false;

    /**
     * Handles the speech recognition result when speech is detected.
     * Stops, pauses, or resumes reading instructions based on the recognized command.
     *
     * @param {SpeechRecognitionResult} event - The speech recognition event containing the transcript.
     */
    const handleSpeechResult = (event) => {
      const result = Array.from(event.results)
        .filter((res) => res[0].confidence > 0.8)
        .map((res) => res[0].transcript)
        .join("")
        .toLowerCase();

      console.log("Speech recognized:", result); // Log recognized speech

      if (result.includes("stop")) {
        console.log("Stop command detected.");
        stopReading();
        recognition.stop();
      } else if (result.includes("pause")) {
        console.log("Pause command detected.");
        pauseReading();
      } else if (result.includes("resume")) {
        console.log("Resume command detected.");
        resumeReading();
      }
    };

    /**
     * Error handler for speech recognition. If an error occurs, an error message is displayed.
     */
    recognition.onerror = (event) => {
      setErrorMessage("Speech to text feature failed. Please try again.");
      console.error("Speech recognition error:", event.error);
    };

    if (isReading) {
      console.log("Starting speech recognition...");
      recognition.addEventListener("result", handleSpeechResult);
      recognition.start();
    }

    return () => {
      recognition.removeEventListener("result", handleSpeechResult);
      recognition.stop();
    };
  }, [isReading, pauseReading, resumeReading]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => {
          handleButtonClick();
          scrollToInstructions();
        }}
        className="bg-[var(--button-bg)] text-[var(--button-text)] px-6 py-3 rounded-md hover:bg-[var(--button-hover)] transition duration-200 mb-4 flex items-center gap-2"
        title="Read Instructions"
        
      >
        <BookOpen className="w-5 h-5" aria-label="Read Instructions" />
        <SpeedAdjuster speed={speed} setSpeed={setSpeed} />
      </button>
  
      {errorMessage && (
        <div className="error-message text-[var(--error-text)] mt-2">
          {errorMessage}
        </div>
      )}
    </div>
  );  
}
