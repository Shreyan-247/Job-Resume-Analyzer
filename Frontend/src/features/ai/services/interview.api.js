import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:3000/api/ai",
    withCredentials:true
});

export const generateInterviewReport = async ({
    selfDescription,
    jobDescription,
    companyName,
    resumeFile
}) => {
    const formData = new FormData();

    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);
    formData.append("companyName", companyName);
    formData.append("resume", resumeFile);

    const response = await api.post(
        "/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const getReportById = async (interviewId) => {
    const response = await api.get(`/report/${interviewId}`);
    return response.data;
};

export const getAllReports = async () => {
    const response = await api.get("/");
    return response.data;
};

export const generatePdfReport = async (interviewId) => {
    const response = await api.get(
        `/generate/${interviewId}`,
        {
            responseType: "blob"
        }
    );

    return response.data;
};
