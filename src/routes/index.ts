import express, { Request, Response, NextFunction } from "express";
var router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ body: { data: "MoMo Server" } });
});

export default router;
