import React from "react";
import AudioAnalyzer from "./AudioAnalyzer";
import { useLocation } from "react-router-dom";

function Entries({ user, favorites, handleFavorite }) {
  const location = useLocation();
  let visualizers = [...user.visualizers].reverse();

  if (favorites) {
    visualizers = [...user?.visualizers].reverse().filter((visualizer) => {
      const found = [...user?.favorites].find(
        (favorite) => favorite.visualizer_id === visualizer.id
      );
      if (found) {
        return true;
      } else {
        return false;
      }
    });
  }

  function toggleBookmark(event, visualizer_id) {
    console.log(event.target);
    if (event.target.className === "bookmark outline icon") {
      event.target.className = "bookmark icon";
    } else {
      event.target.className = "bookmark outline icon";
    }

    handleFavorite(visualizer_id);

    if (location.pathname === "/bookmarks") {
      setTimeout(() => {
        event.target.className = "bookmark icon";
      }, 1500);
    }
  }

  function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const time =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");

    return month + "." + day + "." + year + " " + time;
  }

  const entries = visualizers.map((visualizer, index) => {
    const url = `https://twinword-word-associations-v1.p.rapidapi.com/associations/?entry=${visualizer.name}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "a8d8f40455mshaa5436a9a55a50fp15d66ejsn6ce9b545dd9a",
        "X-RapidAPI-Host": "twinword-word-associations-v1.p.rapidapi.com",
      },
    };

    async function getJSON() {
      return fetch(url, options)
        .then((resp) => resp.json())
        .then((obj) => {
          //const tags = [];
          //console.log(obj.associations_array);
          //console.log(obj.associations_scored);
          //const found = Math.max(Object.values(obj.associations_scored));
          //console.log(Object.values(obj.associations_scored));
          //tags.push(found ? found : obj.associations_array.slice(-1)[0]);
          //console.log(tags);
        });
    }

    async function caller() {
      await getJSON(); // command waits until completion
    }

    caller();

    const date = new Date(visualizer.created_at.replace(/\s/, "T") + "Z");

    return (
      <div key={index} className="card">
        <div key={index} className="content">
          <div id="canvas">
            <p>
              {visualizer.name}. <br />
              {getFormattedDate(date)}{" "}
              <i
                className={
                  [...user?.favorites].find(
                    (favorite) => favorite.visualizer_id === visualizer.id
                  )
                    ? "bookmark icon"
                    : "bookmark outline icon"
                }
                onClick={(event) => toggleBookmark(event, visualizer.id)}
              ></i>
              <br />
              {}
            </p>
            <AudioAnalyzer
              url={visualizer.song.url}
              visualizerPalette={visualizer.palette}
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div id="cards-container">
      <div id="column" className="ui three stackable cards">
        {entries}
      </div>
    </div>
  );
}

export default Entries;
