import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Radio,
  Globe,
} from 'lucide-react';
import { TelemetryFrame, SubsystemDetail } from '../types/mission';
import { Language, SUPPORTED_LANGUAGES, TranslationDictionary } from '../services/i18n';

interface AIAssistantModalProps {
  currentFrame: TelemetryFrame;
  subsystems: SubsystemDetail[];
  onClose: () => void;
  audioAnnounceEnabled: boolean;
  onToggleAudioAnnounce: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationDictionary;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  currentFrame,
  subsystems,
  onClose,
  audioAnnounceEnabled,
  onToggleAudioAnnounce,
  language,
  onLanguageChange,
  t,
}) => {
  const getInitialGreeting = (lang: Language) => {
    switch (lang) {
      case 'fr':
        return `IA de vol ASTRA-TWIN opérationnelle. Indice de santé du satellite : ${currentFrame.healthScore}%. Je surveille les 10 sous-systèmes spatiaux en temps réel. Posez-moi vos questions sur la batterie, la dynamique thermique ou les procédures de sauvegarde.`;
      case 'hi':
        return `एस्ट्रा-ट्विन फ़्लाइट एआई सक्रिय है। वर्तमान मिशन स्वास्थ्य ${currentFrame.healthScore}% है। मैं सभी 10 अंतरिक्ष यान उपप्रणालियों की वास्तविक समय में निगरानी कर रहा हूँ। बैटरी, थर्मल या निवारक प्रोटोकॉल के बारे में पूछें।`;
      case 'de':
        return `ASTRA-TWIN Flug-KI aktiv. Aktuelle Systemgesundheit: ${currentFrame.healthScore}%. Ich überwache alle 10 Raumfahrzeug-Subsysteme in Echtzeit. Fragen Sie mich zur Batteriestabilität, Thermodynamik oder Fehlerprotokollen.`;
      default:
        return `ASTRA-TWIN Flight AI active. Current mission health is ${currentFrame.healthScore}%. I am monitoring all 10 spacecraft subsystems in real time. Ask me about battery stability, thermal dynamics, or mitigation protocols.`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: getInitialGreeting(language),
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getPresetChips = (lang: Language) => {
    switch (lang) {
      case 'fr':
        return [
          'Pourquoi la tension de la batterie chute-t-elle ?',
          'Que se passe-t-il si la température dépasse 85°C ?',
          'Recommander une procédure de délestage d\'urgence',
          'Expliquer l\'architecture du jumeau numérique',
        ];
      case 'hi':
        return [
          'बैटरी वोल्टेज में गिरावट क्यों हो रही है?',
          'यदि तापमान 85°C तक पहुँच जाए तो क्या होगा?',
          'तत्काल पावर-शेडिंग प्रक्रिया की सिफारिश करें',
          'डिजिटल ट्विन आर्किटेक्चर समझाएं',
        ];
      case 'de':
        return [
          'Warum fällt die Batteriespannung ab?',
          'Was geschieht, wenn die Temperatur 85°C erreicht?',
          'Sofortige Lastabwurf-Prozedur empfehlen',
          'Digitalen Zwilling und Architektur erklären',
        ];
      default:
        return [
          'Why is battery voltage dropping?',
          'What happens if temperature reaches 85°C?',
          'Recommend immediate power-shedding procedure',
          'Explain the digital twin architecture',
        ];
    }
  };

  const presetChips = getPresetChips(language);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    if (!audioAnnounceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 180));
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          telemetryContext: {
            currentFrame,
            activeAnomalies: subsystems.filter((s) => s.status !== 'NOMINAL'),
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Server response error');
      }

      const data = await res.json();
      const aiReply = data.reply || 'Mission Control received query. All subsystems monitored.';

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(aiReply);
    } catch (err) {
      const fallbackReply =
        language === 'fr'
          ? `Analyse de télémétrie : La tension est actuellement de ${currentFrame.voltage}V avec une température de ${currentFrame.temperature}°C. Procédure recommandée : Délester les instruments secondaires.`
          : language === 'hi'
          ? `टेलीमेट्री विश्लेषण: वर्तमान वोल्टेज ${currentFrame.voltage}V और तापमान ${currentFrame.temperature}°C है। अनुशंसित प्रक्रिया: गैर-आवश्यक उपकरणों को बंद करें।`
          : language === 'de'
          ? `Telemetrieanalyse: Aktuelle Spannung ${currentFrame.voltage}V bei einer Temperatur von ${currentFrame.temperature}°C. Empfehlung: Sekundäre Nutzlasten abschalten.`
          : `Telemetry Analysis: Voltage is currently ${currentFrame.voltage}V with temperature at ${currentFrame.temperature}°C. Recommended procedure: Shed non-essential instrument loads and adjust orbital beta angle.`;

      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackReply);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl h-[620px] rounded-2xl border border-slate-800 bg-[#090d16] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-display text-slate-100">
                  {t.aiCopilot}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  GEMINI 3.8
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Ground Telemetry: {currentFrame.voltage}V · {currentFrame.temperature}°C · {currentFrame.healthScore}% {t.health}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Switcher Inside Modal */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-md p-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-1.5 py-1 text-[11px] font-mono rounded transition-colors ${
                    language === lang.code
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={lang.name}
                >
                  {lang.flag}
                </button>
              ))}
            </div>
            <button
              onClick={onToggleAudioAnnounce}
              title={audioAnnounceEnabled ? 'Voice Active' : 'Voice Muted'}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100"
            >
              {audioAnnounceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  m.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-purple-900/60 border border-purple-500/40 text-purple-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-xl border leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-100'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className="text-[10px] font-mono text-slate-500 text-right mt-1.5">
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>AI Copilot querying digital twin flight telemetry...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Chips */}
        <div className="px-5 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-400 shrink-0">QUICK:</span>
          {presetChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask ASTRA-TWIN AI about spacecraft telemetry or failure predictions..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
