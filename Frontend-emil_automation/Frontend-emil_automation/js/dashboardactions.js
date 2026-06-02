const BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000";
const messageBox = document.getElementById("messageBox");
const composeModal = document.getElementById("composeModal");
const composeTitle = document.getElementById("composeTitle");
const composeEmailType = document.getElementById("composeEmailType");
const composeName = document.getElementById("composeName");
const composeEmail = document.getElementById("composeEmail");
const composeRole = document.getElementById("composeRole");
const composeDepartment = document.getElementById("composeDepartment");
const composeJoiningDate = document.getElementById("composeJoiningDate");
const composeWorkMode = document.getElementById("composeWorkMode");
const composeDeadline = document.getElementById("composeDeadline");
const composeStatus = document.getElementById("composeStatus");
const composeSendButton = document.getElementById("composeSendButton");
const candidateTableBody = document.getElementById("candidateTableBody");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");
const bulkEmailType = document.getElementById("bulkEmailType");

const candidates = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    department: "Engineering",
    role: "Frontend Development Intern",
    joiningDate: "15 June 2026",
    workMode: "Remote",
    deadline: "15 June 2026",
    status: "Pending"
  },
  {
    id: 2,
    name: "Priya Reddy",
    email: "priya@example.com",
    department: "Engineering",
    role: "Backend Development Intern",
    joiningDate: "18 June 2026",
    workMode: "Hybrid",
    deadline: "15 June 2026",
    status: "Pending"
  },
  {
    id: 3,
    name: "Arjun Verma",
    email: "arjun@example.com",
    department: "Design",
    role: "UI/UX Design Intern",
    joiningDate: "20 June 2026",
    workMode: "Onsite",
    deadline: "15 June 2026",
    status: "Pending"
  }
];

const emailActions = [
  { key: "application_received", label: "Application" },
  { key: "interview_scheduled", label: "Interview" },
  { key: "selection", label: "Selection" },
  { key: "rejection", label: "Rejection" },
  { key: "offer_letter", label: "Offer Letter" },
  { key: "onboarding_reminder", label: "Onboarding" }
];

let selectedCandidates = new Set();
let currentComposePayload = null;

const showMessage = (message, type = "neutral") => {
  if (!messageBox) return;
  const color = type === "success" ? "#1f6f38" : type === "error" ? "#a32d2d" : "#5f5e5a";
  const background = type === "success" ? "#e6f5ea" : type === "error" ? "#fbeaea" : "#f5f4f0";
  messageBox.style.color = color;
  messageBox.style.background = background;
  messageBox.style.border = "1px solid transparent";
  messageBox.style.padding = "0.95rem 1rem";
  messageBox.style.borderRadius = "8px";
  messageBox.style.marginTop = "1rem";
  messageBox.innerHTML = `<strong>${message}</strong>`;
};

const setComposeStatus = (message, type = "neutral") => {
  if (!composeStatus) return;
  composeStatus.innerText = message;
  composeStatus.style.color = type === "success" ? "#1f6f38" : type === "error" ? "#a32d2d" : "#5f5e5a";
};

const renderCandidates = () => {
  if (!candidateTableBody) return;
  candidateTableBody.innerHTML = "";
  candidates.forEach((candidate) => {
    const selected = selectedCandidates.has(candidate.id) ? "checked" : "";
    const actionButtons = emailActions
      .map(
        (action) =>
          `<button class="btn" onclick="openComposeModal(${candidate.id}, '${action.key}')">${action.label}</button>`
      )
      .join("");

    candidateTableBody.innerHTML += `
      <tr>
        <td style="width: 1px; padding: 12px 10px;"><input type="checkbox" ${selected} onchange="toggleCandidateSelection(${candidate.id})" /></td>
        <td>
          <div class="name">${candidate.name}</div>
          <div class="email">${candidate.email}</div>
        </td>
        <td class="dept">${candidate.department}</td>
        <td><span class="badge">${candidate.status}</span></td>
        <td class="actions">${actionButtons}</td>
      </tr>`;
  });
};

const toggleCandidateSelection = (id) => {
  if (selectedCandidates.has(id)) {
    selectedCandidates.delete(id);
  } else {
    selectedCandidates.add(id);
  }
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = selectedCandidates.size === candidates.length;
  }
  renderCandidates();
};

const toggleSelectAll = () => {
  if (selectedCandidates.size === candidates.length) {
    selectedCandidates.clear();
  } else {
    candidates.forEach((candidate) => selectedCandidates.add(candidate.id));
  }
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = selectedCandidates.size === candidates.length;
  }
  renderCandidates();
};

const openComposeModal = (candidateId, emailTypeKey) => {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate || !composeModal) return;

  currentComposePayload = { candidate, emailTypeKey };
  composeTitle.innerText = `Send ${emailActions.find((item) => item.key === emailTypeKey)?.label || "Email"}`;
  composeEmailType.value = emailTypeKey;
  composeName.value = candidate.name;
  composeEmail.value = candidate.email;
  composeRole.value = candidate.role;
  composeDepartment.value = candidate.department;
  composeJoiningDate.value = candidate.joiningDate;
  composeWorkMode.value = candidate.workMode;
  composeDeadline.value = candidate.deadline;
  setComposeStatus("Review email data and send.", "neutral");
  composeModal.style.display = "flex";
};

const closeComposeModal = () => {
  if (!composeModal) return;
  composeModal.style.display = "none";
  currentComposePayload = null;
};

const sendEmail = async (payload) => {
  const response = await fetch(`${BASE_URL}/api/emails/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Email send failed");
  }
  return data;
};

const confirmSendCompose = async () => {
  if (!currentComposePayload) return;
  if (composeSendButton) {
    composeSendButton.disabled = true;
    composeSendButton.innerText = "Sending...";
  }

  const payload = {
    name: composeName.value.trim(),
    email: composeEmail.value.trim(),
    emailType: composeEmailType.value,
    dynamicData: {
      role: composeRole.value.trim(),
      department: composeDepartment.value.trim(),
      joiningDate: composeJoiningDate.value.trim(),
      workMode: composeWorkMode.value.trim(),
      deadline: composeDeadline.value.trim()
    }
  };

  try {
    await sendEmail(payload);
    showMessage(`✓ ${composeTitle.innerText} sent successfully.`, "success");
    setComposeStatus("Email sent successfully.", "success");
    closeComposeModal();
  } catch (error) {
    console.error("Compose send failed", error);
    showMessage(`✗ ${error.message}`, "error");
    setComposeStatus(error.message, "error");
  } finally {
    if (composeSendButton) {
      composeSendButton.disabled = false;
      composeSendButton.innerText = "Send email";
    }
  }
};

const sendBulkEmail = async () => {
  const selected = candidates.filter((candidate) => selectedCandidates.has(candidate.id));
  if (selected.length === 0) {
    showMessage("Please select at least one candidate for bulk send.", "error");
    return;
  }

  const type = bulkEmailType?.value || "application_received";
  const payload = {
    emailType: type,
    users: selected.map((candidate) => ({
      name: candidate.name,
      email: candidate.email,
      department: candidate.department,
      role: candidate.role,
      joiningDate: candidate.joiningDate,
      workMode: candidate.workMode,
      deadline: candidate.deadline
    }))
  };

  const bulkButton = document.getElementById("bulkSendButton");
  if (bulkButton) {
    bulkButton.disabled = true;
    bulkButton.innerText = "Sending...";
  }

  try {
    const response = await fetch(`${BASE_URL}/api/email/bulk-send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Bulk send failed");
    }

    showMessage(`✓ Bulk ${emailActions.find((e) => e.key === type)?.label || "email"} send queued.`, "success");
  } catch (error) {
    console.error("Bulk send failed", error);
    showMessage(`✗ ${error.message}`, "error");
  } finally {
    if (bulkButton) {
      bulkButton.disabled = false;
      bulkButton.innerText = "Send bulk email";
    }
  }
};

window.openComposeModal = openComposeModal;
window.toggleCandidateSelection = toggleCandidateSelection;
window.toggleSelectAll = toggleSelectAll;
window.sendBulkEmail = sendBulkEmail;
window.closeComposeModal = closeComposeModal;
window.confirmSendCompose = confirmSendCompose;

renderCandidates();
