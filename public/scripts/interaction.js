// Filtersysteem
// 1. Document.addEventListener('DOMContentLoaded') zorgt ervoor dat de code pas wordt uitgevoerd als de HTML-pagina volledig is geladen.
// 2. Ik selecteer 2 elementen uit de DOM: departmentFilter en artworksGallery. Dit is het select element waarin de gebruiker een afdeling kan selecteren en de ul waarin de kunstwerken worden weergegeven.
// 3. Ik voeg een event listener toe aan het departmentFilter element. Dit event wordt geactiveerd wanneer de gebruiker een afdeling selecteert (change).
// 4. In de event listener haal ik de geselecteerde departmentId op uit het departmentFilter element.
// 5. Als er geen departmentId is geselecteerd, stopt de functie.
// 6. Ik maak een fetch request naar de /filter route met de geselecteerde departmentId als query parameter.
// 7. Ik wacht op de response en retourneer deze naar JSON-formaat.
// 8. Ik leeg de artworksGallery ul element door innerHTML = ''.
// 9. Ik loop over de objecten en maak voor elk object een li element aan met de class artwork-item.
// 10. Ik vul het li element met de afbeelding, titel, artiest en objectdatum van het object.
// 11. appendChild voegt het artworkItem toe aan de artworksGallery ul

document.addEventListener('DOMContentLoaded', () => {
    const departmentFilter = document.getElementById('department-filter');
    const artworksGallery = document.getElementById('artworks-gallery');

    departmentFilter.addEventListener('change', async () => {
        const departmentId = departmentFilter.value;

        if (!departmentId) return;

        const response = await fetch(`/filter?departmentId=${departmentId}`);
        const objects = await response.json();

        artworksGallery.innerHTML = '';

        objects.forEach(object => {
            const artworkItem = document.createElement('li');
            artworkItem.classList.add('artwork-item');
            artworkItem.innerHTML = `
                <img src="${object.primaryImageSmall}" alt="${object.title} by ${object.artistDisplayName}">
                <figcaption class="overlay">
                    <h3>${object.title}</h3>
                    <p>${object.artistDisplayName} - ${object.objectDate}</p>
                    <a href="/artwork/${object.objectID}" class="explore-button">Bekijk Kunstwerk</a>
                </figcaption>
            `;
            artworksGallery.appendChild(artworkItem);
        });
    });
});

// E-mail form setion /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. Ik selecteer de elementen die ik nodig heb uit de DOM: email-form, form-feedback, email, friend-email en de submit button.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('email-form');
    const feedback = document.getElementById('form-feedback');
    const emailField = document.getElementById('email');
    const friendEmailField = document.getElementById('friend-email');
    const submitButton = form.querySelector('button[type="submit"]');

    // Functie om te controleren of een e-mailadres geldig is
    const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Functie om de status van een veld bij te werken, als het e-mailadres geldig is, wordt de rand groen, anders rood
    const updateFieldState = (field) => {
        field.style.borderColor = isValidEmail(field.value) ? 'green' : 'red';
    };

    //  Dit zorgt ervoor dat de rand van de invoervelden groen of rood wordt wanneer de gebruiker iets invoert
    emailField.addEventListener('input', () => updateFieldState(emailField));
    friendEmailField.addEventListener('input', () => updateFieldState(friendEmailField));

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Voorkomt standaard verzending
        // Controleert of beide e-mailadressen geldig zijn
        if (isValidEmail(emailField.value) && isValidEmail(friendEmailField.value)) {
        //    Als de e-mailadressen geldig zijn, wordt de knop gedeactiveerd en de tekst veranderd in 'sending...'
            submitButton.textContent = 'sending...';
            submitButton.disabled = true;
            submitButton.style.backgroundColor = '#ccc'; 
        //  Maakt een FormData object aan en voegt de waarden van de invoervelden toe
        //  Dit houdt in dat de waarden van de invoervelden worden verzonden naar de server
            const formData = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                });
        // Als de e-mail succesvol is verzonden, wordt de feedback tekst groen en wordt het formulier gereset
                if (response.ok) {
                    feedback.textContent = "Email succesfully sent!";
                    feedback.style.color = "green";
                    form.reset();
                } else {
                    throw new Error(); 
                }
            } catch {
                feedback.textContent = "There was an error. Try again.";
                feedback.style.color = "red";
            }

            //  Dit zorgt ervoor dat de knop weer actief wordt en de tekst weer wordt veranderd in 'send'
            submitButton.textContent = 'send';
            submitButton.disabled = false;
            submitButton.style.backgroundColor = '#e4002b'; 
        } else {
            feedback.textContent = 'Fill in the form correctly.';
            feedback.style.color = 'red';
        }
    });
});
