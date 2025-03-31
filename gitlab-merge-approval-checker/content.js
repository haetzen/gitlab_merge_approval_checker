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
    // Find the reviewers container
    const reviewersContainer = document.querySelector('[data-testid="reviewers-block-container"]');
    if (!reviewersContainer) return { allApproved: true, message: '' };

    // Get all reviewer items
    const reviewerItems = reviewersContainer.querySelectorAll('[data-testid="reviewer"]');
    if (reviewerItems.length === 0) return { allApproved: true, message: '' };

    let approvedCount = 0;
    let totalReviewers = 0;

    reviewerItems.forEach(reviewer => {
        totalReviewers++;
        // Check if this reviewer has approved (using the approval icon)
        const approvedIcon = reviewer.querySelector('[data-testid="reviewer-state-icon"][aria-label="Reviewer approved changes"]');
        if (approvedIcon) {
            approvedCount++;
        }
    });

    const allApproved = approvedCount >= totalReviewers;

    return {
        allApproved,
        message: allApproved
            ? ''
            : `Waiting for ${totalReviewers - approvedCount} more reviewer approvals (${approvedCount}/${totalReviewers})`
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
