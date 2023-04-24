// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

import moment from "moment";

// ** Icons Imports
import {
  MoreVertical,
  Trash2,
  Archive,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// ** Renders Client Columns
const renderClient = (row) => {
  return (
    <Avatar
      initials
      className="me-1"
      color={row.avatarColor || "light-primary"}
      content={row.name || "John Doe"}
    />
  );
};
export const columns = (toggle, nameSelected, setNameSelected) => [
  {
    name: "Họ Và Tên",
    sortable: true,
    minWidth: "300px",
    sortField: "fullName",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/apps/patient/edit/${row._id}`}
            className="user_name text-truncate text-body"
          >
            <span className="fw-bolder">{row.name}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">{row.email}</small>
        </div>
      </div>
    ),
  },
  {
    name: "N.S",
    sortable: true,
    minWidth: "100px",
    sortField: "",
    selector: (row) => row.date_of_birth,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-bolder">{moment.utc(row.date_of_birth).format('MM/DD/YY')}</span>
        </div>
      </div>
    ),
  },
  {
    name: "Địa chỉ",
    sortable: true,
    minWidth: "300px",
    sortField: "",
    selector: (row) => row.address_text,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center overflow-hidden">
        <div className="d-flex flex-column text-truncate">
          <span className="fw-bolder">{row.address_text}</span>
        </div>
      </div>
    ),
  },
  {
    name: "Điện thoại",
    sortable: true,
    minWidth: "200px",
    sortField: "",
    selector: (row) => row.phone,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.phone}</span>
        </div>
      </div>
    ),
  },
  {
    name: "Giới tính",
    sortable: true,
    minWidth: "200px",
    sortField: "",
    selector: (row) => row.gender,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <Link
            to={`/apps/user/view/${row.id}`}
            className="user_name text-truncate text-body"
          // onClick={() => store.dispatch(getUser(row.id))}
          >
            <span className="fw-bolder">{row.gender ? "Nam" : "Nữ"}</span>
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: "Thời gian tạo",
    sortable: true,
    minWidth: "200px",
    sortField: "",
    selector: (row) => row.active,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-bolder">{moment(row.created_at).format("HH:MM DD/MM/YYYY")}</span>
        </div>
      </div>
    )
  },
  {
    name: "Thời gian chỉnh sửa",
    sortable: true,
    minWidth: "200px",
    sortField: "",
    selector: (row) => row.active,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-bolder">{moment(row.updated_at).format("HH:MM DD/MM/YYYY")}</span>
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
              tag="a"
              href={`/apps/patient/edit/${row._id}`}
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
    ),
  },
];
