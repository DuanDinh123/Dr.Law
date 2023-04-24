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
  
  export const column = (toggle, prescriptionSelected, setPrescriptionSelected) => [
    {
      name: "Tên mẫu",
      minWidth: "200px",
      selector: (row) => row.id.name,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <span className="fw-bolder">{row.id.name}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Ghi chú",
      minWidth: "400px",
      selector: (row) => row.id.note,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <span className="fw-bolder">{row.id.note}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Nội dung đơn thuốc",
      minWidth: "200px",
      selector: (row) => row.id.prescription_content,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <span className="fw-bolder">{row.id.prescription_content}</span>
          </div>
        </div>
      )
    },
  ];
  