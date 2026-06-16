import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aplRouter from "./apl";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/apl", aplRouter);
router.use("/admin", adminRouter);

export default router;
