const app = express();
import express from 'express';

app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});



