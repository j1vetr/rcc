import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quotesRouter from "./quotes";
import servicesRouter from "./services";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quotesRouter);
router.use(servicesRouter);

export default router;
