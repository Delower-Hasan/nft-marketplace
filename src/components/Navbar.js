import React from 'react'
import './App.css';
export default function Navbar() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        Home
                    </li>
                    <li className='acName'>Account Name: </li>
                </ul>
            </nav>
        </div>
    )
}
