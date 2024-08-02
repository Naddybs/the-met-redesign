// Hiermee maak je een nieuwe express app
// Deze app is een object met een aantal methodes die je kunt gebruiken om een server te maken en routes te definiëren
// Met import express from 'express'; importeer je de express module uit de node_modules map
const app = express();
import express from 'express';

// Hiermee geef je aan dat je de ejs templating engine wilt gebruiken
// De ejs templating engine is een manier om dynamische HTML pagina's te maken
// De server zoekt de ejs bestanden in de views map en de public map voor statische bestanden
app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Hiermee start je de server op poort 3000
// De server luistert naar requests op poort 3000 en geeft respones terug aan de client
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});



