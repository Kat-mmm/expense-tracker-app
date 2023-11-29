export default function ExpenseTrackerRoutes(expenseService){
    async function getIndex(req, res) {
        let totals = await expenseService.categoryTotals();

        //Calculating the total expenses from all the totals
        const grandTotal = totals.reduce((acc, expense) => {
            return acc + parseInt(expense.total, 10);
        }, 0);

        res.render('index', {totals, grandTotal});
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

    async function removeExpense(req, res) {
        await expenseService.deleteExpense(req.params.expenseId);

        res.redirect('/expenses/all')

    }

    return{
        addExpenseRoute,
        getIndex,
        getAllExpenses,
        removeExpense
    }
}