import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static("public"));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.post("/generate", async (req, res) => {

    try {

        const userPrompt = req.body.prompt;

        const response = await client.responses.create({

            model: "gpt-5-mini",

            input: [
                {
                    role: "system",

                    content: `
You are an onboarding test-data extraction assistant.

Extract the user's requirements into JSON.

Possible information includes:

- number of users
- first name
- country
- account type

If something is not provided, return null.

Do not invent missing values.
`
                },

                {
                    role: "user",

                    content: userPrompt
                }
            ],

            text: {
                format: {

                    type: "json_schema",

                    name: "onboarding_request",

                    strict: true,

                    schema: {

                        type: "object",

                        properties: {

                            count: {
                                type: ["integer", "null"]
                            },

                            firstName: {
                                type: ["string", "null"]
                            },

                            country: {
                                type: ["string", "null"]
                            },

                            accountType: {
                                type: ["string", "null"]
                            }

                        },

                        required: [
                            "count",
                            "firstName",
                            "country",
                            "accountType"
                        ],

                        additionalProperties: false
                    }
                }
            }

        });

        const result =
            JSON.parse(response.output_text);

        res.json(result);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


app.listen(3000, () => {

    console.log(
        "Server running at http://localhost:3000"
    );

});