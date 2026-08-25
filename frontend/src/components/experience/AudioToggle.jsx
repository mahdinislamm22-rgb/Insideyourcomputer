import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { audio } from "../../lib/audio";

const AudioToggle = () => {
  const [on, setOn] = useState(false);
  return (
    <button
      data-testid="audio-toggle"
      onClick={() => setOn(audio.toggle())}
      className={`fixed top-5 right-5 z-[75] w-11 h-11 chamfer glass border flex items-center justify-center cursor-pointer transition-all duration-500 ${
        on ? "border-signal/60 text-signal shadow-[0_0_24px_rgba(0,240,255,0.3)]" : "border-white/10 text-slate2 hover:border-white/30"
      }`}
      aria-label={on ? "Mute ambient sound" : "Enable ambient sound"}
    >
      {on ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
};

export default AudioToggle;
