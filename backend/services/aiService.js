const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateReviews = async ({
    businessName,
    rating,
    language,
    services,
    experience
}) => {
    const prompt = `
You are writing a genuine customer review.

Business name:
${businessName}

Rating:
${rating} out of 5 stars

Language:
${language}

Selected services/experiences:
${services && services.length > 0 ? services.join(", ") : "None specified"}

Optional customer comment:
${experience ? experience : "None provided"}

Generate EXACTLY ONE natural customer review.

Rules:
- The review must be between 20 and 30 words.
- Sound like a real customer.
- Mention only the provided experiences and the optional comment.
- Do not invent facts or services.
- Do not use exaggerated marketing language or say "highly recommend" in every review.
- Match the sentiment to the rating (5=strongly positive, 4=positive, 3=balanced, 2=mixed/respectful criticism, 1=respectful negative).
- Do not mention AI.
- Write the review in ${language}.
- Respond with a valid JSON object ONLY, in this exact format: {"review": "your generated review text here"}. Do not include markdown formatting or backticks around the JSON.
`;

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        
        response_format: { type: "json_object" },
        reasoning_effort: "low",
        include_reasoning: false,
        max_completion_tokens: 300
    });

    return completion.choices[0].message.content;
};

module.exports = {
    generateReviews
};