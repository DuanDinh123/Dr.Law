// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components

// ** Store & Actions
import { store } from "@store/store"
import { getSupplie } from "../store"
import { currency } from "../../currencyPrice"

// ** Icons Imports
import {
  MoreVertical,
  Trash2,
  Archive,
  AlertTriangle,
} from "react-feather";
// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap";

export const columns = (toggle, nameSelected, setNameSelected) => [
  {
    name: "Tên vật tư",
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
          <small className="text-truncate text-muted mb-0">{row.sku}</small>
        </div>
      </div>
    )
  },
  {
    name: "Giá",
    sortable: true,
    minWidth: "50px",
    sortField: "",
    selector: (row) => row.price,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{currency(row.price)}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "Tiêu hao",
    sortable: true,
    minWidth: "50px",
    sortField: "",
    selector: (row) => row.price_attrition,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{currency(row.price_attrition)}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "Số lượng",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row.quantity,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-row">
          <p className="user_name text-truncate text-body mb-0 lh-1 me-1">
            <span className="fw-bolder">{row.quantity}</span>
          </p>
          {row.quantity <= 10 ? <AlertTriangle
            color="red"
            size={13}
            style={{ top: '10px', right: '10px' }}
          /> : null}
        </div>
      </div>
    )
  },
  {
    name: "ĐVT",
    sortable: true,
    minWidth: "50px",
    sortField: "",
    selector: (row) => row.unit,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.unit}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "Nhóm",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row?.group_supplie,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row?.group_supplie?.name}</span>
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
              to={`/apps/supplie/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getSupplie(row._id))}
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
