"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import SpeedAdjuster from "./SpeedAdjuster";

/**
 * A button that reads the instructions aloud using speech synthesis.
 * It also listens for voice commands to stop, pause, resume, and repeat steps.
 *
 * @component
 * @example
 * // Example usage
 * <ReadInstructionsButton instructions={["Step 1: Do this", "Step 2: Do that"]} />
 */
export default function ReadInstructionsButton({ instructions }) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [resumeIndex, setResumeIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [speed, setSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);

  const scrollToInstructions = () => {
    document.getElementById("instructions-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentStep(0);
    setResumeIndex(0);
  };

  const pauseReading = useCallback(() => {
    if (isReading && !isPaused && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (!window.speechSynthesis.speaking) {
      setErrorMessage(
        "Cannot pause as no instruction is currently being read."
      );
    }
  }, [isReading, isPaused]);

  const readRemainingInstructions = useCallback(() => {
    if (resumeIndex < instructions.length) {
      let index = resumeIndex;

      const speakNextInstruction = () => {
        if (index < instructions.length && !isRepeating) {
          const utterance = new SpeechSynthesisUtterance(
            `Step ${index + 1}: ${instructions[index]}`
          );
          utterance.lang = "en-UK";
          utterance.rate = speed;

          utterance.onstart = () => {
            setCurrentStep(index + 1);
            setResumeIndex(index + 1);
          };

          utterance.onend = () => {
            index++;
            speakNextInstruction();
          };

          window.speechSynthesis.speak(utterance);
        } else {
          setIsReading(false);
        }
      };

      speakNextInstruction();
    }
  }, [resumeIndex, instructions, isRepeating, speed]);

  const repeatCurrentStep = useCallback(() => {
    if (currentStep > 0) {
      setIsRepeating(true);
      const instruction = instructions[currentStep - 1];
      const utterance = new SpeechSynthesisUtterance(
        `Repeating step ${currentStep}: ${instruction}`
      );
      utterance.lang = "en-UK";
      utterance.rate = speed;

      utterance.onend = () => {
        setIsRepeating(false);
        // Resume from the current step after repeating
        setResumeIndex(currentStep);
        readRemainingInstructions();
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      setErrorMessage("No step to repeat currently.");
    }
  }, [currentStep, instructions, speed, readRemainingInstructions]);

  const resumeReading = useCallback(() => {
    if (isReading && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsRepeating(false);
      readRemainingInstructions();
    } else if (!isPaused) {
      setErrorMessage("Cannot resume as the speech synthesis is not paused.");
    }
  }, [isReading, isPaused, readRemainingInstructions]);

  /**
   * Reads all the instructions one by one using speech synthesis.
   * Updates the current step while reading.
   */
  const readInstructions = () => {
    if (!instructions || instructions.length === 0) {
      setErrorMessage("No instructions available to read.");
      return;
    }

    if (!window.speechSynthesis) {
      setErrorMessage("Speech synthesis is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    setIsReading(true);
    setResumeIndex(0);

    let index = 0;

    const speakNextInstruction = () => {
      if (index < instructions.length) {
        const utterance = new SpeechSynthesisUtterance(
          `Step ${index + 1}: ${instructions[index]}`
        );
        utterance.lang = "en-UK";
        utterance.rate = speed;

        utterance.onstart = () => setCurrentStep(index + 1);
        utterance.onend = () => {
          index++;
          speakNextInstruction();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsReading(false);
      }
    };

    speakNextInstruction();
  };

  /**
   * Handles the click event for the button.
   * Scrolls to the instructions and starts reading them aloud.
   */
  const handleButtonClick = () => {
    scrollToInstructions();
    readInstructions();
  };

  /**
   * Effect hook to manage speech recognition.
   * Listens for voice commands like "stop", "pause", "resume", and "repeat step".
   */
  useEffect(() => {
    let recognition;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();

      recognition.lang = "en-UK";
      recognition.continuous = true;
      recognition.interimResults = false;

      const handleSpeechResult = (event) => {
        const result = Array.from(event.results)
          .filter((res) => res[0].confidence > 0.8)
          .map((res) => res[0].transcript)
          .join("")
          .toLowerCase();

        if (result.includes("stop")) {
          stopReading();
          recognition.stop();
        } else if (result.includes("pause")) {
          pauseReading();
        } else if (result.includes("resume")) {
          resumeReading();
        } else if (result.includes("repeat step")) {
          repeatCurrentStep();
        }
      };

      recognition.addEventListener("result", handleSpeechResult);
      recognition.onerror = (event) => {
        setErrorMessage("Speech to text feature failed. Please try again.");
        console.error("Speech recognition error:", event.error);
      };

      if (isReading) {
        recognition.start();
      }
    } else {
      setErrorMessage("Speech recognition is not supported in this browser.");
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isReading, pauseReading, resumeReading, repeatCurrentStep]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleButtonClick}
        className="bg-brown text-white px-6 py-3 rounded-md hover:bg-peach transition duration-200 mb-4 flex items-center gap-2"
        title="Read Instructions"
      >
        <BookOpen className="w-5 h-5" aria-label="Read Instructions" />
        <SpeedAdjuster speed={speed} setSpeed={setSpeed} />
      </button>

      {/* Error message display */}

      {errorMessage && (
        <div className="error-message text-[var(--error-text)] mt-2">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
