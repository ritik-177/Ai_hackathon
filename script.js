const input = document.getElementById("userInput");
const result = document.getElementById("result");

const generateButton =
    document.getElementById("generateButton");

const clearButton =
    document.getElementById("clearButton");

const status =
    document.getElementById("status");


// ----------------------------------------
// Generate button
// ----------------------------------------

generateButton.addEventListener("click", async () => {

    const userPrompt = input.value.trim();

    // Don't send empty request
    if (!userPrompt) {

        status.className =
            "status-text status-text--error";

        status.textContent =
            "Please enter an onboarding request.";

        return;
    }


    // Processing state
    status.className =
        "status-text status-text--processing";

    status.textContent =
        "Processing request...";

    generateButton.disabled = true;

    result.textContent =
        "Generating...";


    try {

        const response = await fetch("/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: userPrompt
            })

        });


        const data = await response.json();


        // Backend returned an error
        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong."
            );

        }


        // Display JSON
        result.textContent =
            JSON.stringify(data, null, 2);


        // Success state
        status.className =
            "status-text status-text--success";

        status.textContent =
            "Generated successfully";


    } catch (error) {

        console.error(error);


        // Error state
        status.className =
            "status-text status-text--error";

        status.textContent =
            "Error generating request";


        result.textContent =
            error.message;

    }


    generateButton.disabled = false;

});


// ----------------------------------------
// Clear button
// ----------------------------------------

clearButton.addEventListener("click", () => {

    input.value = "";

    result.textContent =
        "Waiting for request...";

    status.className =
        "status-text";

    status.textContent =
        "Ready";

});