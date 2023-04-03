import React, { useState } from "react";
import axios from "axios";

function App() {
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState("");

  const fetchTranscript = async () => {
    try {
      const response = await axios.get(`https://ytsummary.onrender.com/transcript/${videoId}`);
      const data = response.data;
      if (data.transcript) {
        setTranscript(data.transcript);
        console.log(data.transcript);
      } else {
        setTranscript("");
        console.error("Error fetching transcript:", data.error);
      }
    } catch (error) {
      setTranscript("");
      console.error("Error fetching transcript:", error.message);
    }
  };

  return (
    <>
      <div className="App">
        <div className="container">
          <input className="input" type="text" value={videoId} onChange={(e) => setVideoId(e.target.value)} placeholder="Enter video ID" />
          <button className="button" onClick={fetchTranscript}>
            Get Transcript
          </button>
        </div>
      </div>
      <div className="text">Transcript</div>
      {transcript && <div className="output">{transcript}</div>}
    </>
  );
}

export default App;
