export default function ExpenseTrackerRoutes(expenseService){
    function getIndex(req, res) {
        res.render('index');
    }

    async function getAllExpenses(req, res) {
        let allExpenses = await expenseService.allExpenses();

        res.render('expenses', {expenses: allExpenses});
    }

    async function addExpenseRoute(req, res) {    
        try{
            await expenseService.addExpense(req.body.expenseCategory, req.body.description, req.body.amount);
        }
        catch(err){
            console.log(err);
        }
    
        res.redirect('/');
    }

    return{
        addExpenseRoute,
        getIndex,
        getAllExpenses
    }
}