package com.hackathon;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

/**
 * End-to-end Selenium + TestNG suite for the Budget Tracker app
 * (Software Testing Hackathon - Ingage, team "Test Titans").
 *
 * Configuration comes from environment variables so no secrets live in the code:
 *   BT_BASE_URL  site under test (default http://localhost:3000)
 *   BT_EMAIL     email of a Clerk test user that already exists
 *   BT_PASSWORD  password of that test user
 *   BT_HEADLESS  "true" to run Chrome without a window (e.g. in CI)
 */
public class BudgetTracker_TestNG {

    private static final String BASE_URL = env("BT_BASE_URL", "http://localhost:3000");
    private static final String BUDGET = "College";

    private WebDriver bt;
    private WebDriverWait wait;

    private static String env(String key, String fallback) {
        String value = System.getenv(key);
        return (value == null || value.isBlank()) ? fallback : value;
    }

    private WebElement visible(By by) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(by));
    }

    private void click(By by) {
        wait.until(ExpectedConditions.elementToBeClickable(by)).click();
    }

    private void type(By by, String text) {
        WebElement el = visible(by);
        el.clear();
        el.sendKeys(text);
    }

    private void addExpense(String name, String amount) {
        type(By.id("expense_name"), name);
        type(By.id("expense_amount"), amount);
        click(By.name("new_expense_btn"));
        visible(By.id("delete-" + name));
    }

    @BeforeTest
    public void Initialize_Budget_App_Testing() {
        ChromeOptions options = new ChromeOptions();
        if ("true".equalsIgnoreCase(env("BT_HEADLESS", "false"))) {
            options.addArguments("--headless=new", "--window-size=1920,1080");
        }
        // Selenium Manager resolves ChromeDriver automatically; no hard-coded driver path needed.
        bt = new ChromeDriver(options);
        wait = new WebDriverWait(bt, Duration.ofSeconds(30));

        bt.manage().deleteAllCookies();
        bt.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(60));
        bt.manage().window().maximize();

        // The free Neon database sleeps after 5 idle minutes; the first load wakes it up.
        bt.get(BASE_URL);
    }

    @Test(priority = 1)
    public void Sign_in_Process() {
        String email = System.getenv("BT_EMAIL");
        String password = System.getenv("BT_PASSWORD");
        Assert.assertNotNull(email, "Set BT_EMAIL to a Clerk test user's email");
        Assert.assertNotNull(password, "Set BT_PASSWORD to that test user's password");

        click(By.id("getStartedBtn"));

        // Clerk's stable element classes (cl-<element>) rather than generated cl-internal-* hashes.
        type(By.cssSelector(".cl-formFieldInput__identifier"), email);
        List<WebElement> pw = bt.findElements(By.cssSelector(".cl-formFieldInput__password"));
        if (pw.isEmpty() || !pw.get(0).isDisplayed()) {
            click(By.cssSelector(".cl-formButtonPrimary")); // two-step sign-in: continue to password
        }
        type(By.cssSelector(".cl-formFieldInput__password"), password);
        click(By.cssSelector(".cl-formButtonPrimary"));

        // After sign-in Clerk returns to the landing page, whose header now shows "Dashboard".
        visible(By.name("dashboard"));
    }

    @Test(priority = 2)
    public void Navigating_to_Dashboard() {
        click(By.name("dashboard"));
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test(priority = 3)
    public void Creating_Budget() {
        click(By.id("Budgets"));
        click(By.name("new_budget"));

        click(By.id("emoji_picker_btn"));
        // emoji-picker-react search box
        type(By.cssSelector("aside.EmojiPickerReact input"), "Student");
        visible(By.cssSelector("aside.EmojiPickerReact input")).sendKeys(Keys.ENTER);

        type(By.id("budget_name"), BUDGET);
        type(By.id("budget_amount"), "2000");
        click(By.name("create-budget-btn"));

        click(By.id(BUDGET));
        wait.until(ExpectedConditions.urlContains("/dashboard/expenses/"));
    }

    @Test(priority = 4)
    public void Add_Expenses() {
        addExpense("Notes", "600");
        addExpense("Pens & Pencils", "400");
        addExpense("Cloud Account", "700");
    }

    @Test(priority = 5)
    public void Delete_Expenses() {
        click(By.id("delete-Cloud Account"));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("delete-Cloud Account")));
        click(By.id("delete-Pens & Pencils"));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("delete-Pens & Pencils")));
    }

    @Test(priority = 6)
    public void Edit_Budget() {
        click(By.name("edit_budget"));
        type(By.id("budget_amount"), "2500");
        click(By.name("update-budget-btn"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "2500"));
    }

    @Test(priority = 7)
    public void Adding_Additional_Expenses() {
        addExpense("Pens & Pencils", "700");
        addExpense("Cloud Accounts", "900");
    }

    @Test(priority = 8)
    public void Navigating_Nav_Bar() {
        click(By.linkText("Dashboard"));
        wait.until(ExpectedConditions.urlMatches(".*/dashboard/?$"));
        click(By.linkText("Expenses"));
        wait.until(ExpectedConditions.urlContains("/dashboard/expenses"));
        click(By.linkText("Budgets"));
        wait.until(ExpectedConditions.urlContains("/dashboard/budgets"));
        click(By.id(BUDGET));
        wait.until(ExpectedConditions.urlContains("/dashboard/expenses/"));
    }

    @Test(priority = 9)
    public void Delete_Budget() {
        click(By.name("delete_budget"));
        click(By.name("delete_budget_confirmation_btn"));
        wait.until(ExpectedConditions.urlContains("/dashboard/budgets"));
    }

    @Test(priority = 10)
    public void Sign_out_Process() {
        click(By.cssSelector(".cl-userButtonTrigger"));
        click(By.cssSelector(".cl-userButtonPopoverActionButton__signOut"));
        visible(By.id("getStartedBtn"));
    }

    @AfterTest
    public void Finishing_Testing_Process() {
        if (bt != null) {
            bt.quit();
        }
    }
}
