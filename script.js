// --- Modal Open & Close Logic ---
const modal = document.getElementById('pickup-modal');
const closeBtn = document.querySelector('.close-btn');
const openModalBtns = document.querySelectorAll('.open-modal');

if (openModalBtns) {
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            modal.style.display = 'flex';
        });
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// --- Centralized WhatsApp Number ---
const rekoboWhatsAppNumber = "2348036034846"; 

// --- Modal Form Submission (All Pages) ---
const pickupForm = document.getElementById('pickup-form');
if (pickupForm) {
    pickupForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const address = document.getElementById('address').value;
        const wasteTypeDropdown = document.getElementById('waste-type');
        const wasteType = wasteTypeDropdown.options[wasteTypeDropdown.selectedIndex].text;
        const notes = document.getElementById('notes').value;

        const message = `Hello Rekobo! I'd like to schedule a waste pickup.%0A%0A*Name:* ${name}%0A*My Number:* ${whatsapp}%0A*Address:* ${address}%0A*Waste Type:* ${wasteType}%0A*Notes:* ${notes || 'None'}`;
        
        // Using the reliable api.whatsapp.com link format
        const whatsappURL = `https://api.whatsapp.com/send?phone=${rekoboWhatsAppNumber}&text=${message}`;
        window.open(whatsappURL, '_blank');
        
        modal.style.display = 'none';
        pickupForm.reset();
    });
}

// --- Contact Page Dedicated Form Submission ---
const contactForm = document.getElementById('contact-booking-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the page from refreshing and jumping to the top

        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const address = document.getElementById('contact-address').value;
        const serviceDropdown = document.getElementById('contact-service');
        const service = serviceDropdown.options[serviceDropdown.selectedIndex].text;

        const message = `Hello Rekobo! I'd like to book a service.%0A%0A*Name:* ${name}%0A*Number:* ${phone}%0A*Address:* ${address}%0A*Service Needed:* ${service}`;

        const whatsappURL = `https://api.whatsapp.com/send?phone=${rekoboWhatsAppNumber}&text=${message}`;
        window.open(whatsappURL, '_blank');
        
        contactForm.reset();
    });
}