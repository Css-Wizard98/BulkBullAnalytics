import React, { useState } from "react";
import { Navigation, Wrapper, TableViewSwitch, Button,  DateRangeNew as DateRange, } from "../../../retro";
import Filter from '../../../retro/Filter';
import moment from "moment";
import DataSet from "./DataSet";

const Block = () => {
    const [Mode, setMode] = useState('list')
    const [val, setVal] = useState(undefined);
    const [date, setDate] = useState();

    return (
        <Wrapper>
            <Navigation title={"Block Data Analytics"} />
            <div className="m2">
                <Filter margin="0 -4rem"
                    onSearch={setVal}>
                    <TableViewSwitch size="small" selected={Mode} setSelected={setMode} />
                </Filter>
            </div>
            <div className="flex mt2">
                <DateRange minDate={undefined} type={'range'} onChange={setDate} />
            </div>
            <DataSet date={date} Mode={Mode} val={val}/>
        </Wrapper>
    )
};
export default Block