async function sendOfferLetterEmail(requestBody) {
  try {
    const baseUrl = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000";
    const response = await fetch(
      `${baseUrl}/api/emails/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    alert("Email sent successfully");
    console.log(result);

  } catch (error) {
    console.error("Error:", error.message);
    alert("Failed to send email");
  }
}
