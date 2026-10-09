import { DashboardLayoutWrapper } from "@/app/components/dashboard/DashboardLayoutWrapper";
import AlertCheckInPage from "@/app/components/dashboard/progress-alert/SubmitCheckIn";

const page = () => {
  return (
    <div>
    <DashboardLayoutWrapper>
      <AlertCheckInPage />
    </DashboardLayoutWrapper>
    </div>
  )
}

export default page
