"use client"; // Ensure this component runs on the client side

import { useEffect, useState, useCallback } from "react";

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
  const [isReading, setIsReading] = useState(false); // State to manage reading status
  const [isPaused, setIsPaused] = useState(false); // State to manage pause status
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

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
    console.log("Stopping reading...");
    window.speechSynthesis.cancel(); // Stops speech synthesis immediately
    setIsReading(false); // Update the state to indicate reading has stopped
    setIsPaused(false); // Reset pause state
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
    setIsReading(true); // Set reading state to true when reading starts

    // Create speech utterances for each instruction
    instructions.forEach((instruction, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Step ${index + 1}: ${instruction}`
      );
      utterance.lang = "en-UK";
      utterance.rate = 1;
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
    recognition.continuous = true; // Listen continuously
    recognition.interimResults = false;

    /**
     * Handles the speech recognition result when speech is detected.
     * Stops, pauses, or resumes reading instructions based on the recognized command.
     *
     * @param {SpeechRecognitionResult} event - The speech recognition event containing the transcript.
     */
    const handleSpeechResult = (event) => {
      const result = Array.from(event.results)
        .filter((res) => res[0].confidence > 0.8) // Only process results with high confidence
        .map((res) => res[0].transcript)
        .join("")
        .toLowerCase();

      console.log("Speech recognized:", result); // Log recognized speech

      if (result.includes("stop")) {
        console.log("Stop command detected.");
        stopReading();
        recognition.stop(); // Stop listening for commands
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
    <div>
      <button
        onClick={handleButtonClick}
        className="bg-brown text-white px-4 py-2 rounded-md hover:bg-peach transition duration-200"
      >
        Read Instructions
      </button>

      {errorMessage && (
        <div className="error-message text-red-500 mt-2">{errorMessage}</div>
      )}
    </div>
  );
}
