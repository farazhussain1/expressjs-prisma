import { schedule, ScheduleOptions } from "node-cron";
import { CattleAlert } from "../model";
import { onlineUsers } from "../socketServer";
import allAlerts from "./alerts.json";

const alerts: CattleAlert[] = allAlerts;

const job = schedule(
  "* * * * * *",
  (data:any) => {
    const todayAlerts = alerts.filter((alert) => isToday(alert.dateTime));
    todayAlerts.forEach((alert) => {
      onlineUsers[alert.userId].socket?.emit("alert", {
        message: alert.message,
      });
    });
  },
  { name: "Alert Scheduler" }
);

console.log(job.start());

function isToday(_date: string) {
  const year = new Date(_date).getFullYear();
  const month = new Date(_date).getMonth();
  const date = new Date(_date).getDate();

  const todayDate = Date.UTC(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  const givenDate = Date.UTC(year, month, date);
  return todayDate == givenDate;
}
