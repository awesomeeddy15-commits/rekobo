// --- Setup Variables ---
const modal = document.getElementById('pickup-modal');
const closeBtn = document.querySelector('.close-btn');
const openModalBtns = document.querySelectorAll('.open-modal');
const pickupForm = document.getElementById('pickup-form');
const contactForm = document.getElementById('contact-booking-form');

// 1. Save original form HTML for resetting later
const originalFormHTML = pickupForm ? pickupForm.innerHTML : '';

// 2. Clean reset function
function closeModalAndReset() {
    if (modal) modal.style.display = 'none';
    if (pickupForm) pickupForm.innerHTML = originalFormHTML;
}

// --- Modal Open & Close Logic ---
if (openModalBtns) {
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (modal) modal.style.display = 'flex';
        });
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModalAndReset);
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalAndReset();
    }
});

// --- Modal Form Submission (Schedule a Pickup) ---
if (pickupForm) {
    pickupForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        event.submitter.disabled = true;

        const formData = new FormData(pickupForm);

        try {
            const response = await fetch('/api/submit-pickup', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();

            if (result.success) {
                // Swap inputs for the green success screen
                pickupForm.innerHTML = `
                    <div style="text-align: center; padding: 30px 10px;">
                        <h2 style="color: #1A4D2E; font-size: 28px; font-weight: bold; margin-bottom: 15px;">Enquiry Received Successfully!</h2>
                        <p style="color: #4B5563; font-size: 16px; margin-bottom: 20px;">Your Reference Number is:</p>
                        <div style="background-color: #E8F5E9; color: #1A4D2E; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px dashed #1A4D2E;">
                            ${result["Reference Number"]}
                        </div>
                        <p style="color: #4B5563; font-size: 15px;">Our corporate team has been notified and will contact you shortly on WhatsApp to discuss your collection schedule.</p>
                    </div>
                `;
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error connecting to the server. Make sure Next.js is running.');
        }
    });
}

// --- Contact Page Dedicated Form Submission ---
// --- Contact Page Dedicated Form Submission ---
if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (event.submitter) event.submitter.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('/api/submit-pickup', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();

            if (result.success) {
                contactForm.innerHTML = `
                    <div style="text-align: center; padding: 30px 10px;">
                        <h2 style="color: #1A4D2E; font-size: 26px; font-weight: bold; margin-bottom: 15px;">Request Received Successfully!</h2>
                        <p style="color: #4B5563; font-size: 16px; margin-bottom: 20px;">Your Reference Number is:</p>
                        <div style="background-color: #E8F5E9; color: #1A4D2E; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px dashed #1A4D2E;">
                            ${result["Reference Number"]}
                        </div>
                        <p style="color: #4B5563; font-size: 15px;">Our team has been notified and will contact you shortly on WhatsApp.</p>
                        <button type="button" onclick="location.reload()" style="margin-top: 15px; background-color: #1A4D2E; color: white; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;">Submit Another</button>
                    </div>
                `;
            } else {
                alert(`Something went wrong: ${result.error || 'Please try again.'}`);
                if (event.submitter) event.submitter.disabled = false;
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error connecting to the server. Make sure Next.js is running.');
            if (event.submitter) event.submitter.disabled = false;
        }
    });
}

// --- Partnership Page Dedicated Form Submission ---
const partnershipForm = document.getElementById('partnership-form');
if (partnershipForm) {
    // 1. Save original form HTML for resetting later
    const originalPartnershipHTML = partnershipForm.innerHTML;

    partnershipForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        event.submitter.disabled = true;

        const formData = new FormData(partnershipForm);

        try {
            // 2. Point this specifically to the new partnership API route
            const response = await fetch('/api/submit-partnership', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();

            if (result.success) {
                // 3. Swap inputs for the green success screen using the REAL database tracking code
                partnershipForm.innerHTML = `
                    <div style="text-align: center; padding: 30px 10px;">
                        <h2 style="color: #1A4D2E; font-size: 28px; font-weight: bold; margin-bottom: 15px;">Enquiry Received Successfully!</h2>
                        <p style="color: #4B5563; font-size: 16px; margin-bottom: 20px;">Your Reference Number is:</p>
                        <div style="background-color: #E8F5E9; color: #1A4D2E; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px dashed #1A4D2E;">
                            ${result["Reference Number"]}
                        </div>
                        <p style="color: #4B5563; font-size: 15px;">Our corporate team has been notified and will contact you shortly.</p>
                        <button onclick="location.reload()" style="margin-top: 15px; background-color: #1A4D2E; color: white; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;">Submit Another</button>
                    </div>
                `;
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error connecting to the server. Make sure Next.js is running.');
        }
    });
}