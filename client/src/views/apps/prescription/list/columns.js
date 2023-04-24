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

export const columns = (toggle, prescriptionSelected, setPrescriptionSelected) => [
  {
    name: "Tên mẫu",
    minWidth: "200px",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.name}</span>
        </div>
      </div>
    ),
  },
  {
    name: "Ghi chú",
    minWidth: "400px",
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center overflow-hidden">
          <div className="d-flex flex-column">
            <p className="user_name text-truncate text-body mb-0">
              <span className="fw-bolder">{row.note}</span>
            </p>
          </div>
        </div>
      )
    }
  },
  {
    name: "Trạng thái",
    minWidth: "200px",
    selector: (row) => row.actove,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.active ? "Bật" : "Tắt"}</span>
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
              href={`/apps/prescription/edit/${row._id}`}
              className="w-100"
            >
              <Archive size={14} className="me-50" />
              <span className="align-middle">Chỉnh Sửa</span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                setPrescriptionSelected({
                  ...prescriptionSelected,
                  id: row._id,
                  name: row.name
                })
                toggle()
                e.preventDefault();
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
