import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import ExpenseTracker from './services/expense-tracker-service.js';
import ExpenseTrackerRoutes from './routes/expense-tracker-routes.js';
import db from './config.js';

let expenseTrackerService = ExpenseTracker(db);
let expenseRoutes = ExpenseTrackerRoutes(expenseTrackerService);


let app = express();

app.engine('handlebars', engine({ 
    defaultLayout: false,
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.get('/', expenseRoutes.getIndex);
app.get('/expenses/all', expenseRoutes.getAllExpenses);
app.post('/expense/add', expenseRoutes.addExpenseRoute);

let PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log('App running on port ' + PORT);
});
