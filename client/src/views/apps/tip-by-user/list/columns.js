// ** Reactstrap Imports
import { Button } from "reactstrap";
import { currency } from "../../currencyPrice";

export const columns = (toggle, setListBody) => [
  {
    name: "Tên",
    sortable: true,
    minWidth: "172px",
    sortField: "name",
    cell: (row) => {
      return <span>{row.user.name}</span>;
    },
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "172px",
    sortField: "email",
    cell: (row) => <span>{row.user.email}</span>,
  },
  {
    name: "Thủ thuật",
    sortable: true,
    minWidth: "172px",
    sortField: "active",
    cell: (row) => {
      return (
        <>
          {row.tip.length > 0 ? (
            <Button
              size="small"
              color="primary"
              onClick={(e) => {
                toggle(row.tip);
                e.preventDefault();
              }}
            >
              Chi tiết
            </Button>
          ) : (
            <span>Chưa có thủ thuật</span>
          )}
        </>
      );
    },
  },
  {
    name: "Đơn giá",
    sortable: true,
    minWidth: "172px",
    sortField: "active",
    cell: (row) => (
      <span>
        {row && row?.tip
          ? currency(
              row?.tip.reduce(
                (total, currentValue) => total + currentValue.price,
                0
              )
            )
          : 0}
      </span>
    ),
  },
];
