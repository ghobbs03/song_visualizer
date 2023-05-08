import React, { useEffect, useState, useRef } from "react";
import { Switch, Route } from "react-router-dom";
import AudioUpload from "./AudioUpload";
import Signup from "./Signup";
import Login from './Login';
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import NavBar from "./NavBar";
import $ from 'jquery';
import Entries from "./Entries";
import { useRecoilState } from "recoil";
import { userState } from '../atoms';
import EditProfile from "./EditProfile";

function App() {
  const history = useHistory();
  const [user, setUser] = useRecoilState(userState);
  const location = useLocation();

  useEffect(() => {
    fetch("/check_session")
      .then((r) => {

        if (r.ok) {
          r.json().then((user) => {
            console.log(user)
            setUser(user)
          }
          );
        } else {
          setUser(undefined);
          if (location.pathname === '/home' || location.pathname === '/entries' || location.pathname === '/bookmarks') {
            history.push('/')
          }
        }
      })
  }, []);





  async function handleUrlType(url) {

    if (typeof url == "string" && url.startsWith("blob:")) { // is blob url
      console.log("hello");

      const cloudUploadFormData = new FormData();


      return await fetch(url).then(r => r.blob()).then((blob) => {
        cloudUploadFormData.append("file", blob);
        cloudUploadFormData.append("upload_preset", "new_preset");

        return fetch('https://api.cloudinary.com/v1_1/dz3now9tu/video/upload',
          {
            method: 'POST',
            body: cloudUploadFormData
          })
      })

    } else {
      const formData = new FormData();

      formData.append("file", url);
      formData.append("upload_preset", "new_preset");

      return fetch('https://api.cloudinary.com/v1_1/dz3now9tu/video/upload',
        {
          method: 'POST',
          body: formData
        }
      )
    }
  }


  async function handleJournalSubmit(entry, url) {
    if (entry.length > 0) {
      let audioUrl = await handleUrlType(url).then(resp => resp.json()).then(obj => obj.url)
      console.log(audioUrl)

      $("#submitaudio").css("display", "none");
      $("#submitaudioupload").css("display", "none")
      $("#loader").css("display", "inline-block");
      $("#loader2").css("display", "inline-block");

      const formData = {
        "name": entry,
        "sound": audioUrl
      }

      fetch(`/users/${user.id}/visualizers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((resp) => resp.json())
        .then((visualizerObj) => {
          setUser(visualizerObj.user);
          const color_palette_str = visualizerObj.palette.colors;
          const colors = color_palette_str.split('+');

          console.log(colors)

          $("#loader").css("display", "none");
          $("#loader2").css("display", "none");
          $('#upload-success-message').transition('fade');

          setTimeout(() => {
            $('#upload-success-message').transition('fade');
          }, 3000)

          setTimeout(() => {
            $("#submitaudio").css("display", "inline-block")
            $("#submitaudio").css("display", "inline-block");

          }, 2000)

        })

    } else {

      if (typeof url == "string" && url.startsWith("blob:")) {
        $('#empty-entry-message').transition('fade');

        setTimeout(() => {
          $('#empty-entry-message').transition('fade')

        }, 2000)

      } else {
        $('#empty-entry-message2').transition('fade')

        setTimeout(() => {
          $('#empty-entry-message2').transition('fade')
        }, 2000)
      }
    }
  }

  function handleFavorite(visualizer_id) {
    const found = user.favorites.find((favorite) => (favorite.visualizer_id === visualizer_id))
    if (found) {
      fetch(`/users/${user.id}/favorites/${found.id}`,
        {
          method: 'DELETE',
        }).then((resp) => resp.json())
        .then((userObj) => {
          setUser(userObj)
        })

    } else {
      console.log(visualizer_id)
      fetch(`/users/${user.id}/favorites`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "visualizer_id": visualizer_id })
        }).then((resp) => resp.json())
        .then((userObj) => {
          setUser(userObj)
        })

    }

  }


  function handleLogout() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(undefined)
      }
      history.push('/')
    })
  }


  return (<div>
    <Switch>
      <Route exact path='/'>
        <Login
          setUser={setUser}
        />
      </Route>
      {user !== undefined && <Route exact path='/entries'>
        <div className="ui container">
          <NavBar handleLogout={handleLogout} />
          <Entries user={user} handleFavorite={handleFavorite} />
        </div>
      </Route>}
      <Route exact path='/signup'>
        <Signup
          setUser={setUser}
        />
      </Route>
      {user !== undefined && <Route exact path='/home'>
        <div className="ui container">
          <NavBar handleLogout={handleLogout} />
          <AudioUpload user={user} handleJournalSubmit={handleJournalSubmit} />
        </div>
      </Route>}
      {user !== undefined && <Route exact path="/bookmarks">
        <div className="ui container" >
          <NavBar handleLogout={handleLogout} />
          <Entries user={user} favorites={user.favorites} handleFavorite={handleFavorite} />
        </div>
      </Route>
      }
      {user !== undefined && <Route exact path="/edit-profile">
        <div className="ui container" >
          <NavBar handleLogout={handleLogout} />
          <EditProfile user={user} setUser={setUser} />
        </div>
      </Route>}
    </Switch>
  </div>)
}

export default App;
