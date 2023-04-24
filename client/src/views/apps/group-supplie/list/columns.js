// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { store } from "@store/store"
import { getGroupSupplie } from "../store"

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
const renderClient = (row) => {
  // if (row.avatar.length) {
  //   return <Avatar className='me-1' img={row.avatar} width='32' height='32' />
  // } else {
  //   return (
  //     <Avatar
  //       initials
  //       className='me-1'
  //       color={row.avatarColor || 'light-primary'}
  //       content={row.fullName || 'John Doe'}
  //     />
  //   )
  // }
  return (
    <Avatar
      initials
      className="me-1"
      color={row.avatarColor || "light-primary"}
      content={row.name || "John Doe"}
    />
  );
};

// ** Renders Role Columns
const renderRole = (row) => {
  const roleObj = {
    subscriber: {
      class: "text-primary",
      icon: User,
    },
    maintainer: {
      class: "text-success",
      icon: Database,
    },
    editor: {
      class: "text-info",
      icon: Edit2,
    },
    author: {
      class: "text-warning",
      icon: Settings,
    },
    admin: {
      class: "text-danger",
      icon: Slack,
    },
  };

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2;

  return (
    <span className="text-truncate text-capitalize align-middle">
      <Icon
        size={18}
        className={`${roleObj[row.role] ? roleObj[row.role].class : ""} me-50`}
      />
      {row.role}
    </span>
  );
};

const statusObj = {
  pending: "light-warning",
  active: "light-success",
  inactive: "light-secondary",
};

export const columns = (toggle, nameSelected, setNameSelected) => [
  {
    name: "Tên nhóm",
    sortable: true,
    minWidth: "200px",
    sortField: "fullName",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.name}</span>
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Ghi chú",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row.note,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center ">
        <div className="d-flex flex-column text-truncate">
          <p className="user_name text-truncate w-75 text-body mb-0">
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
              to={`/apps/group-supplie/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getGroupSupplie(row._id))}
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
