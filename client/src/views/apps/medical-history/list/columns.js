// ** React Imports
import { Link } from "react-router-dom"

// ** Icons Imports
import {
    MoreVertical,
    Trash2,
    Archive
} from "react-feather";

// ** Reactstrap Imports
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

export const columns = (toggle, medicalHistorySelected, setMedicalHistorySelected) => [
    {
        name: "Tên tiểu sử",
        minWidth: "200px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{row?.name}</span>
            </div>
        ),
    },
    {
        name: "Mô tả",
        minWidth: "200px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{row?.description}</span>
            </div>
        )
    },
    {
        name: "Trạng thái",
        minWidth: "70px",
        cell: (row) => (
            <div className="d-flex justify-content-left align-items-center">
                <span className="fw-bolder">{row?.active ? "Bật" : "Tắt"}</span>
            </div>
        )
    },
    {
        name: "Chức năng",
        minWidth: "100px",
        cell: (row) => (
            <div className="column-action">
                <UncontrolledDropdown>
                    <DropdownToggle tag="div" className="btn btn-sm">
                        <MoreVertical size={14} className="cursor-pointer" />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            tag={Link}
                            to={`/apps/medical-history/edit/${row._id}`}
                            className="w-100"
                        >
                            <Archive size={14} className="me-50" />
                            <span className="align-middle">Chỉnh sửa</span>
                        </DropdownItem>
                        <DropdownItem
                            tag="a"
                            href="/"
                            className="w-100"
                            onClick={(e) => {
                                setMedicalHistorySelected({
                                    ...medicalHistorySelected,
                                    id: row._id,
                                    name: row.name
                                })
                                toggle()
                                e.preventDefault()
                            }}
                        >
                            <Trash2 size={14} className="me-50" />
                            <span className="align-middle">Xóa</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        )
    }
];
