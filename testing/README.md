# Budget Tracker: Selenium + TestNG test suite

This folder holds the automated UI tests our team, **Test Titans** (Tagore Engineering College), wrote for the **Software Testing Hackathon by Ingage Technologies**.

| File | What it is |
|---|---|
| `selenium-testng/` | Maven project with the TestNG suite (`BudgetTracker_TestNG.java`) |
| `Budget Tracker Website Testcase.xlsx` | The test case sheet (BT01 to BT11), with login details removed |
| `Budget Tracker Website Testing using TestNG.mp4` | Screen recording of the full suite running and passing |

## Test cases

| ID | Scenario | Steps | Test data | Expected result | Status |
|---|---|---|---|---|---|
| BT01 | Open the site | Load the site and maximize the window | - | Landing page opens | Pass |
| BT02 | Sign in | Click **Get Started**, enter email and password, sign in | Clerk test user | User is signed in | Pass |
| BT03 | Open dashboard | Click **Dashboard** | - | User dashboard opens | Pass |
| BT04 | Create a budget | Budgets tab, **Create New Budget**, pick emoji, fill name and amount, create, open it | College, 2000 | Budget appears in the list | Pass |
| BT05 | Add expenses | Fill expense name and amount, **Add New Expense** (x3) | Notes 600, Pens & Pencils 400, Cloud Account 700 | Expenses added to the budget | Pass |
| BT06 | Delete expenses | Delete "Cloud Account" and "Pens & Pencils" | - | Expenses removed | Pass |
| BT07 | Edit the budget | **Edit**, clear amount, enter new amount, **Update Budget** | 2500 | Budget amount updated | Pass |
| BT08 | Add more expenses | Add two more expenses | Pens & Pencils 700, Cloud Accounts 900 | Expenses added | Pass |
| BT09 | Navigate | Dashboard, Expenses, Budgets tabs, then open the College budget | - | Charts and expense lists show | Pass |
| BT10 | Delete the budget | **Delete**, then **Continue** | - | Budget deleted | Pass |
| BT11 | Sign out | Open the profile menu, **Sign out** | - | User is signed out | Pass |

In the original run all 10 TestNG methods passed (about 110 seconds end to end).

## Run the suite

You need Java 17+, Maven, Google Chrome, and a running copy of the app (see the main [README](../README.md)).

1. In the app's Clerk dashboard, create a **test user** with an email and password. Do not use your real account.
2. Set the environment variables and run Maven:

   ```bash
   # macOS / Linux
   export BT_BASE_URL=http://localhost:3000
   export BT_EMAIL=test-user@example.com
   export BT_PASSWORD='the-test-user-password'
   cd testing/selenium-testng
   mvn test
   ```

   ```powershell
   # Windows PowerShell
   $env:BT_BASE_URL = "http://localhost:3000"
   $env:BT_EMAIL = "test-user@example.com"
   $env:BT_PASSWORD = "the-test-user-password"
   cd testing/selenium-testng
   mvn test
   ```

3. Open `testing/selenium-testng/target/surefire-reports/index.html` for the TestNG report.

Set `BT_HEADLESS=true` to run Chrome without a window. Selenium Manager downloads the matching ChromeDriver for you, so there is no driver path to configure.

### Changes from the hackathon version

The original class hard-coded the login, the ChromeDriver path and the deployed URL, and used `Thread.sleep` between steps. This version:

- reads the URL and login from environment variables,
- uses explicit waits instead of fixed sleeps,
- uses Clerk's stable `cl-*` element classes instead of generated `cl-internal-*` hashes, which change between Clerk releases.

The element IDs and names the tests target (`getStartedBtn`, `budget_name`, `new_expense_btn`, `delete-<name>` and so on) are unchanged in the app.
