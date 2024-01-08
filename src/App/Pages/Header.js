import React from "react";
import { Headings, Seperator } from "../../retro";

const Header = () =>{
    return(
        <div >
            <Headings.Medium className="flex center pd2">BockBullAnalytics</Headings.Medium>
            <Seperator margin={1}/>
        </div>
    )
}
export default Header;