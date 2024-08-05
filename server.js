
//// SERVER OPZETTEN///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Helper functie om JSON data op te halen uit url, omzetten naar object en retourneren
const fetchJson = async (url) => {
  const response = await fetch(url);
  return response.json();
};

////API'S DEFINIEREN EN BIJBEHORENDE DATA OPHALEN///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Endpoint URL's
const departmentsUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/departments';

// Haal de afdelingen op
// haalt de afdelingen op uit de departmentsUrl en retourneer de afdelingen
const fetchDepartments = async () => {
  const data = await fetchJson(departmentsUrl);
  return data.departments;
};

// Haal kunstwerken binnen een afdeling op
// haalt de objecten op uit de departmentId en retourneer de objecten
// departmentId is een parameter die de afdeling identificeert hierdoor kun je de objecten van een specifieke afdeling ophalen
// de objecten worden opgehaald uit de API en de eerste 10 objecten worden geretourneerd, dit gebeurt door de slice methode
const fetchDepartmentObjects = async (departmentId) => {
  const objectsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`;
  const data = await fetchJson(objectsUrl);
  return data.objectIDs.slice(0, 10); // Haal de eerste 10 objecten op
};

// Haal details van een individueel kunstwerk op
// haalt de details van een object op door het objectId te gebruiken als parameter en retourneer de details nadat deze zijn opgehaald
// hiermeee kun je de details van een specifiek object ophalen
const fetchObjectDetails = async (objectId) => {
  const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
  const data = await fetchJson(objectUrl);
  return data;
};

////POORT INSTELLEN OM SERVER TE STARTEN//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});
