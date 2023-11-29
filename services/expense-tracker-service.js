export default function ExpenseTracker(db){
    async function addExpense(categoryId,expense ,amount){
        await db.none('INSERT INTO expense (category_id, expense, amount, total) VALUES($1, $2, $3, $3)', [categoryId, expense, amount]);
    }

    async function allExpenses() {
        let result = await db.any(`
            SELECT
                e.id as expense_id,
                e.expense,
                e.amount,
                e.total,
                c.id as category_id,
                c.category_type
            FROM
                expense e
            INNER JOIN
                category c ON e.category_id = c.id
        `);
    
        return result;
    }    

    async function expensesForCategory(categoryId){
        let result = db.any('SELECT * FROM expense WHERE category_id = $1', [categoryId]);

        return result;
    }

    async function deleteExpense(expenseId){
        await db.none('DELETE FROM expense WHERE id = $1', [expenseId]);
    }

    async function getExpenseByName(expenseName){
        let result = await db.oneOrNone('SELECT * FROM expense WHERE expense = $1', [expenseName]);

        return result;
    }

    async function categoryTotals(){
        let result = await db.any(`
            SELECT
                c.id as category_id,
                c.category_type,
                COALESCE(SUM(e.amount), 0) as total
            FROM
                category c
            LEFT JOIN
                expense e ON c.id = e.category_id
            GROUP BY
                c.id, c.category_type
        `);

        return result;
    }

    return{
        addExpense,
        allExpenses,
        expensesForCategory,
        deleteExpense,
        categoryTotals,
        getExpenseByName
    }
}