import React from "react";
import NavBar from "./NavBar";
import { Canvas } from '@react-three/fiber';
import Visualizer from "./Visualizer";
import AudioAnalyzer from "./AudioAnalyzer";
import { useState } from "react";


function Entries({ user, favorites, handleFavorite }) {
    
    let visualizers = [...user.visualizers].reverse();

    if (favorites) {
        visualizers = [...user?.visualizers].reverse().filter((visualizer) => {
            const found = [...user?.favorites].find((favorite) => favorite.visualizer_id === visualizer.id) 
            if (found) {
                return true
            } else {
                return false
            }
        })

    }

    function toggleBookmark(event, visualizer_id) {
        if (event.target.className === "bookmark outline icon") {
            event.target.className = "bookmark icon";

        } else {
            event.target.className = "bookmark outline icon"
        }

        handleFavorite(visualizer_id);
    }


    function getFormattedDate(date) {
        const year = date.getFullYear();
        const month = (1 + date.getMonth()).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const time = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')

        return month + '.' + day + '.' + year + ' ' + time;
    }

    const entries = visualizers.map((visualizer, index) => {
        const date = new Date(visualizer.created_at)

        return (<div key={index} className="card">
            <div key={index} className="content">
                <div id="canvas">
                    <p>{visualizer.name}. <br />{getFormattedDate(date)} <i className={[...user?.favorites].find((favorite) => favorite.visualizer_id  === visualizer.id) ? "bookmark icon" : "bookmark outline icon" } onClick={(event) => toggleBookmark(event, visualizer.id)}></i></p>
                    <AudioAnalyzer url={visualizer.song.url} visualizerPalette={visualizer.palette} />
                </div>

            </div>


        </div>)
    })


    return (
            <div id="cards-container">
                <div id="column" className="ui three stackable cards">
                    {entries}
                </div>
            </div>
        )
}

export default Entries;