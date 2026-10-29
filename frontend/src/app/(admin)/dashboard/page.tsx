import PageTitle from "@/components/PageTitle";
import { Col, Row } from "react-bootstrap";
import Stat from "./components/Stat";
import GameOn from "./components/GameOn";
import Leaderboard from "./components/Leaderboard";
import HRSection from "./components/HRSection";
import TasksList from "./components/TasksList";
import Queries from "./components/Queries";
import EmployeePerformance from "./components/EmployeePerformance";
import NeedAttention from "./components/NeedAttention";
import CancellationsModifications from "./components/CancellationsModifications";
import Leads from "./components/Leads";
import NoticeBoard from "./components/NoticeBoard";
import TipsForYou from "./components/TipsForYou";
import "./dashboard.scss";

const DashboardPage = () => {
  return (
    <>
      <PageTitle title="Dashboard" />

      <Row className="g-2">
        <Col xl={4}>
          <Stat />
          <GameOn />
          <Leaderboard />
          <HRSection />
        </Col>
        <Col xl={4}>
          <TasksList />
          <Queries />
        </Col>
        <Col xl={4}>
          <EmployeePerformance />
          <NeedAttention />
        </Col>
      </Row>

      <Row className="g-2 mt-0">
        <Col xl={4}>
          <CancellationsModifications />
        </Col>
        <Col xl={4}>
          <Leads />
        </Col>
        <Col xl={4}>
          <NoticeBoard />
          <TipsForYou />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
