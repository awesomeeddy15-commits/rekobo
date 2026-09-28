// --- Modal Open & Close Logic ---
const modal = document.getElementById('pickup-modal');
const closeBtn = document.querySelector('.close-btn');
const openModalBtns = document.querySelectorAll('.open-modal');

// Open modal when any "Schedule Pickup" button is clicked
openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); 
        modal.style.display = 'flex'; // Changes from 'none' to 'flex' to show it
    });
});

// Close modal when clicking the 'X' button
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking anywhere outside the white box
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


// --- Form Submission Logic (WhatsApp) ---
document.getElementById('pickup-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Grab the data from the form
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const address = document.getElementById('address').value;
    const wasteTypeDropdown = document.getElementById('waste-type');
    const wasteType = wasteTypeDropdown.options[wasteTypeDropdown.selectedIndex].text;
    const notes = document.getElementById('notes').value;

    // Format the message for WhatsApp (%0A creates a line break)
    const message = `Hello Rekobo! I'd like to schedule a waste pickup.%0A%0A*Name:* ${name}%0A*My Number:* ${whatsapp}%0A*Address:* ${address}%0A*Waste Type:* ${wasteType}%0A*Notes:* ${notes || 'None'}`;

    // IMPORTANT: Replace this with Rekobo's actual WhatsApp number. 
    // Format: Country code followed by the number, no plus sign or spaces (e.g., 2348012345678).
    const rekoboWhatsAppNumber = "2340000000000"; 
    
    // Create the WhatsApp URL and open it in a new tab
    const whatsappURL = `https://wa.me/${rekoboWhatsAppNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Optional: Close the modal after clicking submit
    modal.style.display = 'none';
    // Optional: Clear the form fields after submit
    document.getElementById('pickup-form').reset();
});