import { schedule, ScheduleOptions } from "node-cron";
import { CattleAlert } from "../model";
import allAlerts from "./alerts.json"

const alerts: CattleAlert[] = allAlerts;

const job = schedule("", (data) => {

}, { name: "Alert Scheduler" });
