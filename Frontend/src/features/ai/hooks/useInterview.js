import {useContext,useEffect} from "react"
import { InterviewContext } from "../interview.context";
import { generateInterviewReport,getReportById,getAllReports,generatePdfReport} from "../services/interview.api";
import { useParams } from "react-router-dom";
import { useSubscription } from '../../subscription/hooks/useSubscription.js'
import { SubscriptionContext } from "../../subscription/subscription.context.jsx";

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const{refreshSubscription}=useSubscription(SubscriptionContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, companyName, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({selfDescription,jobDescription,companyName,resumeFile })
            await refreshSubscription();
            setReport(response.report)
        } catch (error) {
            if (error.response?.status === 403) {
            
            // This reads the custom message we wrote in the backend file
            alert("Upgrade to Pro Plan to create More Reports"); 
            
            } else {
                console.log(error);
                alert("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false)
        }

        return response.report
    }

    const getRepById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getReportById(interviewId)
            setReport(response.report)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response?.report
    }

const getResumePdf = async (interviewId) => {
    setLoading(true);

    try {
        const response = await generatePdfReport(interviewId);

        const url = window.URL.createObjectURL(
            new Blob([response], { type: "application/pdf" })
        );

        const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `resume_${interviewId}.pdf`
        );

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        if (error.response?.status === 403) {
            
            // This reads the custom message we wrote in the backend file
            alert("UPGRADE TO PRO PLAN FOR THIS FUNCTIONALITY"); 
            
        } else {
            console.LOG(error);
            alert("Something went wrong. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllReports()
            setReports(response.reports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.reports
    }

    useEffect(() => {
        if (interviewId) {
            getRepById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return {report,reports,loading,getReports,getRepById,generateReport,getResumePdf};
};