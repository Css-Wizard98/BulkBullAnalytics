import React, { useState } from "react";
import LOGO from "../Assets/stock.png"
import {
    TOAST,
    DateRangeNew as DateRange,
    Sidebar,
    Icon
} from "../../retro";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Block from "./BlockData";
import Bulk from "./BulkData";
import { HeadingItem } from "@atlaskit/menu";

const Dashboard = () => {
    const [date, setDate] = useState();
    const ITEMS = [{
        items: [
            {
                name: "Block Deals",
                path: "/",
                type: "equals",
                icon: <Icon.Streamline icon='dashboard' size='1.2rem' className='mr1' />
            },
            {
                name: "Bulk Deals",
                path: "/bulk",
                type: "equals",
                icon: <Icon.Streamline icon='stack' size='1.2rem' className='mr1' />
            },
        ]
    }]
    return (
        <div style={{height:'100vh'}} className="flex">
            <Sidebar flexible={false} items={ITEMS} logo={LOGO} data={{ name: 'BlockBullAnalytics' }} />
            <Switch>
                <Route path="/" exact component={Block} />
                <Route path="/bulk" component={Bulk} />
            </Switch>
        </div>
    )
}
export default Dashboard;