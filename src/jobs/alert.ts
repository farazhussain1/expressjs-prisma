import { schedule, ScheduleOptions } from "node-cron";
import { isToday } from "../helpers/date";
import { CattleAlert } from "../model";
import { onlineUsers } from "../socketServer";
import allAlerts from "./alerts.json";

const alerts: CattleAlert[] = allAlerts;
const job = schedule("0 */4 * * *", (data) => {
    console.log(data.toLocaleString());
    const todayAlerts = alerts.filter((alert) => isToday(alert.dateTime));
    todayAlerts.forEach((alert) => {
      onlineUsers[alert.userId].socket?.emit("alert", {
        message: alert.message,
      });
    });
  },
  { name: "Alerts Scheduler" }
);
job.start()

