// ** React Imports
import { Link } from "react-router-dom"

import Avatar from "@components/avatar"

// ** Reactstrap Imports
import { currency } from "@utils"
const renderClient = (row) => {
  return (
    <Avatar
      initials
      className="me-1"
      color={row.avatarColor || "light-primary"}
      content={row.user.name || "John Doe"}
    />
  );
};

export const columns = () => [
  {
    name: "Tên Nhân viên",
    sortable: true,
    minWidth: "200px",
    sortField: "fullName",
    selector: (row) => row.user.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            // to={`/apps/patient/edit/${row._id}`}
            className="user_name text-truncate text-body"
          // onClick={() => store.dispatch(getUser(row.id))}
          >
            <span className="fw-bolder">{row.user.name}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">{row.user.name}</small>
        </div>
      </div>
    ),
  },
  {
    name: "Doanh số",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{currency(row.revenue)}</span>
      </div>
    )
  },
  {
    name: "Đã thu",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{currency(row.total_collected)}</span>
      </div>
    )
  },
  {
    name: "Tiêu hao",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{currency(row.attrition)}</span>
      </div>
    )
  },
  {
    name: "Tổng tiền",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{currency(row.total_money)}</span>
      </div>
    )
  },
  {
    name: "Thưởng (%)",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{row.percentage_bonus}</span>
      </div>
    )
  },
  {
    name: "Thưởng d.thu",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <span className="fw-bolder">{currency(row.revenue_bonus)}</span>
      </div>
    )
  }
]

