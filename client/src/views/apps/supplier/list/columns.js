// ** React Imports
import { Link } from "react-router-dom"

// ** Store & Actions
import { store } from "@store/store"
import { getSupplier, deleteSupplier } from "../store"

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

export const columns = (toggle, nameSelected, setNameSelected) => [
  {
    name: "Tên nhà cung cấp",
    sortable: true,
    minWidth: "230px",
    sortField: "fullName",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center overflow-hidden">
        <div className="d-flex flex-column overflow-hidden">
          <p className="user_name text-truncate text-body mb-0 text-break">
            <span className="fw-bolder">{row.name}</span>
          </p>
          <small className="text-truncate text-muted mb-0">{row.email}</small>
        </div>
      </div>
    )
  },
  {
    name: "Địa chỉ",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row.address,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p
            className="user_name text-truncate text-body mb-0"
          >
            <span className="fw-bolder">{row.address}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "Điện thoại",
    sortable: true,
    minWidth: "50px",
    sortField: "",
    selector: (row) => row.phone,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.phone}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "ghi chú",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row.note,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.note}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "Trạng thái",
    sortable: true,
    minWidth: "70px",
    sortField: "",
    selector: (row) => row.active,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.active ? "Bật" : "Tắt"}</span>
          </p>
        </div>
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
              to={`/apps/supplier/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getSupplier(row._id))}
            >
              <Archive size={14} className="me-50" />
              <span className="align-middle">Chỉnh sửa</span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                setNameSelected({
                  ...nameSelected,
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
