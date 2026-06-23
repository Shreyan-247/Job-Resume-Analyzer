const express = require("express");
const aiRouter=express.Router()
const aiController = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireProPlan=require("../middlewares/requireProPlan");
const checkReportLimit=require("../middlewares/report.limit");
const upload=require("../middlewares/file.middleware")

aiRouter.post('/', authMiddleware.authUserMiddleware,checkReportLimit,upload.single("resume") ,aiController.generateReport);

aiRouter.get('/report/:interviewId', authMiddleware.authUserMiddleware, aiController.generateReportById);

aiRouter.get('/generate/:interviewId', authMiddleware.authUserMiddleware,requireProPlan , aiController.generateResume);

aiRouter.get('/',authMiddleware.authUserMiddleware,aiController.getAllReport)

module.exports=aiRouter;