// ** Third Party Imports
import moment from "moment";

// ** Utils Imports
import { currency } from "@utils"

export const columns = () => [
    {
        name: "Họ và tên",
        minWidth: "300px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{row?.name}</span>
            </div>
        )
    },
    {
        name: "Email",
        minWidth: "300px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{row?.email}</span>
            </div>
        )
    },
    {
        name: "N.S",
        minWidth: "150px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{moment.utc(row?.date_of_birth).format('MM/DD/YY')}</span>
            </div>
        ),
    },
    {
        name: "Giới tính",
        minWidth: "100px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{row?.gender ? "Nam" : "Nữ"}</span>
            </div>
        ),
    },
    {
        name: "Di động",
        minWidth: "150px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{row?.phone}</span>
            </div>
        )
    },
    {
        name: "Tổng tiền",
        minWidth: "200px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{currency(row?.total_money)}</span>
            </div>
        )
    },
]

