import React, { useEffect, useState } from "react";
import csvFilePath from '../../../../src/Data/BULK_DEALS_HISTORY.csv';
import CsvParser from "../../Utils/CsvParser"
import { Loader, PaginationCardTableSwitch, Seperator, KeyValue, StatusChip, Empty, Button, TOAST ,SidePane} from "../../../retro";
import moment from "moment";
import { convertToLakh, numberWithCommas } from "../../Utils/ConvertToLakh";
import toast from 'react-hot-toast';
import BuyerHistory from "./BuyerHistory";

const DataSet = ({ date, Mode, val }) => {
    const [Data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [FilteredData, setFilteredData] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [buyer,setBuyer] = useState(undefined);

    //fetch all data initially
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(csvFilePath);
                const text = await response.text();
                const result = await CsvParser(text);
                setHeaders(result[0]);
                setData(result.slice(1));
            } catch (error) {
                console.error('Error loading CSV file:', error);
            }
        };

        fetchData();
    }, [])

    //filter data on date after fetching all data or after date s changed
    useEffect(() => {
        if (date && Data) {
            let FILTERED = Data.filter(el => (moment(el[0], 'DD-MMMM-YYYY').valueOf() >= date.startDate) && (moment(el[0], 'DD-MMMM-YYYY').valueOf() <= date.endDate));
            if(val){
                FILTERED = FILTERED.filter(item => {
                    return JSON.stringify(item).toLowerCase().includes(val.toLowerCase());
                })
            }
            setFilteredData(FILTERED)
        }
    }, [Data, date, val])

    const Reset = () => {
        if (date && Data) {
            let FILTERED = Data.filter(el => (moment(el[0], 'DD-MMMM-YYYY').valueOf() >= date.startDate) && (moment(el[0], 'DD-MMMM-YYYY').valueOf() <= date.endDate));
            if(val){
                FILTERED = FILTERED.filter(item => {
                    return JSON.stringify(item).toLowerCase().includes(val.toLowerCase());
                })
            }
            setFilteredData(FILTERED)
        }
        toast.success("Data Reset")
    }

    const RemoveSettled = () => {
        let temp_data = [...FilteredData];
        let cleared_data = [];
        temp_data = temp_data.map(ele=>{
            let obj = FilteredData.find(el=> el[0]===ele[0] && el[2]===ele[2] && el[3]===ele[3] && ((el[4]=="SELL" && ele[4]==="BUY") || (ele[4]=="SELL" && el[4]==="BUY")));
            console.log(obj);
            if(!obj){
                cleared_data.push(ele);
            }
        })
        toast.success("DONE")
        console.log(cleared_data);
        setFilteredData(cleared_data);
    }

    const RemoveBuyers = () => {
        
    }

    const RemoveSell = () => {
        let FILTERED = FilteredData.filter(el=>el[4]==="BUY");
        setFilteredData(FILTERED);
        toast.success("DONE")
    }
    //filter based on data points
    // useEffect(() => {
    //     if (val) {
    //         const Filtered = [...FilteredData].filter(item => {
    //             return JSON.stringify(item).toLowerCase().includes(val.toLowerCase());
    //         })
    //         setFilteredData(Filtered);
    //     } else {
    //         setFilteredData(FilteredData);
    //     }
    // }, [val])

    if (!Data.length) {
        return (
            <><Loader /></>
        )
    } else {
        return (
            <div>
                <div className="flex" style={{gap:'5px'}}>
                    <Button className="btn-sm btn-primary" onClick={RemoveSettled}>Remove Settled</Button>
                    {/* <Button className="btn-sm btn-primary" onClick={RemoveBuyers}>Remove Buyers</Button> */}
                    <Button className="btn-sm btn-primary" onClick={RemoveSell}>Remove Sell</Button>
                    <Button className="btn-sm btn-primary" onClick={Reset}>Reset</Button>
                </div>
                <PaginationCardTableSwitch
                    mode={Mode}
                    data={FilteredData}
                    width={175}
                    mapCard={item => {
                        // let title = item.title && item.title === 'MJP Plan' ? 'MJP' : item.titl
                        return (
                            <div key={item.id} className="retro-card relative">
                                <div className="absolute right-2 top-2">
                                    <StatusChip status={item[4] == "BUY" ? "success" : "failed"} />
                                </div>
                                {/* <StatusChip linear={true} status={item.status} /> */}
                                <h3 className="mt1 mr6">
                                    {item[2]}
                                </h3>
                                <p className="text-small">
                                    {item[1]}
                                </p>
                                <Seperator margin={2} />
                                <div className="flex wrap justify-between">
                                    <div className="mb4">
                                        <KeyValue title="NOS" value={item[5]} />
                                    </div>
                                    <div className="mb4">
                                        <KeyValue title="PUC" value={item[6]} />
                                    </div>
                                    <div className="mb4">
                                        <KeyValue title="TOTAL" value={`${((parseFloat(item[5].replace(/,/g, '')) * parseFloat(item[6])) / 10000000).toFixed(2)}cr`} />
                                    </div>
                                </div>
                                <div className="mb4">
                                        <KeyValue title="buyer" value={item[3]} />
                                </div>
                                <Seperator/>
                                <div className="flex horizontally center-vertically overflow-y-hidden">
                                        {item[0]}
                                    </div>
                            
                            </div>
                        )
                    }}
                    emptyState={<Empty />}
                    loading={Loading}
                    rows={FilteredData.map(item => {
                        return [
                            {
                                weight: 2,
                                children: (
                                    <>
                                        <p onClick={() => { }} className="fw-500 pointer text-underline">
                                            {item[2]}
                                        </p>

                                        <p className='text-small'>
                                            {item[1]}
                                        </p>
                                    </>
                                )
                            },
                            {
                                weight: 1,
                                children: (<StatusChip status={item[4] == "BUY" ? "success" : "failed"} />)
                            },
                            {
                                weight: 1,
                                children: (
                                    <div onClick={()=>setBuyer({buyerName:item[3],stockId:item[1],stockName:item[2]})} className="hover-color" style={{ overflow: 'hidden',cursor:'pointer' }}>
                                        {item[3]}
                                    </div>
                                )
                            },

                            {
                                weight: 1,
                                children: (
                                    <div className="flex horizontally center-vertically overflow-y-hidden">
                                        {item[5]}
                                    </div>
                                )
                            },
                            {
                                weight: 0.5,
                                children: (
                                    <div className="flex horizontally center-vertically overflow-y-hidden">
                                        {item[6]}
                                    </div>
                                )
                            },
                            {
                                weight: 0.5,
                                children: (
                                    <div className="flex horizontally center-vertically overflow-y-hidden">
                                        {((parseFloat(item[5].replace(/,/g, '')) * parseFloat(item[6])) / 10000000).toFixed(2)}cr
                                    </div>
                                )
                            },
                            {
                                weight: 0.5,
                                children: (
                                    <div className="flex horizontally center-vertically overflow-y-hidden">
                                        {item[0]}
                                    </div>
                                )
                            },

                        ]
                    })}
                    headers={
                        [
                            'Details',
                            'Status',
                            'Buyer',
                            'No of Stock',
                            'PUC',
                            'Total',
                            'Date'
                        ].map(item => ({
                            title: item,
                            weight: item === "Details" ? 1.5 : item === "Asked by" ? 1.5 : item === 'Date' ? 1 : 1
                        }))}
                />
                {
                    buyer && <BuyerHistory data={Data} title={buyer} onClose={()=>setBuyer(undefined)}/>
                }
            </div>
        )
    }
}
export default DataSet;