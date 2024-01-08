import React from 'react';
import {Headings} from "../retro"
import Pages from "./Pages"
import './Assets/styles.css'
import { BrowserRouter } from 'react-router-dom/';
const AppWrapper = () =>{
    return(
        <BrowserRouter>
            <Pages/>
        </BrowserRouter>
    )
}
export default AppWrapper