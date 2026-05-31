const BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000";

async function openOfferLetter() {
    try {
        if (!currentCandidateData) {
            alert("Please select a candidate");
            return;
        }

        const response = await fetch(
            `${BASE_URL}/api/offer-letter/open/${currentCandidateData.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (data.success) {
            window.open(data.offerLetterUrl, "_blank");
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Open Offer Letter Error:", error);
        alert("Failed to open offer letter");
    }
}
