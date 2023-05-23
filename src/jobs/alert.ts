import { schedule, getTasks, validate } from "node-cron";
import { isToday } from "../helpers/date";
import { CattleAlert } from "../model";
import { onlineUsers } from "../socketServer";
import allAlerts from "./alerts.json";


const alerts: CattleAlert[] = allAlerts;
export const job = schedule("0 */1 * * *", (data) => {
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
console.log('Jobs scheduler started....');
console.table(getTasks())
