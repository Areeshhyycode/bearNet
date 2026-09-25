"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Link2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

/**
 * Cozy ambience player.
 *
 * The default track is synthesised in the browser with the Web Audio API —
 * a soft chord pad plus filtered noise for rain — so no audio file has to be
 * shipped or licensed. A custom stream URL can be used instead.
 */

type Nodes = {
  context: AudioContext;
  master: GainNode;
  stop: () => void;
};

function buildAmbience(context: AudioContext, master: GainNode): () => void {
  const now = context.currentTime;

  // --- soft chord pad (A minor 9, detuned for warmth) ---
  const pad = context.createGain();
  pad.gain.value = 0.16;
  pad.connect(master);

  const padFilter = context.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 760;
  padFilter.Q.value = 0.6;
  padFilter.connect(pad);

  const voices: OscillatorNode[] = [];
  for (const freq of [220, 261.63, 329.63, 493.88]) {
    for (const detune of [-6, 6]) {
      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;

      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.22;
      osc.connect(voiceGain).connect(padFilter);

      osc.start(now);
      voices.push(osc);
    }
  }

  // Slow filter sweep so the pad breathes instead of droning.
  const lfo = context.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.05;
  const lfoDepth = context.createGain();
  lfoDepth.gain.value = 240;
  lfo.connect(lfoDepth).connect(padFilter.frequency);
  lfo.start(now);

  // --- rain: looping noise buffer through a bandpass ---
  const seconds = 4;
  const buffer = context.createBuffer(
    1,
    context.sampleRate * seconds,
    context.sampleRate,
  );
  const channel = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < channel.length; i++) {
    // Brown-ish noise is gentler than white noise.
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    channel[i] = last * 3.2;
  }

  const rain = context.createBufferSource();
  rain.buffer = buffer;
  rain.loop = true;

  const rainFilter = context.createBiquadFilter();
  rainFilter.type = "bandpass";
  rainFilter.frequency.value = 1100;
  rainFilter.Q.value = 0.4;

  const rainGain = context.createGain();
  rainGain.gain.value = 0.1;

  rain.connect(rainFilter).connect(rainGain).connect(master);
  rain.start(now);

  return () => {
    for (const voice of voices) voice.stop();
    lfo.stop();
    rain.stop();
  };
}

export function LofiPlayer() {
  const { preferences, updatePreferences } = useProgress();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(preferences.timer.volume);
  const [streamUrl, setStreamUrl] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nodesRef = useRef<Nodes | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setVolume(preferences.timer.volume);
  }, [preferences.timer.volume]);

  // Tear everything down when the component goes away.
  useEffect(
    () => () => {
      nodesRef.current?.stop();
      void nodesRef.current?.context.close();
      audioRef.current?.pause();
    },
    [],
  );

  const stopAll = useCallback(() => {
    nodesRef.current?.stop();
    void nodesRef.current?.context.close();
    nodesRef.current = null;
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);

    // A custom URL wins if one is set.
    if (streamUrl.trim()) {
      try {
        const audio = audioRef.current ?? new Audio();
        audio.crossOrigin = "anonymous";
        audio.loop = true;
        audio.src = streamUrl.trim();
        audio.volume = volume;
        audioRef.current = audio;
        await audio.play();
        setPlaying(true);
      } catch {
        setError("That stream would not play. Check the URL.");
      }
      return;
    }

    try {
      // Created on a click, which is what browsers require.
      const context = new AudioContext();
      const master = context.createGain();
      master.gain.value = volume * 0.6;
      master.connect(context.destination);

      const stop = buildAmbience(context, master);
      nodesRef.current = { context, master, stop };
      setPlaying(true);
    } catch {
      setError("Audio is not available in this browser.");
    }
  }, [streamUrl, volume]);

  function changeVolume(next: number) {
    setVolume(next);
    if (nodesRef.current) nodesRef.current.master.gain.value = next * 0.6;
    if (audioRef.current) audioRef.current.volume = next;
    updatePreferences({ timer: { ...preferences.timer, volume: next } });
  }

  return (
    <div className="flex flex-col gap-space-sm rounded-[22px] bg-surface-container-lowest p-space-md shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
          <Headphones className="h-3.5 w-3.5 text-tertiary" /> Lo-fi radio
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 font-body-sm text-body-sm",
            playing ? "text-tertiary" : "text-on-surface-variant",
          )}
        >
          {playing && (
            <span className="flex items-end gap-0.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-0.5 animate-typing-dot rounded-full bg-tertiary"
                  style={{ height: 8 + i * 3, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
          {playing ? "Playing" : "Paused"}
        </span>
      </div>

      <div className="flex items-center gap-space-md">
        <button
          type="button"
          onClick={() => (playing ? stopAll() : void start())}
          aria-label={playing ? "Pause ambience" : "Play ambience"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm transition-all hover:bg-primary-fixed-dim active:scale-95"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-body-md text-body-md font-semibold text-on-surface">
            {streamUrl.trim() ? "Custom stream" : "🌧️ Cozy rain & pad"}
          </p>
          <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
            {streamUrl.trim()
              ? "Your own station"
              : "Generated in your browser — no ads, no buffering"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => changeVolume(volume > 0 ? 0 : 0.5)}
          aria-label={volume > 0 ? "Mute" : "Unmute"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => changeVolume(Number(event.target.value))}
        aria-label="Volume"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-container accent-primary"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex items-center gap-1 font-label-badge text-label-badge text-on-surface-variant transition-colors hover:text-primary"
        >
          <Link2 className="h-3 w-3" /> {showUrl ? "Hide" : "Use my own stream"}
        </button>
      </div>

      {showUrl && (
        <input
          value={streamUrl}
          onChange={(event) => setStreamUrl(event.target.value)}
          placeholder="https://… a direct audio stream URL"
          className="w-full rounded-full bg-surface-container-low px-4 py-2 font-body-sm text-body-sm text-on-surface outline-none ring-1 ring-inset ring-transparent focus:ring-primary-container"
        />
      )}

      {error && (
        <p className="font-body-sm text-body-sm text-error">🥺 {error}</p>
      )}
    </div>
  );
}
