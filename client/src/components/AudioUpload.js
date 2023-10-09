import React from "react";
import { useState } from "react";
import transition from "semantic-ui-transition";
import $ from "jquery";
import { BsRecordCircle } from "react-icons/bs";
import { TbCircleChevronLeft } from "react-icons/tb";
import { Loader } from "semantic-ui-react";

function AudioUpload({ user, handleJournalSubmit }) {
  const [recordingState, setRecordingState] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [file, setFile] = useState("");
  const [isOneHidden, setIsOneHidden] = useState(false);
  const [entry, setEntry] = useState("");
  const [soundUrl, setSoundUrl] = useState("");

  $.fn.transition = transition;

  function toggleIsHidden() {
    if (!isOneHidden) {
      setIsOneHidden(true);

      $("#recordbutton").transition("fade down");

      if (file !== "") {
        $("#filename").css("display", "block");
      }
    }
  }

  function uploadMP3(files) {
    setRecordingState("");

    $("#filename").css("display", "block");
    setFile(files[0]);
    $("#filename").text(files[0].name);

    setSoundUrl(files[0]);
  }

  function handleRecord() {
    setFile("");
    if ($("#filebutton").css("display") !== "none") {
      $("#filebutton").transition("fade down");
      setIsOneHidden(true);
    }
    //let media;
    const recordAudio = () => {
      setIsRecording(true);
      return new Promise((resolve) => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          let mediaRecorder = new MediaRecorder(stream);
          //media = stream;
          const audioChunks = [];

          mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
          });

          const start = () => {
            mediaRecorder.start();
          };

          const stop = () => {
            return new Promise((resolve) => {
              mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
                console.log("TYPE: ", audioBlob.type);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                const play = () => {
                  audio.play();
                };

                resolve({ audioBlob, audioUrl, play });
              });

              //media = null;
              mediaRecorder.stop();
              mediaRecorder = null;
            });
          };

          resolve({ start, stop });
        });
      });
    };

    (async () => {
      const recorder = await recordAudio();
      recorder.start();

      setTimeout(async () => {
        const audio = await recorder.stop();
        setRecordingState(audio);
        setIsRecording(false);
        setSoundUrl(audio.audioUrl);
      }, 10000);
    })();
  }

  function handleBackClick() {
    $("#filename").css("display", "none");
    setRecordingState("");
    setIsOneHidden(false);
    $("#filename").css("display", "none");

    if ($("#filebutton").css("display") === "none") {
      $("#filebutton").transition("fade down");
      $("#recordedaudio").transition("fade down");
    }

    if ($("#recordbutton").css("display") === "none") {
      $("#recordbutton").transition("fade down");
    }
  }

  return (
    <div className="ui container">
      <div id="main-button-wrapper">
        <div id="recording-container">
          <div class="ui input focus">
            <input
              type="text"
              placeholder="What are you feeling?"
              id="phrase-entry"
              onInput={(event) => setEntry(event.target.value)}
            />
          </div>
          <div id="small-button-wrapper">
            <div className="audiowrapper">
              <button
                id="recordbutton"
                className="ui inverted violet basic button"
                onClick={() => {
                  handleRecord();
                }}
              >
                Record
              </button>
              {isRecording ? <BsRecordCircle id="recordingicon" /> : ""}
            </div>
            {recordingState !== "" && isOneHidden === true && (
              <audio
                id="recordedaudio"
                crossOrigin={"anonymous"}
                src={recordingState.audioUrl}
                controls
              />
            )}
            {recordingState !== "" && isOneHidden === true && (
              <button
                id="submitaudio"
                className="ui inverted violet basic button"
                onClick={() => {
                  handleJournalSubmit(entry, soundUrl);
                }}
              >
                Submit
              </button>
            )}
            <p id="empty-entry-message" hidden>
              Entry cannot be empty.
            </p>
            <br />
            {recordingState !== "" && isOneHidden === true && (
              <Loader id="loader" active inline />
            )}
            <br />
            <p id="filename"></p>
            <div className="audiowrapper">
              <input
                id="fileid"
                type="file"
                onClick={() => toggleIsHidden()}
                onChange={(event) => {
                  if (
                    event.target.files !== undefined &&
                    event.target.files.length !== 0
                  ) {
                    uploadMP3(event.target.files);
                  }
                }}
                hidden
              />
              <button
                className="ui inverted violet basic button"
                id="filebutton"
                onClick={() => {
                  document.getElementById("fileid").click();
                }}
              >
                Upload Sound
              </button>
            </div>

            {file !== "" && isOneHidden && (
              <button
                id="submitaudioupload"
                className="ui inverted violet basic button"
                onClick={() => {
                  handleJournalSubmit(entry, soundUrl);
                }}
              >
                Submit
              </button>
            )}
            <p id="empty-entry-message2" hidden>
              Entry cannot be empty.
            </p>
            {file !== "" && isOneHidden === true && (
              <Loader id="loader2" active inline />
            )}
            <div id="upload-success-message">
              <p>
                Visual palette for this entry has been generated. <br />
                View it in your entries.
              </p>
            </div>
          </div>
          {isOneHidden && (
            <TbCircleChevronLeft
              id="backbutton"
              onClick={() => handleBackClick()}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioUpload;
