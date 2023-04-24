// ** React Imports
import { useState } from "react";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
  CardText,
  Row,
  Col,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Flatpickr from "react-flatpickr";
import Chart from "react-apexcharts";
import moment from "moment/moment";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useEffect } from "react";
import { getRevenueStatistic } from "../store";
import ReportEmployeeTurnover from "../employee-turnover/list";
import { User, UserCheck, UserPlus, UserX } from "react-feather";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";
import NoDataFound from "../../components/NoDataFound";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AnalyticsDashboard = () => {
  const [picker, setPicker] = useState(new Date());
  const [series, setSeries] = useState([]);
  const [total, setTotal] = useState({});

  const dispatch = useDispatch();

  const store = useSelector((state) => state.dashboard);

  const currentUser = JSON.parse(localStorage.getItem("userData")).name;

  const donutColors = {
    series1: "#ffe700",
    series2: "#00d4bd",
    series3: "#826bf8",
    series4: "#2b9bf4",
    series5: "#FFA1A1",
  };

  // ** Chart Options
  const options = {
    legend: {
      show: true,
      position: "bottom",
    },
    labels: ["Tổng chi tiêu", "Lợi nhuận"],

    colors: [
      donutColors.series1,
      donutColors.series5,
      donutColors.series3,
      donutColors.series2,
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "2rem",
              fontFamily: "Montserrat",
            },
            value: {
              fontSize: "1rem",
              fontFamily: "Montserrat",
              formatter(val) {
                return `${parseInt(val)}%`;
              },
            },
            total: {
              show: true,
              fontSize: "1.5rem",
              label: "Tổng chi tiêu",
              formatter(val) {
                return `${parseInt(val.config.series[0])}%`;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "1.5rem",
                  },
                  value: {
                    fontSize: "1rem",
                  },
                  total: {
                    fontSize: "1.5rem",
                  },
                },
              },
            },
          },
        },
      },
    ],
  };

  // ** Chart Series

  // console.log("picker", moment(picker).format("YYYY-MM-DD"));

  const formatDate = (picker) => {
    return moment(picker).format("YYYY-MM-DD");
  };

  useEffect(() => {
    dispatch(
      getRevenueStatistic({
        startDate: formatDate(picker[0]),
        endDate: formatDate(picker[1]),
      })
    );
  }, [picker]);

  useEffect(() => {
    if (store.single.data && !store.single.loading) {
      setTotal(store.single.data)
      const { total_expenditure_statistics, total_revenue_statistics } =
        store.single.data;
      const total = total_revenue_statistics + total_expenditure_statistics;

      let totalRevenue = (total_revenue_statistics / total) * 100;
      let totalExpenditure = (total_expenditure_statistics / total) * 100;

      setSeries([totalRevenue, totalExpenditure]);
    }
  }, [store.single.data, store.single.loading]);

  return (
    <div className="dashboard-analytics">
      <h4 className="text-primary">Xin chào, {currentUser}</h4>
      <p>Ứng dụng phòng khám | Giao diện trang chủ</p>

      <Card>
        <CardHeader className="flex-row flex-nowrap">
          <CardTitle className="mb-75 col-8" tag="h4">
            Biểu đồ thu / chi
          </CardTitle>

          <div className="d-flex align-items-center justify-content-center col-4">
            <Flatpickr
              value={picker}
              id="range-picker"
              className="form-control"
              onChange={(date) => setPicker(date)}
              options={{
                mode: "range",
                defaultDate: ["2023-01-01", "2023-01-01"],
              }}
            />
          </div>

        </CardHeader>
        <CardBody className="w-100">
          { !store.single.loading  && (total.total_expenditure_statistics != 0 ||
            total.total_revenue_statistics != 0 )
          ? (
            <Chart
                options={options}
                series={series}
                type="donut"
                height={350}
              />
          ) : (
            <NoDataFound content="Không có dữ liệu" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <ReportEmployeeTurnover />
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
