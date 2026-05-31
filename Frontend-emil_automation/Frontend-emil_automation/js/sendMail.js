const BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000";

async function sendMail() {
    try {
        if (!currentCandidateData) {
            alert("Please select a candidate");
            return;
        }

        const sendButton = document.getElementById("sendMailButton");
        sendButton.disabled = true;
        sendButton.innerText = "Sending...";

        const requestBody = {
            userId: currentCandidateData.id,
            name: currentCandidateData.name,
            email: currentCandidateData.email,
            emailType: "offer_letter",
            dynamicData: {
                role: currentCandidateData.role,
                department: currentCandidateData.department,
                joiningDate: currentCandidateData.joiningDate,
                workMode: currentCandidateData.workMode,
                deadline: currentCandidateData.deadline
            }
        };

        const response = await fetch(`${BASE_URL}/api/emails/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.success) {
            alert("Offer Letter Email sent successfully");
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Send Email Error:", error);
        alert("Email sending failed");
    } finally {
        const sendButton = document.getElementById("sendMailButton");
        sendButton.disabled = false;
        sendButton.innerText = "Send Email";
    }
}
