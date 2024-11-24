// Handle the "Submit Rating" logic
document.querySelector(".send_button").addEventListener("click", () => {
    const ratingInput = document.getElementById("rinp");
    const commentInput = document.getElementById("cinp");
    const rating = parseInt(ratingInput.value, 10);
    const comment = commentInput.value.trim();

    // Validate rating input
    if (isNaN(rating) || rating < 0 || rating > 100) {
        alert("Please enter a rating between 0 and 100.");
        return;
    }
    
    // Prevent duplicate submissions (check localStorage or a session flag)
    function CheckDup() {
        if (localStorage.getItem("hasSubmitted")) {
            window.location.href = "al_sub.html";
            return;
        }
    }
    CheckDup();    
    
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
    .then(data => {
            alert("Your submission has been recorded!");
            localStorage.setItem("hasSubmitted", "true");// Mark as submitted
            location.reload(true);
            window.location.href = "submitted.html";  // Redirect after submission
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while saving your submission.");
        });
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
                container.innerHTML = "";  // Clear any previous content
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
            alert("Failed to load submissions. Please try again later.");
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
        