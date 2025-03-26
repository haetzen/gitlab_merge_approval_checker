// Initialize the extension
function initExtension() {
    // Check immediately and then every 2 seconds
    checkApprovals();
    const interval = setInterval(checkApprovals, 2000);

    // Handle GitLab's Turbo Drive navigation
    document.addEventListener('turbo:load', checkApprovals);
}

function checkApprovals() {
    const mergeButtons = [
        ...document.querySelectorAll('.accept-merge-request, .js-merge-when-pipeline-succeeds, [data-testid="merge-button"]')
    ];

    if (mergeButtons.length === 0) return;

    // NEW: Check approval status in modern GitLab UI
    const approvalStatus = detectApprovalStatus();

    // Update all merge buttons
    mergeButtons.forEach(button => {
        if (approvalStatus.allApproved) {
            enableMergeButton(button);
        } else {
            disableMergeButton(button, approvalStatus.message);
        }
    });
}

function detectApprovalStatus() {
    // Check if current user has approved
    const approveButton = document.querySelector('[data-testid="approve-button"]');
    const currentUserApproved = approveButton?.textContent?.trim().includes('Revoke approval');

    // Get all required approvers
    const approvers = [...document.querySelectorAll('.gl-avatar[alt*="avatar"]')]
        .map(el => el.getAttribute('alt').replace("'s avatar", ""))
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

    // Check if all have approved (simplified logic - may need adjustment)
    const allApproved = currentUserApproved && approvers.length > 0;

    return {
        allApproved,
        message: allApproved ? '' : `Waiting for approvals from: ${approvers.join(', ')}`
    };
}

function enableMergeButton(button) {
    button.disabled = false;
    button.title = '';
    button.classList.remove('disabled-by-approval-checker');
}

function disableMergeButton(button, message) {
    button.disabled = true;
    button.title = message || 'Waiting for approvals';
    button.classList.add('disabled-by-approval-checker');
}

// Start the extension
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtension);
} else {
    initExtension();
}