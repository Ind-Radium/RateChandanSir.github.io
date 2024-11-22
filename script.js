// Wait for the DOM content to load before executing functions
document.addEventListener('DOMContentLoaded', function () {
    // Check if the user has already submitted data
    checkUserSubmission();

    // Handle form submission when the submit button is clicked
    document.getElementById('submit_btn').addEventListener('click', handleFormSubmission);

    // Handle admin section when the admin button is clicked
    document.getElementById('admin_btn').addEventListener('click', adminViewSubmissions);
});

// Function to check if the user has already submitted data
function checkUserSubmission() {
    const hasSubmitted = localStorage.getItem('chandanFormSubmitted');

    if (hasSubmitted === 'true') {
        disableForm();
        alert('You have already submitted your feedback.');
    }
}

// Function to handle form submission
function handleFormSubmission() {
    const inp1 = parseInt(document.getElementById('inp1').value, 10);
    const inp2 = parseInt(document.getElementById('inp2').value, 10);
    const inp3 = parseInt(document.getElementById('inp3').value, 10);
    const comment = document.getElementById('com_txt').value;

    // Validate input: all ratings must be between 0 and 100
    if (!validateRating(inp1) || !validateRating(inp2) || !validateRating(inp3)) {
        alert('Please enter a valid rating between 0 and 100 for all fields.');
        return;
    }

    // Submit the data to the server via a POST request
    saveFormData(inp1, inp2, inp3, comment);

    // Mark the form as submitted in localStorage to prevent multiple submissions
    localStorage.setItem('chandanFormSubmitted', 'true');

    // Disable the form after submission
    disableForm();

    alert('Thank you for your feedback!');
}

// Function to validate if the rating is between 0 and 100
function validateRating(value) {
    return value >= 0 && value <= 100;
}

// Function to send form data to the server
function saveFormData(inp1, inp2, inp3, comment) {
    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inp1,
            inp2,
            inp3,
            comment,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Success message from server
    })
    .catch(error => {
        console.error('Error submitting data:', error); // Error handling
    });
}

// Function to disable form fields and the submit button after submission
function disableForm() {
    document.getElementById('inp1').disabled = true;
    document.getElementById('inp2').disabled = true;
    document.getElementById('inp3').disabled = true;
    document.getElementById('com_txt').disabled = true;
    document.getElementById('submit_btn').disabled = true;
}

// Admin function to view all submissions
function adminViewSubmissions() {
    const password = document.getElementById('admin_password').value;
    const adminPassword = "admin123"; // Admin password

    if (password === adminPassword) {
        fetch('http://localhost:3000/submissions')
        .then(response => response.json())
        .then(submissions => {
            let submissionHTML = '<h3>All Submissions:</h3>';

            if (submissions.length === 0) {
                submissionHTML += '<p>No submissions yet.</p>';
            } else {
                submissions.forEach((submission, index) => {
                    submissionHTML += `
                        <div class="submission">
                            <p><b>Submission ${index + 1}:</b></p>
                            <p><b>Human Being Rating:</b> ${submission.inp1}%</p>
                            <p><b>Friend Rating:</b> ${submission.inp2}%</p>
                            <p><b>Teacher Rating:</b> ${submission.inp3}%</p>
                            <p><b>Comment:</b> ${submission.comment}</p>
                        </div>
                    `;
                });
            }

            document.getElementById('admin_view').innerHTML = submissionHTML;
            document.getElementById('admin_view').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching submissions:', error); // Error handling
        });
    } else {
        alert('Invalid password. Access denied.');
    }
}
