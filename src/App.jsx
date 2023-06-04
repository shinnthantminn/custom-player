import React, { useRef, useState, useEffect } from "react";
import audio from "./audio/audio.mp3";
import "./App.css";
import AudioPlayer from "react-audio-player";

const App = () => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimer, setCurrentTimer] = useState("0:00");
  const [durationTimer, setDurationTimer] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(1);

  function convertSecondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    const second =
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    console.log(second);

    return minutes + ":" + second;
  }

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://sound-api.onrender.com/api/v1/music/647a3464b9c20daa88ecf789"
    )
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setSong(res.result.song);
        setDuration(res.result.duration);
        const data = convertSecondsToMinutesAndSeconds(res.result.duration);
        setDurationTimer(data);
      });
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current.audioEl.current;

    const handleTimeUpdate = () => {
      const data = convertSecondsToMinutesAndSeconds(audioElement.currentTime);
      setCurrentTime(audioElement.currentTime);
      setCurrentTimer(data);
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isPlaying]);

  const handleSeek = (e) => {
    const audioElement = audioRef.current.audioEl.current;
    const seekTime = e.target.value;
    audioElement.currentTime = seekTime;
    const data = convertSecondsToMinutesAndSeconds(seekTime);
    setCurrentTimer(data);
    setCurrentTime(seekTime);
  };

  const togglePlay = () => {
    const audioElement = audioRef.current.audioEl.current;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    const audioElement = audioRef.current.audioEl.current;
    audioElement.currentTime += 10;
    setCurrentTime(audioElement.currentTime);
  };

  const handleSkipBackward = () => {
    const audioElement = audioRef.current.audioEl.current;
    audioElement.currentTime -= 10;
    setCurrentTime(audioElement.currentTime);
  };

  const handleLoop = () => {
    setLoop((pre) => !pre);
  };

  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
  };

  return (
    <>
      {loading ? (
        <h1>loading</h1>
      ) : (
        <div>
          <AudioPlayer
            volume={volume}
            loop={loop}
            src={song}
            autoPlay={false}
            ref={audioRef} //ထည့််လိုက်တဲ့ သီချင်ကို manipulate လုပ်ဖို့ပါ
            controls={false} //default controller တွေ ကိုဖြောက်ဖို့ပါ
          />
          <div>
            <button onClick={handleLoop}>{loop ? "loop" : "unloop"}</button>
            <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
            <button onClick={handleSkipBackward}>Skip Backward</button>
            <button onClick={handleSkipForward}>Skip Forward</button>
            <div>
              Progress: {currentTimer} / {durationTimer}
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
              />
            </div>
            <div>
              volume
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
