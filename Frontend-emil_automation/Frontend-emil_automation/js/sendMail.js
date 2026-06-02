const BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000";
const STATUS_CONTAINER_ID = 'sendMailStatusMessage';

const getStatusContainer = () => {
  let container = document.getElementById(STATUS_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = STATUS_CONTAINER_ID;
    container.style.marginTop = '1rem';
    container.style.padding = '0.95rem 1rem';
    container.style.borderRadius = '8px';
    container.style.fontSize = '13px';
    container.style.maxWidth = '560px';
    container.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
    container.style.display = 'none';
    container.style.wordBreak = 'break-word';
    document.querySelector('.page-wrap')?.appendChild(container);
  }
  return container;
};

const showStatus = (message, type = 'neutral') => {
  const container = getStatusContainer();
  container.textContent = message;
  container.style.display = 'block';
  container.style.background = type === 'success' ? '#e6f5ea' : type === 'error' ? '#fbeaea' : '#f5f4f0';
  container.style.color = type === 'success' ? '#1f6f38' : type === 'error' ? '#8c1e1e' : '#1a1a1a';
  container.style.border = type === 'success' ? '1px solid #a6d8b8' : type === 'error' ? '1px solid #e5b7b7' : '1px solid #d4d2ca';
};

const updateSendButton = (state) => {
  const sendButton = document.getElementById('sendMailButton');
  if (!sendButton) return;

  switch (state) {
    case 'loading':
      sendButton.disabled = true;
      sendButton.innerText = 'Sending...';
      sendButton.classList.add('btn-primary');
      sendButton.classList.remove('btn-danger');
      break;
    case 'success':
      sendButton.disabled = false;
      sendButton.innerText = 'Sent';
      sendButton.classList.add('btn-primary');
      sendButton.classList.remove('btn-danger');
      break;
    case 'error':
      sendButton.disabled = false;
      sendButton.innerText = 'Send email';
      sendButton.classList.remove('btn-danger');
      break;
    default:
      sendButton.disabled = false;
      sendButton.innerText = 'Send email';
      break;
  }
};

async function sendMail() {
  if (!currentCandidateData) {
    showStatus('Please select an intern before sending the offer email.', 'error');
    return;
  }

  updateSendButton('loading');
  showStatus('Preparing email request...', 'neutral');

  const requestBody = {
    name: currentCandidateData.name,
    email: currentCandidateData.email,
    emailType: 'offer_letter',
    dynamicData: {
      role: currentCandidateData.role,
      department: currentCandidateData.department,
      joiningDate: currentCandidateData.joiningDate,
      workMode: currentCandidateData.workMode,
      deadline: currentCandidateData.deadline
    }
  };

  try {
    const response = await fetch(`${BASE_URL}/api/emails/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showStatus('Offer letter email sent successfully.', 'success');
      updateSendButton('success');
    } else {
      const message = data.message || 'Failed to send email. Check your backend and try again.';
      showStatus(message, 'error');
      updateSendButton('error');
      console.error('Send email failed response:', data);
    }
  } catch (error) {
    console.error('Send Email Error:', error);
    showStatus('Email sending failed. Please check your network or backend URL.', 'error');
    updateSendButton('error');
  }
}
