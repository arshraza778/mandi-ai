import React, { useState } from 'react';
import { services } from '../../services/serviceRegistry';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceAssistantPage: React.FC = () => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [conversation, setConversation] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'नमस्ते किसान भाई! मैं MandiMind Bhashini AI सहायक हूँ। आप मुझसे मंडी भाव, मौसम, या सरकारी योजनाओं के बारे में बोलकर पूछ सकते हैं।',
    },
  ]);

  const handleVoiceListen = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('आपके ब्राउज़र में बोलकर खोजने की सुविधा उपलब्ध नहीं है। कृपया टाइप करें।');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = language === 'en' ? 'en-IN' : 'hi-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);

      rec.onresult = async (e: any) => {
        const text = e.results[0][0].transcript;
        setTranscribedText(text);
        setIsListening(false);
        await processUserPrompt(text);
      };

      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const processUserPrompt = async (text: string) => {
    if (!text.trim()) return;

    setConversation((prev) => [...prev, { sender: 'user', text }]);
    const res = await services.voice.askQuestion(text);
    const answer = language === 'en' ? res.answerTextEnglish : res.answerTextHindi;

    setConversation((prev) => [...prev, { sender: 'ai', text: answer }]);
    services.voice.speak(answer, language === 'en' ? 'en-IN' : 'hi-IN');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
          <span className="material-symbols-outlined text-[18px]">mic</span>
          डिजिटल इंडिया भाषिणी AI वॉइस इंजन
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          किसान वॉइस असिस्टेंट (बोलकर पूछें)
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
          अपनी स्थानीय भाषा में प्रश्न पूछें और तुरंत सटीक मंडी भाव, लाभ गणना व मौसम पूर्वानुमान सुनें।
        </p>
      </div>

      {/* Mic Trigger Hero Card */}
      <div className="bg-surface-container-lowest p-space-xl rounded-3xl shadow-md border border-surface-container flex flex-col items-center text-center gap-space-md">
        <div
          onClick={handleVoiceListen}
          className="relative w-32 h-32 flex items-center justify-center cursor-pointer"
        >
          {isListening && (
            <>
              <div className="absolute inset-0 bg-secondary-container/40 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-secondary-fixed/50 rounded-full animate-pulse"></div>
            </>
          )}
          <div
            className={`w-24 h-24 rounded-full ${
              isListening ? 'bg-secondary' : 'bg-primary'
            } flex items-center justify-center text-on-primary shadow-xl transition-all hover:scale-105`}
          >
            <span className="material-symbols-outlined text-[44px]">mic</span>
          </div>
        </div>

        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {isListening ? 'हम सुन रहे हैं... कृपया बोलें' : 'माइक पर टैप करें और बोलें'}
          </h2>
          <p className="text-body-sm text-outline mt-1">
            उदाहरण: "टमाटर का भाव बताओ", "राजनांदगांव मंडी का किराया कितना है?"
          </p>
        </div>

        {/* Text Input Fallback */}
        <div className="w-full max-w-lg flex gap-2">
          <input
            type="text"
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            placeholder="या यहाँ अपना सवाल टाइप करें..."
            className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl border text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                processUserPrompt(transcribedText);
                setTranscribedText('');
              }
            }}
          />
          <button
            onClick={() => {
              processUserPrompt(transcribedText);
              setTranscribedText('');
            }}
            className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow cursor-pointer"
          >
            पूछें
          </button>
        </div>
      </div>

      {/* Chat History Panel */}
      <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm border border-surface-container space-y-4">
        <h3 className="font-title-md text-title-md font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">forum</span>
          बातचीत का इतिहास (Conversation)
        </h3>

        <div className="space-y-3">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl max-w-2xl text-body-md leading-relaxed ${
                msg.sender === 'user'
                  ? 'ml-auto bg-primary text-on-primary font-semibold'
                  : 'mr-auto bg-surface-container-low text-on-surface border border-surface-container'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] mb-1 opacity-80 uppercase font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  {msg.sender === 'user' ? 'person' : 'auto_awesome'}
                </span>
                <span>{msg.sender === 'user' ? 'आप' : 'MandiMind AI'}</span>
              </div>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
