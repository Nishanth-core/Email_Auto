const messageBox =
  document.getElementById("messageBox");

// Reusable Message Function
function showMessage(message, color) {

  messageBox.innerHTML =
    `<p class="text-${color}-600 font-semibold">
      ${message}
    </p>`;
}

// Reusable Email Button Function
async function handleEmailAction(emailType) {

  try {

    // Loading Message
    showMessage(
      "Sending Email...",
      "yellow"
    );

    // Simulate API Delay
    await new Promise(resolve =>
      setTimeout(resolve, 1500)
    );

    // Success Message
    showMessage(
      `${emailType} sent successfully`,
      "green"
    );

  } catch (error) {

    // Error Message
    showMessage(
      "Email sending failed",
      "red"
    );

    console.error(error);
  }
}

// Button Functions

function sendProfileMail() {
  handleEmailAction("Profile Mail");
}

function sendInterviewMail() {
  handleEmailAction("Interview Mail");
}

function sendSelectionMail() {
  handleEmailAction("Selection Mail");
}

function sendRejectionMail() {
  handleEmailAction("Rejection Mail");
}

function sendOfferMail() {
  handleEmailAction("Offer Letter Mail");
}

function sendReminderMail() {
  handleEmailAction("Reminder Mail");
}