import { useState, useEffect, useRef, useCallback } from 'react';

// The browser's SpeechRecognition API is vendor-prefixed in some browsers
// FIX: Cast window to `any` to avoid errors for non-standard browser APIs.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Check for browser support
const isSpeechRecognitionSupported = !!SpeechRecognition;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  // FIX: Use `any` for the recognition ref type as SpeechRecognition types are not standard.
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // FIX: Use `any` for the event type as SpeechRecognitionEvent is not a standard type.
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };

    // FIX: Use `any` for the event type as SpeechRecognitionErrorEvent is not a standard type.
    recognition.onerror = (event: any) => {
        let errorMessage = event.error;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            errorMessage = "Microphone access denied. Please allow microphone access in your browser settings.";
        }
        setError(`Speech recognition error: ${errorMessage}`);
        setIsListening(false);
    };

    recognition.onend = () => {
      if (recognitionRef.current) {
        setIsListening(false);
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!isSpeechRecognitionSupported || !recognitionRef.current) return;
    
    const currentlyListening = isListening;
    
    if (currentlyListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setError("Could not start speech recognition. Please try again.");
        setIsListening(false);
      }
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    error,
    toggleListening,
    isSpeechRecognitionSupported,
  };
};
