import React, { useEffect, useState } from "react";
import csvFilePath from '../../../../src/Data/BLOCK_DELAS_HISTORY.csv';
import CsvParser from "../../Utils/CsvParser"
import { Loader, PaginationCardTableSwitch, Seperator, KeyValue, StatusChip, Empty } from "../../../retro";
import moment from "moment";
import { convertToLakh, numberWithCommas } from "../../Utils/ConvertToLakh";

const DataSet = ({ date, Mode, val }) => {
    const [Data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [FilteredData, setFilteredData] = useState([]);
    const [Loading, setLoading] = useState(false);

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
            setFilteredData(FILTERED)
        }
    }, [Data, date])

    //filter based on data points
    useEffect(() => {
        if (val) {
            const Filtered = [...Data].filter(item => {
                return JSON.stringify(item).toLowerCase().includes(val.toLowerCase());
            })
            setFilteredData(Filtered);
        } else {
            setFilteredData(Data);
        }
    }, [val])

    if (!Data.length) {
        return (
            <><Loader /></>
        )
    } else {
        return (
            <div>
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
                                    <div style={{ overflow: 'hidden' }}>
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
                            weight: item === "Details" ? 2 : item === "Asked by" ? 1.5 : item === 'Date' ? 1 : 1
                        }))}
                />
            </div>
        )
    }
}
export default DataSet;