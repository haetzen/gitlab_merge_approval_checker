# GitLab Merge Approval Enforcer

![Opera Extension](https://img.shields.io/badge/Opera-Extension-FF1B2D?logo=opera)
![License](https://img.shields.io/badge/License-MIT-green)

A browser extension that enforces approval requirements for GitLab merge requests by disabling the merge button until all reviewers have approved.

## Features

- 🔒 Disables merge buttons until all approvals are given
- 👥 Supports multiple reviewers
- 🎯 Works with both regular merge and "Merge when pipeline succeeds" buttons
- 🔔 Visual feedback with approval status tooltips
- 🛡️ Client-side only - no server communication

## Installation

### For Opera:
1. Download the latest `.crx` file from [Releases]()
2. Navigate to `opera://extensions`
3. Enable "Developer mode" (top-right toggle)
4. Drag the `.crx` file into the extensions page

### Manual Load (Developer):
1. Clone this repository
2. Go to `opera://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder

## How It Works

The extension:
1. Detects when you're on a GitLab merge request page
2. Checks for active reviewers
3. Verifies approval status by:
   - Checking "Revoke approval" button state
   - Scanning reviewer avatars
4. Disables merge buttons with status messages until all approve


## Building

1. Install dependencies (none required)
2. Package extension:
   ```bash
   zip -r gitlab-merge-approval.zip manifest.json content.js styles.css LICENSE README.md icon.png
   ```

## License

MIT License - See [LICENSE](LICENSE) file

## Support

Report issues at:  
[GitHub Issues]()(https://github.com/haetzen/gitlab_merge_approval_checker/issues)

---

**Note**: This is a client-side tool. Your organization's GitLab approval rules still take precedence.
