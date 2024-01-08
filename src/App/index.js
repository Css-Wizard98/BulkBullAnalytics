import React from 'react';
import {Headings} from "../retro"
import Pages from "./Pages"
import './Assets/styles.css'
import { BrowserRouter } from 'react-router-dom/';
import { Toaster } from 'react-hot-toast';

const AppWrapper = () =>{
    return(
        <BrowserRouter>
            <Pages/>
            <Toaster />
        </BrowserRouter>
    )
}
export default AppWrapper