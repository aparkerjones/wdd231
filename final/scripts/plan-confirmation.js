function getParamValue(params, key, fallback) {
    const value = params.get(key);
    if (!value || value.trim().length === 0) {
        return fallback;
    }

    return value;
}

function setValue(id, value) {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }

    element.textContent = value;
}

function initConfirmationPage() {
    const params = new URLSearchParams(window.location.search);

    setValue("confirmRecipientEmail", getParamValue(params, "recipientEmail", "Not provided"));
    setValue("confirmCcEmail", getParamValue(params, "ccEmail", "None"));
    setValue("confirmSubject", getParamValue(params, "emailSubject", "Not provided"));
    setValue("confirmNotes", getParamValue(params, "notes", "None"));
}

initConfirmationPage();
