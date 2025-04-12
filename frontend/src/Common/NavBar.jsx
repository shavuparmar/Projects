import React from 'react'
import "./NavBar.css"
import { Link } from 'react-router-dom'
import Logos from "../Icon/Logo.png"
import HomePic from "../Icon/home.png"
import Searchpic from "../Icon/Searchpic.png"
import Uploadpic from "../Icon/Searchpic.png"
import Notificationpic from "../Icon/notification.png"
import Messagepic from "../Icon/Messgegepic.png"
import Profilepic from "../Icon/user.png"







export default function NavBar() {
  return (
   <div className="mainContain">
    <div className="Navigation">
        <div className="Desk-View">
            <div className="DeskNav">
                <div className="Logos">
                    <img src={Logos} alt="" />
                </div>
                <div className="Links-Nav">
                    <nav>
                        <ul>
                     <li>  <Link to={"/"}>   <img src={HomePic} alt="" /> Home </Link></li>
                     <li>  <Link>  <img src={Searchpic} alt="" /> Search </Link></li>
                     <li>  <Link>  <img src={Messagepic} alt="" /> Message </Link></li>
                     <li>  <Link>  <img src={Notificationpic} alt="" /> Notification</Link></li>
                     <li>  <Link to={"/Upload"}>  <img src={Uploadpic} alt="" /> Upload </Link></li>
                     <li>  <Link to={"/profile"}>  <img src={Profilepic} alt="" /> Profile </Link></li>
                      
                     
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
   </div>
  )
}
