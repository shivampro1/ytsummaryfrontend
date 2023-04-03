import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots as Loader } from "react-loader-spinner";

function App() {
  const [videoURL, setVideoURL] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingText, setFetchingText] = useState("Fetching");
  const [speechStatus, setSpeechStatus] = useState("stopped"); // New state for managing speech status

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setFetchingText((prevText) => (prevText === "Fetching..." ? "Fetching" : `${prevText}.`));
      }, 500);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  const extractVideoId = (url) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.searchParams.get("v");
    } catch (error) {
      console.error("Invalid URL provided:", error.message);
      return "";
    }
  };

  const fetchSummary = async () => {
    const videoId = extractVideoId(videoURL);

    if (!videoId) {
      console.error("Invalid video URL provided");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`https://ytback.onrender.com/transcript/${videoId}`);
      const data = response.data;
      if (data.summary) {
        setSummary(data.summary.content);
      } else {
        setSummary("");
        console.error("Error fetching summary:", data.error);
      }
    } catch (error) {
      setSummary("");
      console.error("Error fetching summary:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const readSummary = () => {
    const synth = window.speechSynthesis;

    if (speechStatus === "stopped") {
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.rate = 2;
      utterance.onend = () => {
        setSpeechStatus("stopped");
      };
      synth.speak(utterance);
      setSpeechStatus("playing");
    } else if (speechStatus === "playing") {
      synth.pause();
      setSpeechStatus("paused");
    } else if (speechStatus === "paused") {
      synth.resume();
      setSpeechStatus("playing");
    }
  };

  return (
    <>
      <div className="App">
        <div className="container">
          <input className="input" type="text" value={videoURL} onChange={(e) => setVideoURL(e.target.value)} placeholder="Enter video URL" />
          <button className="button" onClick={fetchSummary}>
            Get Summary
          </button>
        </div>
      </div>
      <div className="text">Summary</div>
      {isLoading ? (
        <div className="loader-container">
          <span>{fetchingText}</span>
          <Loader color="#00BFFF" height={80} width={80} />
        </div>
      ) : (
        summary && (
          <>
            <div className="output">
              {summary.split("\n").map((point, index) => (
                <p key={index}>{point}</p>
              ))}
            </div>
            <div className="middle">
              <button className="button read-summary" onClick={readSummary}>
                {speechStatus === "stopped" && "Read Summary"}
                {speechStatus === "playing" && "Pause"}
                {speechStatus === "paused" && "Resume"}
              </button>
            </div>
          </>
        )
      )}
    </>
  );
}

export default App;
