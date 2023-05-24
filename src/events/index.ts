import { Router } from 'express';
import { EventsHandler } from './handler';

export const eventsRouter = Router({ strict: true })

const events = new EventsHandler()


eventsRouter.get("/", events.get.bind(events));

eventsRouter.get("/:id", events.getById.bind(events));

eventsRouter.post("/", events.create.bind(events));

eventsRouter.put("/:id", events.update.bind(events));

eventsRouter.delete("/:id", events.delete.bind(events));
