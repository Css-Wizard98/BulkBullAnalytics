import React, { useEffect, useState } from "react";
import { Empty, Loader, SidePane, StatusChip } from "../../../retro";

const BuyerHistory = ({ title, onClose, data }) => {
    const [reqData, setreqData] = useState([]);
    const [loading,setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        let tempdata = data.filter(el => el[3] === title.buyerName);
        setreqData(tempdata);
        setLoading(false);
    }, [data])
    return (
        <SidePane width={1000} title={title.buyerName} description={"Purchase History"} onClose={onClose}>
            {!!reqData.length && !loading ?
                    <div className="mt2">
                        <table style={{
                            borderCollapse: 'collapse',
                            width: "100%",
                            marginBottom: 30
                        }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "solid 1px #dddddd", padding: "5px 10px", color: "var(--sidebar-active-color)", fontSize: 14, fontWeight: 600, textAlign: "center" }}>Stock</th>
                                    <th style={{ border: "solid 1px #dddddd", padding: "5px 10px", color: "var(--sidebar-active-color)", fontSize: 14, fontWeight: 600, textAlign: "center" }}>Status</th>
                                    <th style={{ border: "solid 1px #dddddd", padding: "5px 10px", color: "var(--sidebar-active-color)", fontSize: 14, fontWeight: 600, textAlign: "center" }}>No Of Stock</th>
                                    <th style={{ border: "solid 1px #dddddd", padding: "5px 10px", color: "var(--sidebar-active-color)", fontSize: 14, fontWeight: 600, textAlign: "center" }}>PUC</th>
                                    <th style={{ border: "solid 1px #dddddd", padding: "5px 10px", color: "var(--sidebar-active-color)", fontSize: 14, fontWeight: 600, textAlign: "center" }}>Total</th>
                                    <th style={{ border: "solid 1px #dddddd", padding: "5px 10px", color: "var(--sidebar-active-color)", fontSize: 14, fontWeight: 600, textAlign: "center" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reqData.map((item, index) => {
                                        return (
                                            <tr key={item.id}>
                                                <td style={{ border: "solid 1px #dddddd", padding: "5px 10px", fontSize: 14, textAlign: "center" }}>{item[2]}</td>
                                                <td style={{ border: "solid 1px #dddddd", padding: "5px 10px", fontSize: 14, textAlign: "center" }}><StatusChip status={item[4] == "BUY" ? "success" : "failed"} /></td>
                                                <td style={{ border: "solid 1px #dddddd", padding: "5px 10px", fontSize: 14, textAlign: "center" }}>{item[5]}</td>
                                                <td style={{ border: "solid 1px #dddddd", padding: "5px 10px", fontSize: 14, textAlign: "center" }}>{item[6]}</td>
                                                <td style={{ border: "solid 1px #dddddd", padding: "5px 10px", fontSize: 14, textAlign: "center" }}>{((parseFloat(item[5].replace(/,/g, '')) * parseFloat(item[6])) / 10000000).toFixed(2)}cr</td>
                                                <td style={{ border: "solid 1px #dddddd", padding: "5px 10px", fontSize: 14, textAlign: "center" }}>{item[0]}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                : loading?<Loader/>:<Empty/>
            }
        </SidePane>
    )
}
export default BuyerHistory;