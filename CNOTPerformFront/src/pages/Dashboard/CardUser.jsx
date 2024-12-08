import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import { useSelector, useDispatch } from "react-redux";
import { dashboardBlogVisitorData } from "../../store/actions";
import { getBourses } from "../../service/bourseService";

const CardUser = ({ popularpost, dataColors }) => {
  const [bourses, setBourses] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [todayAmount, setTodayAmount] = useState(0);
  const [monthAmount, setMonthAmount] = useState(0);
  const [yearAmount, setYearAmount] = useState(0);
  const apexCardUserChartColors = getChartColorsArray(dataColors);
  const [duration, setDuration] = useState("year");
  const dispatch = useDispatch();

  const fetchBourses = async () =>{
      
    const response = await getBourses(null, null, null, null, 'acceptee');
    const boursesData = response.data;
    setBourses(boursesData);

    // Extraire les montants par date pour alimenter le graphique
    const bourseDates = boursesData.map(bourse => new Date(bourse.date));
    const montantData = boursesData.map(bourse => bourse.montant);

        // Mettre à jour les catégories (dates) et la série de données (montants)
        setChartCategories(bourseDates);
        setChartSeries([
          {
            name: "Montant",
            data: montantData,
          },
        ]);

    // Set current date
    const today = new Date();
    
    // Calculate amounts for today, this month, and this year
    let todaySum = 0;
    let monthSum = 0;
    let yearSum = 0;

    boursesData.forEach(bourse => {
      const bourseDate = new Date(bourse.date);
      
      // For today
      if (
        bourseDate.getDate() === today.getDate() &&
        bourseDate.getMonth() === today.getMonth() &&
        bourseDate.getFullYear() === today.getFullYear()
      ) {
        todaySum += bourse.montant;
      }

      // For this month
      if (
        bourseDate.getMonth() === today.getMonth() &&
        bourseDate.getFullYear() === today.getFullYear()
      ) {
        monthSum += bourse.montant;
      }

      // For this year
      if (bourseDate.getFullYear() === today.getFullYear()) {
        yearSum += bourse.montant;
      }
    });

    setTodayAmount(todaySum);
    setMonthAmount(monthSum);
    setYearAmount(yearSum);
  };

  useEffect(() =>{
    fetchBourses();
},[])

  const visitorDurationData = (duration) => {
    setDuration(duration);
    dispatch(dashboardBlogVisitorData(duration));
  };

  useEffect(() => {
    dispatch(dashboardBlogVisitorData("year"));
  }, [dispatch]);

  const { visitor } = useSelector((state) => ({
    visitor: state.DashboardBlog.visitor,
  }));

  const summ = popularpost?.reduce(
    (acc, event) => acc + event.participants?.length,
    0
  );

  const bud = popularpost?.reduce((acc, event) => acc + event.budget, 0);

  const series = [
    {
      name: "Current",
      data: visitor.Currentdata || [],
    },
    {
      name: "Previous",
      data: visitor.Previousdata || [],
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: apexCardUserChartColors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: chartCategories.map(date => date.toLocaleDateString()), // Transformer les dates en format lisible
    },
    markers: {
      size: 3,
      strokeWidth: 3,
      hover: {
        size: 4,
        sizeOffset: 2,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  return (
    <React.Fragment>
      <Col xl={8}>
        <Row>
          <Col lg={6}>
            <Card className="mini-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Nombre total des événements</p>
                    <h5 className="mb-0">{popularpost?.length}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title rounded-circle font-size-20 bg-light text-primary">
                      <i className="bx bxs-book-bookmark"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Budget Total des événements</p>
                    <h5 className="mb-0">{bud}DT</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title rounded-circle font-size-20 bg-light text-primary">
                      <i className="bx bxs-note"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Card>
          <CardBody>
            <div className="d-flex flex-wrap">
              <h5 className="card-title me-2">Bourses</h5>

            </div>

            <Row className="text-center">
              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Aujourd'hui</p>
                  <h5>{todayAmount} TND</h5>
                </div>
              </Col>

              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Ce mois</p>
                  <h5>
                  {monthAmount} TND{" "}
                  </h5>
                </div>
              </Col>

              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Cette année</p>
                  <h5>
                  {yearAmount} TND{" "}
                  </h5>
                </div>
              </Col>
            </Row>

            <hr className="mb-4" />
            <div id="area-chart" dir="ltr">
            <ReactApexChart
                options={options}
                series={chartSeries}
                type="area"
                height={350}
                className="apex-charts"
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

CardUser.propTypes = {
  options: PropTypes.any,
  series: PropTypes.any,
};

export default CardUser;
