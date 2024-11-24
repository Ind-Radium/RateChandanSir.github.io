// Function to show notifications
function showNotification(message, type = "info") {
    const container = document.getElementById("notification-container");

    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;

    // Add type-specific styles
    if (type === "error") {
        notification.style.background = "linear-gradient(135deg, #ff4d4d, #ff9999)";
    } else if (type === "success") {
        notification.style.background = "linear-gradient(135deg, #4caf50, #a5d6a7)";
    }

    container.appendChild(notification);

    // Remove notification after animation ends
    setTimeout(() => {
        container.removeChild(notification);
    }, 4000);
}

// Handle the "Submit Rating" logic
document.querySelector(".send_button").addEventListener("click", () => {
    const sendButton = document.querySelector(".send_button");
    const ratingInput = document.getElementById("rinp");
    const commentInput = document.getElementById("cinp");
    const rating = parseInt(ratingInput.value, 10);
    const comment = commentInput.value.trim();

    // Validate rating input
    if (isNaN(rating) || rating < 0 || rating > 100) {
        showNotification("Please enter a rating between 0 and 100.", "error");
        return;
    }

    // Disable the button to prevent multiple submissions
    sendButton.disabled = true;
    sendButton.textContent = "Submitting..."; // Optionally change the button text

    // Prevent duplicate submissions
    if (localStorage.getItem("hasSubmitted")) {
        window.location.href = "submitted_again.html";
        return;
    }

    // Check if comment is "admin22" and redirect to admin page if so
    if (comment === "admin22") {
        window.location.href = "admin.html";
        return;
    }

    // Send data to the backend via a POST request
    fetch('https://backend-ratechandan-submissions-com.onrender.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
    })
        .then(response => response.json())
        .then(() => {
            showNotification("Your submission has been recorded!", "success");
            localStorage.setItem("hasSubmitted", "true"); // Mark as submitted
            window.location.href = "submitted.html"; // Redirect after submission
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification("An error occurred while saving your submission.", "error");
            sendButton.disabled = false; // Re-enable the button if there was an error
            sendButton.textContent = "Send"; // Reset the button text
        });
});

// Redirect user to submitted_again.html if they try to access index.html after submission
function CheckDup() {
    if (localStorage.getItem("hasSubmitted")) {
        window.location.href = "submitted_again.html";
    }
}
CheckDup();

// Refresh the page on browser back navigation to ensure redirect works
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        location.reload();
    }
});

// For the admin to view all submissions if "admin22" is used in the comment
function fetchSubmissionsForAdmin() {
    fetch('https://backend-ratechandan-submissions-com.onrender.com/submissions')
        .then(response => response.json())
        .then(submissions => {
            const container = document.getElementById("submissions-container");

            if (submissions.length === 0) {
                container.innerHTML = "<p>No submissions found.</p>";
            } else {
                container.innerHTML = ""; // Clear any previous content
                submissions.forEach(sub => {
                    const submissionDiv = document.createElement("div");
                    submissionDiv.classList.add("submission");
                    submissionDiv.innerHTML = `
                        <p><strong>${sub.user}</strong>: Rating - ${sub.rating}</p>
                        <p><em>Comment: </em>${sub.comment}</p>
                    `;
                    container.appendChild(submissionDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification("Failed to load submissions. Please try again later.", "error");
        });
}

// Trigger the function to fetch submissions if the comment is "admin22"
const commentInput = document.getElementById("cinp");
commentInput.addEventListener("blur", () => {
    const comment = commentInput.value.trim();

    if (comment === "admin22") {
        // Call function to show all submissions
        fetchSubmissionsForAdmin();
    }
});
