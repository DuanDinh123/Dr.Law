// ** Icons Imports
import {
  MoreVertical,
  Trash2,
  Archive
} from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"

// ** Mui Imports
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

// ** Constants Imports
import { permissionsVn } from "../../../../constants";

const convertPermissionsToVn = (permissions) => {
  let pmsVn = []
  permissions?.forEach((permission) => {
    permissionsVn.forEach((permissionVn) => {
      if (permission === permissionVn.eng) {
        pmsVn.push(permissionVn.vn)
      }
    })
  })
  return pmsVn
}

export const columns = (toggle, roleSelected, setRoleSelected) => [
  {
    name: "Tên",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    style: {
      height: 'auto !important'
    },
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{row.name}</span>
      </div>
    )
  },
  {
    name: "Mô tả",
    sortable: true,
    minWidth: "200px",
    sortField: "description",
    style: {
      height: 'auto !important'
    },
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{row.description}</span>
      </div>
    )
  },
  {
    name: "Permissions",
    minWidth: "25%",
    style: {
      height: 'auto !important',
    },
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center flex-wrap">
        {
          convertPermissionsToVn(row?.permissions)?.map((permission, index) => {

            if (index + 1 <= 4) {
              return <Chip className="fw-bolder" key={index} label={permission} size="small" variant="outlined" sx={{ borderRadius: '3px', margin: "4px 0", marginRight: '5px', fontFamily: `"Montserrat", Helvetica, Arial, serif` }} />
            }
          })
        }
        {convertPermissionsToVn(row?.permissions)?.length > 4 && <Tooltip title={convertPermissionsToVn(row?.permissions).map((permission) => {
          if (row?.permissions?.length > 4) {
            return permission
          }
        }).join(', ')} arrow sx={{ cursor: "pointer" }}><Chip className="fw-bolder" label={`+${row?.permissions?.length - 4}`} size="small" variant="outlined" sx={{ borderRadius: '3px', margin: "4px 0", marginRight: '5px' }} /></Tooltip>}
      </div>
    )
  },
  {
    name: "Chức năng",
    minWidth: "100px",
    style: {
      height: 'auto !important'
    },
    cell: (row) => (
      <div className="column-action">
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag="a"
              href={`/apps/role/edit/${row._id}`}
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
                setRoleSelected({
                  ...roleSelected,
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
]

