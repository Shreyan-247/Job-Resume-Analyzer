const Groq = require("groq-sdk");
const { z } = require("zod");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const reportSchema = z.object({
    jobTitle: z.string(),

    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).length(10),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).length(5),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["Low", "Medium", "High"])
        })
    ).length(5),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()).min(2)
        })
    ).length(7)
});

async function generateInterviewReport(
    resume,
    selfDescription,
    jobDescription,
    companyName
) {
    const prompt = `
You are an expert technical recruiter and software engineering interviewer.

Analyze the candidate profile and generate a complete interview preparation report.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Company:
${companyName}

Job Description:
${jobDescription}

Instructions:

1. Determine the most appropriate job title.

2. Assign a matchScore between 0 and 100.

3. Generate EXACTLY 10 technical interview questions each questions and there answers should be in a detailed format min 5 lines.

Each technical question must contain:
- question
- intention
- answer

4. Generate EXACTLY 5 behavioral interview questions.

Each behavioral question must contain:
- question
- intention
- answer

5. Generate EXACTLY 5 skill gaps.

Each skill gap must contain:
{
  "skill": string,
  "severity": "Low" | "Medium" | "High"
}

6. Generate EXACTLY 7 preparation plan entries.

Each preparation plan entry must contain and minimum of 3 tasks should be assigned per day: 
{
  "day": number,
  "focus": string,
  "tasks": string[]
}

IMPORTANT:

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return code fences.
Do NOT return explanations.

The JSON MUST contain EXACTLY these keys:

{
  "jobTitle": string,
  "matchScore": number,
  "technicalQuestions": array,
  "behavioralQuestions": array,
  "skillGaps": array,
  "preparationPlan": array
}
`;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "Return only valid JSON. Never use markdown or code fences."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            response_format: {
                type: "json_object"
            }
        });

        const content =
            completion.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("Empty response from Groq");
        }

        console.log("RAW RESPONSE:");
        console.log(content);

        const data = JSON.parse(content);

        const validated = reportSchema.safeParse(data);

        if (!validated.success) {
            console.error(
                JSON.stringify(
                    validated.error.format(),
                    null,
                    2
                )
            );

            throw new Error(
                "Generated report failed schema validation"
            );
        }

        return validated.data;

    } catch (error) {
        console.error("Interview Report Generation Error:");
        console.error(error);

        throw error;
    }
}

module.exports = {
    generateInterviewReport
};