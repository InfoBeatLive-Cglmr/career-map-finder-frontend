import Cookies from "js-cookie";
import { updateResponseApi } from "@/app/utils/account/updateResponse";

export const syncUpdateResponsesAndInvalidateCache = async () => {
  try {
    const userId = Cookies.get("userId");

    if (!userId) return;

    const response = await updateResponseApi.getByUserId(userId);

    if (!response?.data) return;

    const updates = response.data[0]; // assuming latest record

    if (!updates) return;

    const {
      careerUpdate,
      assessmentUpdate,
      interviewUpdate,
      dashboardsUpdate,
      settingsUpdate,
      notificationUpdate,
    } = updates;

    const storage = typeof window !== "undefined" ? window.localStorage : null;
    if (!storage) return;

    // helper
    const clearKeys = (patterns: string[]) => {
      Object.keys(storage).forEach((key) => {
        patterns.forEach((p) => {
          if (key.includes(p)) {
            storage.removeItem(key);
          }
        });
      });
    };

    // =========================
    // CAREER
    // =========================
    const lastCareer = Cookies.get("lastCareerUpdate");

    if (careerUpdate && lastCareer !== careerUpdate) {
      clearKeys([`career_reports_${userId}`, "career_reports"]);
      Cookies.set("lastCareerUpdate", careerUpdate, { path: "/", expires: 30 });
    }

    // =========================
    // ASSESSMENT
    // =========================
    const lastAssessment = Cookies.get("lastAssessmentUpdate");

    if (assessmentUpdate && lastAssessment !== assessmentUpdate) {
      clearKeys([`exam_sessions_${userId}`, "exam_sessions"]);
      Cookies.set("lastAssessmentUpdate", assessmentUpdate, { path: "/", expires: 30 });
    }

    // =========================
    // INTERVIEW
    // =========================
    const lastInterview = Cookies.get("lastInterviewUpdate");

    if (interviewUpdate && lastInterview !== interviewUpdate) {
      clearKeys([`interview_sessions_${userId}`, "interview_sessions"]);
      Cookies.set("lastInterviewUpdate", interviewUpdate, {
        path: "/",
        expires: 30,
      });
    }

    // =========================
    // SETTINGS (PROFILE)
    // =========================
    const lastSettings = Cookies.get("lastSettingsUpdate");

    if (settingsUpdate && lastSettings !== settingsUpdate) {
      clearKeys([`user_profile_${userId}`, "user_profile"]);
      Cookies.set("lastSettingsUpdate", settingsUpdate, {
        path: "/",
        expires: 30,
      });
    }

    // =========================
    // NOTIFICATIONS
    // =========================
    const lastNotification = Cookies.get("lastNotificationUpdate");

    if (notificationUpdate && lastNotification !== notificationUpdate) {
      clearKeys([`notifications_${userId}`, "notifications"]);
      Cookies.set("lastNotificationUpdate", notificationUpdate, {
        path: "/",
        expires: 30,
      });
    }

    // =========================
    // DASHBOARD (wipe everything related)
    // =========================
    const lastDashboard = Cookies.get("lastDashboardsUpdate");

    if (dashboardsUpdate && lastDashboard !== dashboardsUpdate) {
      clearKeys(["dashboard", "dashboards"]);
      Cookies.set("lastDashboardsUpdate", dashboardsUpdate, {
        path: "/",
        expires: 30,
      });
    }

    // =========================
    // SIZE CHECK (4.7MB limit logic)
    // =========================
    let totalSize = 0;

    Object.keys(storage).forEach((key) => {
      const value = storage.getItem(key) || "";
      totalSize += new Blob([value]).size;
    });

    const sizeInMB = totalSize / (1024 * 1024);

    if (sizeInMB >= 4.7) {
      console.warn("LocalStorage exceeded 4.7MB — clearing all cache");
      storage.clear();
    }
  } catch (err) {
    console.error("Sync update error:", err);
  }
};