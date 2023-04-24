// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { store } from "@store/store"
import { getTip } from "../store"
import { currency } from "../../currencyPrice"

// ** Icons Imports
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive
} from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Input
} from "reactstrap";

// ** Renders Client Columns

export const columns = (toggle, nameSelected, setNameSelected) => [
  {
    name: "Tên thủ thuật",
    sortable: true,
    minWidth: "230px",
    sortField: "fullName",
    selector: (row) => row.name_tip,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center overflow-hidden">
        <div className="d-flex flex-column overflow-hidden">
          <p className="user_name text-truncate text-body mb-0 text-break">
            <span className="fw-bolder">{row.name_tip}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "Triệu chứng",
    sortable: true,
    minWidth: "50px",
    sortField: "",
    selector: (row) => row.symptom,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.symptom}</span>
          </p>
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
    name: "Giảm giá",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row.discount,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.discount ? currency(row.discount) : 0}</span>
          </p>
        </div>
      </div>
    )
  },
  {
    name: "Vị trí",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row.position,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.position}</span>
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
    selector: (row) => row?.category_tip,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row?.category_tip?.name}</span>
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
              to={`/apps/tip/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getTip(row._id))}
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
                  name: row.name_tip
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
