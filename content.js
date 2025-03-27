// Initialize the extension
function initExtension() {
    if (isGitLabSite()) {
        checkApprovals();
        const interval = setInterval(checkApprovals, 2000);
        document.addEventListener('turbo:load', checkApprovals);
    }
}

function isGitLabSite() {
    const hostname = window.location.hostname;
    const path = window.location.pathname;
    
    // Check if the protocol is HTTPS, the domain contains 'gitlab', and it's a merge request page
    return window.location.protocol === 'https:' && hostname.includes('gitlab') && path.includes('/merge_requests/');
}

function checkApprovals() {
    const mergeButtons = [
        ...document.querySelectorAll('.accept-merge-request, .js-merge-when-pipeline-succeeds, [data-testid="merge-button"]')
    ];

    if (mergeButtons.length === 0) return;

    const approvalStatus = detectApprovalStatus();

    mergeButtons.forEach(button => {
        if (approvalStatus.allApproved) {
            enableMergeButton(button);
        } else {
            disableMergeButton(button, approvalStatus.message);
        }
    });
}

function detectApprovalStatus() {
    // Find the approval summary (e.g., "2/3 approvals required")
    const approvalSummaryElement = document.querySelector('[data-testid="approval-summary"]');

    let requiredApprovals = 1; // Default in case we can't find it
    let currentApprovals = 0;

    if (approvalSummaryElement) {
        const match = approvalSummaryElement.textContent.match(/(\d+)\/(\d+)/);
        if (match) {
            currentApprovals = parseInt(match[1], 10);
            requiredApprovals = parseInt(match[2], 10);
        }
    }

    const allApproved = currentApprovals >= requiredApprovals;

    return {
        allApproved,
        message: allApproved
            ? ''
            : `Waiting for ${requiredApprovals - currentApprovals} more approvals`
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
