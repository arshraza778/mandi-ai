import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../../services/serviceRegistry';
import { useLanguage } from '../../context/LanguageContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [responseText, setResponseText] = useState<string | null>(null);
  const [suggestedAction, setSuggestedAction] = useState<{ path: string; label: string } | null>(null);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQueryText('');
      setResponseText(null);
      setSuggestedAction(null);
      setIsSpeakingAnswer(false);
      startSpeechRecognition();
    } else {
      services.voice.stopSpeaking();
      setIsListening(false);
    }
  }, [isOpen]);

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQueryText(transcript);
        setIsListening(false);
        handleProcessQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleProcessQuery = async (query: string) => {
    if (!query.trim()) return;
    const res = await services.voice.askQuestion(query);
    const answer = language === 'en' ? res.answerTextEnglish : res.answerTextHindi;
    setResponseText(answer);

    if (res.suggestedActionPath && res.suggestedActionLabel) {
      setSuggestedAction({
        path: res.suggestedActionPath,
        label: res.suggestedActionLabel,
      });
    }

    // Play speech audio
    setIsSpeakingAnswer(true);
    services.voice.speak(answer, language === 'en' ? 'en-IN' : 'hi-IN', () => {
      setIsSpeakingAnswer(false);
    });
  };

  const handleQuickQuestion = (q: string) => {
    setQueryText(q);
    handleProcessQuery(q);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-margin"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 md:p-space-xl shadow-2xl flex flex-col items-center text-center gap-space-md relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* Pulsating Mic Animation Container */}
        <div
          className="relative w-28 h-28 flex items-center justify-center my-space-xs cursor-pointer"
          onClick={() => {
            if (isListening) {
              setIsListening(false);
            } else {
              startSpeechRecognition();
            }
          }}
          title="माइक पर क्लिक करें"
        >
          {isListening && (
            <>
              <div className="absolute inset-0 bg-secondary-container/40 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-secondary-fixed/50 rounded-full animate-pulse"></div>
            </>
          )}
          <div
            className={`relative w-20 h-20 rounded-full ${
              isListening ? 'bg-secondary' : 'bg-primary'
            } flex items-center justify-center shadow-lg text-on-primary transition-colors`}
          >
            <span className="material-symbols-outlined text-[36px]">mic</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
            MandiMind Bhashini AI
          </span>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            {isListening ? 'अब बोलें...' : 'बोलकर पूछें या सवाल चुनें'}
          </h3>

          {queryText ? (
            <p className="font-title-md text-title-md font-bold text-primary mt-1 px-4 py-2 bg-surface-container-low rounded-xl">
              "{queryText}"
            </p>
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              "टमाटर के लिए सबसे अच्छी मंडी कौन सी है?"
            </p>
          )}
        </div>

        {/* AI Answer Card */}
        {responseText && (
          <div className="w-full bg-primary-fixed/20 p-space-md rounded-2xl text-left space-y-2 border border-primary-fixed">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                AI समाधान
              </span>
              {isSpeakingAnswer && (
                <button
                  onClick={() => {
                    services.voice.stopSpeaking();
                    setIsSpeakingAnswer(false);
                  }}
                  className="text-error text-[11px] font-bold flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[14px]">volume_off</span>
                  आवाज़ रोकें
                </button>
              )}
            </div>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              {responseText}
            </p>

            {suggestedAction && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate(suggestedAction.path);
                  }}
                  className="inline-flex items-center gap-1 text-primary hover:text-secondary font-label-md text-label-md font-bold hover:underline"
                >
                  <span>{suggestedAction.label}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Suggested Queries */}
        <div className="w-full space-y-2">
          <p className="font-label-sm text-label-sm text-outline">त्वरित प्रश्न विकल्प:</p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              onClick={() => handleQuickQuestion('टमाटर के लिए सबसे अच्छी मंडी कौन सी है?')}
              className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full font-label-sm text-label-sm text-on-surface transition-colors"
            >
              🍅 टमाटर की सर्वोत्तम मंडी?
            </button>
            <button
              onClick={() => handleQuickQuestion('आज प्याज का भाव क्या चल रहा है?')}
              className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full font-label-sm text-label-sm text-on-surface transition-colors"
            >
              🧅 प्याज का आज का भाव?
            </button>
            <button
              onClick={() => handleQuickQuestion('अगले 48 घंटे में रायपुर में बारिश होगी क्या?')}
              className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full font-label-sm text-label-sm text-on-surface transition-colors"
            >
              🌦️ 48 घंटे का मौसम?
            </button>
            <button
              onClick={() => handleQuickQuestion('सोलर पंप के लिए कौन सी योजना चल रही है?')}
              className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-full font-label-sm text-label-sm text-on-surface transition-colors"
            >
              ☀️ सोलर पंप सब्सिडी?
            </button>
          </div>
        </div>

        {/* Language selector pill inside voice assistant */}
        <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-1.5 rounded-full font-label-md text-label-md text-on-surface">
          <span className="material-symbols-outlined text-[18px] text-primary">translate</span>
          <span>
            भाषा: <strong>{language === 'en' ? 'English' : 'हिंदी (Hindi)'}</strong>
          </span>
        </div>

        <p className="font-body-sm text-body-sm text-outline">
          भाषिणी (Digital India Bhashini) समर्थित आवाज़ पहचान प्रणाली
        </p>
      </div>
    </div>
  );
};
