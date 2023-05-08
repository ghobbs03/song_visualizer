import React, { useEffect } from 'react';
import transition from "semantic-ui-transition";
import $ from 'jquery';
import { HiOutlineUserCircle } from "react-icons/hi"


function NavBar ({ handleLogout }) {

    useEffect(() => {
        $.fn.transition = transition

        $('#greeting_header').transition('fade');
        $('#greeting_header').css("opacity", 1)
        $('#greeting_header').transition('fade');
        $('#filler').css("visibility","hidden")

    }, [])


    return (
        <div>
            <h1 className="item center floated" id="greeting_header"> audiofeel </h1>
            <h4 id="greeting-description" className="item center floated">audio visual journal</h4>
            <div className="ui inverted menu">
                <a className="item" href="/home">Home</a>
                <a className='item' href='/entries'>Journal Entries</a>
                <a className='item' href='/bookmarks'><i className="bookmark icon" /></a>
                <a className='right item' href='/edit-profile'><HiOutlineUserCircle style={{fontSize: "medium"}}/></a>
                <a className='item' onClick={handleLogout} > Log Out </a>
            </div>
        </div>
    )
}

export default NavBar;