const mongoose = require("mongoose");
const interviewReportModel = require("../models/interviewReport.model");
const pdfParse = require("pdf-parse");
const  { generateInterviewReport}= require("../services/ai.service");
const  {generatePdfResume}= require("../services/ai.service2");
const prisma = require("../config/prisma");

const generateReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required"
            });
        }
        const resumeFile = req.file;
        const resumeData = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();
        const resumeContent = resumeData.text;

        const {
            selfDescription,
            jobDescription,
            companyName
        } = req.body;

        const report = await generateInterviewReport(
            resumeContent,
            selfDescription,
            jobDescription,
            companyName
        );

        const interviewReport =
            await interviewReportModel.create({
                user: req.user.userId,
                resume: resumeContent,
                companyName,
                selfDescription,
                jobDescription,
                ...report
            });
        
        await prisma.subscription.update({
            where: {
                mongoUserId: req.user.userId.toString()
            },
            data: {
                reportsGenerated: {
                    increment: 1
                }
            }
        });

        return res.status(201).json({
            message:"Interview Report Generation successfull.",
            report: interviewReport
        });


    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const generateResume = async (req, res) => {
    try {
        const { interviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview report id"
            });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.userId
        });

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });
        }

        const pdfBuffer = await generatePdfResume(
            interviewReport.resume,
            interviewReport.selfDescription,
            interviewReport.jobDescription
        );

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const generateReportById = async (req, res) => {
    try {
        const { interviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview report id"
            });
        }

        const report = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.userId
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });
        }

        return res.status(200).json({
            success: true,
            report
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * name:getAllReport
 * description:get all available reports of the user available in mongodb database
 */

const getAllReport = async (req, res) => {
    try {
        const reports = await interviewReportModel
            .find({ user: req.user.userId })
            .select("_id jobTitle matchScore companyName createdAt")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            reports
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { generateReport,generateReportById,getAllReport,generateResume};