import { DashboardLayoutWrapper } from "@/app/components/dashboard/DashboardLayoutWrapper";
import AutonomousAlertsPage from "@/app/components/dashboard/progress-alert/AutonomousAlertsPage";

const page = () => {
  return (
    <div>
    <DashboardLayoutWrapper>
      <AutonomousAlertsPage />
    </DashboardLayoutWrapper>
    </div>
  )
}

export default page
