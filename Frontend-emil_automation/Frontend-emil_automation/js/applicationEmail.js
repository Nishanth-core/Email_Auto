const API_BASE_URL = `${window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000"}/api`;

const messageBox = document.getElementById("messageBox");

async function sendApplicationMail() {

  const button = document.getElementById("sendBtn");

  // Get input values
  const name = document.getElementById("name").value;
  const applicationId =
    document.getElementById("applicationId").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;

  try {

    // Loading State
    button.disabled = true;
    button.innerText = "Sending...";

    messageBox.innerHTML = "";

    // API Call
    const response = await fetch(
      `${API_BASE_URL}/emails/send`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          userId: "101",

          name: name,

          email: email,

          emailType: "application_received",

          dynamicData: {
            applicationId: applicationId,
            role: role,
          },

        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Email failed");
    }

    // Success
    messageBox.innerHTML =
      "<p class='text-green-600'>Application Email Sent Successfully!</p>";

  } catch (error) {

    // Error
    messageBox.innerHTML =
      `<p class='text-red-600'>${error.message}</p>`;

    console.error(error);

  } finally {

    button.disabled = false;
    button.innerText = "Send Application Mail";
  }
}
