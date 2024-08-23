
//// SERVER OPZETTEN///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Helper functie om JSON data op te halen uit url, omzetten naar object en retourneren
// Deze gebruik ik later om data op te halen uit de API
const fetchJson = async (url) => {
  const response = await fetch(url);
  return response.json(); 
};

////API'S DEFINIEREN EN BIJBEHORENDE DATA OPHALEN///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Functie om afdelingen op te halen
// - Hier definieer ik fetchDepartments functie die de afdelingen ophaalt
// - Dit haalt de afdelingen op uit de departmentsUrl en retourneert de afdelingen
const fetchDepartments = async () => {
    const departmentsUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/departments';
    const data = await fetchJson(departmentsUrl);
  return data.departments;
};

// Functie om objecten van een specifieke afdeling op te halen
// - Hier definieer ik fetchDepartmentObjects functie die de objecten ophaalt
// - Dit haalt de objecten op uit de departmentId en retourneert de objecten
// - departmentId is een parameter die de afdeling identificeert hierdoor kun je de objecten van een specifieke afdeling ophalen
const fetchDepartmentObjects = async (departmentId) => {
    const objectsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`;
    const data = await fetchJson(objectsUrl);
  return data.objectIDs.slice(0, 15); // Haal de eerste 10 objecten op
};

// Functie om details van een specifiek object op te halen
// - Hier definieer ik fetchObjectDetails functie die de details van een object ophaalt
// - Dit haalt de details van een object op door het objectId te gebruiken als parameter en retourneert de details nadat deze zijn opgehaald
const fetchObjectDetails = async (objectId) => {
  const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
  const data = await fetchJson(objectUrl);
return data;
};

////ROUTES DEFINIEREN & INDEX RENDEREN///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Route voor de homepage, dit bevat een lijst van afdelingen en een lijst van objecten
app.get('/', async (req, res) => {
  const departments = await fetchDepartments(); // Haalt de afdelingen op
  res.render('index', { departments, departmentImage, objects: [] }); // Renderr de index pagina met de afdelingen
});

// Route voor het ophalen van de objecten van een specifieke afdeling
app.get('/department/:id', async (req, res) => {
  const departmentId = req.params.id; // Haalt de departmentId uit de URL
  const objectIDs = await fetchDepartmentObjects(departmentId); // Haalt de objecten op voor de afdeling
  
  // Hier worden de details van de objecten opgehaald met behulp van de objectIDs
  const objects = await Promise.all(objectIDs.map(async (id) => {
  return await fetchObjectDetails(id);
}));

  const departments = await fetchDepartments(); // Haalt opnieuw de afdelingen op
  res.render('artworks', { departments, objects, departmentId }); // Rendert de artworks pagina met de objecten
});

// Route voor het tonen van de details van een specifiek kunstwerk
app.get('/artwork/:objectId', async (req, res) => {
  const objectId = req.params.objectId; // Haalt het objectId uit de URL
  const object = await fetchObjectDetails(objectId); // fetchObjectDetails haalt de details van het object op met behulp van objectId

  res.render('artwork-detail', { object }); // Rendert de artwork-detail pagina met de details van het kunstwerk
});

// Route voor het filteren van objecten op basis van afdeling
// - Hier definieer ik een route voor het filteren van objecten op basis van afdeling
// - Dit accepteert een departmentId als query parameter
// - Als er geen departmentId is, retourneert het een foutmelding
app.get('/filter', async (req, res) => {
    const { departmentId } = req.query;
    if (!departmentId) {
      return res.status(400).json({ error: 'Department ID is required' });
    }
  });
  
////Afbeeldingen dynamisch koppelen aan departments///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Eerst heb ik een functie departmentImage gemaakt die een departmentId als parameter accepteert en een afbeelding retourneert die overeenkomt met de afdeling
// switch statement controleert de waarde van departmentId 
// case statements staan gelijk aan de departmentID's
// return statement retourneert de afbeelding die overeenkomt met de departmentID
// in de route handler voor de homepage, heb ik de departmentImage functie toegevoegd aan de render methode
function departmentImage(departmentId) {
    switch(departmentId) {
        case 1: return '/assets/american-dep.webp';
        case 3: return '/assets/ancientnear-dep.webp';
        case 4: return '/assets/armor-dep.webp';
        case 5: return '/assets/oceanic-dep.webp';
        case 6: return '/assets/asian-dep.webp';
        case 7: return '/assets/armor-dep.webp';
        case 8: return '/assets/costume-dep.webp';
        case 9: return '/assets/drawings-dep.webp';
        case 10: return '/assets/egyptian-dep.webp';
        case 11: return '/assets/european-dep.webp';
        case 12: return '/assets/sculpture-dep.webp';
        case 13: return '/assets/greek-dep.webp';
        case 14: return '/assets/islamic-dep.webp';
        case 15: return '/assets/lehman-dep.webp';
        case 16: return '/assets/watson-dep.webp';
        case 17: return '/assets/medieval-dep.webp';
        case 18: return '/assets/musical-dep.webp';
        case 19: return '/assets/photographs-dep.webp';
        case 21: return '/assets/modern-dep.webp';
    }
}
////POORT INSTELLEN OM SERVER TE STARTEN//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});
