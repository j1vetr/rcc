import { Router, type IRouter } from "express";
import { services } from "@workspace/service-catalog";
export { services, getServiceById } from "@workspace/service-catalog";

const router: IRouter = Router();
router.get("/services", (_req, res): void => {
  res.json(services);
});
export default router;
