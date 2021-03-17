import React, { useState } from 'react';
import '../navbar.css';

const navItems = [
    {
        title:'Main',
        url: '#',
        cName: 'navi'
    },
    {
        title:'My Calendar',
        url: '#',
        cName: 'navi'
    },
    {
        title:'Search',
        url: '#',
        cName: 'navi'
    },
]


function navbar() {
    const [currentState, setCount] = useState(0)

     
    return(
        <div className="navbar">
            {navItems.map((item, index) => {
                return(
                    <a className={item.cName} href={item.url}></a>
                )
            })}
        </div>





    )
}