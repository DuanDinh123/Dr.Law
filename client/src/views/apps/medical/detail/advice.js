
export const column = (toggle, adviceSelected, setAdviceSelected) => [
  {
    name: "Tên lời dặn",
    sortable: true,
    minWidth: "200px",
    sortField: "fullName",
    selector: (row) => row.id.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.id.name}</span>
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Nội dung",
    sortable: true,
    minWidth: "150px",
    sortField: "",
    selector: (row) => row.id.sample_content,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.id.sample_content}</span>
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
    selector: (row) => row.id.note,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <p className="user_name text-truncate text-body mb-0">
            <span className="fw-bolder">{row.id.note}</span>
          </p>
        </div>
      </div>
    )
  },
];
