import assert from 'assert';
import pgPromise from 'pg-promise';
import ExpenseTracker from '../services/expense-tracker-service.js';
import 'dotenv/config';

const password = process.env.Password;
const encodedPassword = encodeURIComponent(password);


const DATABASE_URL = `postgresql://postgres:${encodedPassword}@localhost:5432/expense_tracker`;

const connectionString = process.env.DATABASE_URL || DATABASE_URL;
const db = pgPromise()(connectionString);

describe("Expense Tracker Tests", function () {
    beforeEach(async function () {
        try {
            await db.none("DELETE FROM expense;");
        } catch (err) {
            console.log(err);
            throw err;
        }
    });

    it('should be able to add an expense', async function () {
        let expenseTrackerService = ExpenseTracker(db);

        await expenseTrackerService.addExpense(1,'Lunch' ,400);
        let expenses = await expenseTrackerService.allExpenses();

        assert.equal(1, expenses.length);
    })

    it('should get all expenses', async function () {
        let expenseTrackerService = ExpenseTracker(db);

        await expenseTrackerService.addExpense(1,'Lunch', 400);
        await expenseTrackerService.addExpense(2,'Groceries', 300);

        let expenses = await expenseTrackerService.allExpenses();

        assert.equal(2, expenses.length);
    });

    it('should get expenses for a specific category', async function () {
        let expenseTrackerService = ExpenseTracker(db);

        await expenseTrackerService.addExpense(1,'Date', 400);
        await expenseTrackerService.addExpense(2,'Electricity', 300);
        await expenseTrackerService.addExpense(1,'Airtime', 200);

        let expensesByCategory = await expenseTrackerService.expensesForCategory(1);

        assert.equal(2, expensesByCategory.length);
        assert.equal(1, expensesByCategory[0].category_id);
    });

    it('should delete an expense', async function () {
        let expenseTrackerService = ExpenseTracker(db);

        await expenseTrackerService.addExpense(1,'Lunch', 400);
        await expenseTrackerService.addExpense(2,'Takeaways', 300);

        let expenses = await expenseTrackerService.allExpenses();
        assert.equal(2, expenses.length);

        let expenseByName = await expenseTrackerService.getExpenseByName('Lunch');
        let expenseId = expenseByName.id;

        await expenseTrackerService.deleteExpense(expenseId);

        let newExpenses = await expenseTrackerService.allExpenses();

        assert.equal(1, newExpenses.length);
    });

    it('should get category totals', async function () {
        let expenseTrackerService = ExpenseTracker(db);

        await expenseTrackerService.addExpense(1,'Lunch', 400);
        await expenseTrackerService.addExpense(2,'Takeaways', 300);
        await expenseTrackerService.addExpense(1,'Airtime', 200);

        let categoryTotals = await expenseTrackerService.categoryTotals();
        let categoryTotalForWeekly = 0;
        
        categoryTotals.map(category => {
            if(category.category_id === 1){
                categoryTotalForWeekly = category.total;
            }
        })

        assert.equal(6, categoryTotals.length);
        assert.equal(600, categoryTotalForWeekly);
    });

    after(function () {
        db.$pool.end;
    });
});

