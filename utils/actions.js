'use server';

// All database access lives here and runs only on the server.
// Every action resolves the signed-in user from Clerk on the server and
// checks ownership, so a client can never read or change another user's data.

import { currentUser } from '@clerk/nextjs/server';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import moment from 'moment';
import { db } from './dbConfig';
import { Budgets, Expenses } from './schema';

async function requireEmail() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error('Not signed in');
  return email;
}

function cleanName(name) {
  const value = String(name ?? '').trim();
  if (!value || value.length > 100) throw new Error('Name must be 1-100 characters');
  return value;
}

function cleanAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0 || value > 1e12) throw new Error('Amount must be a positive number');
  return String(value);
}

function cleanId(id) {
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0) throw new Error('Invalid id');
  return value;
}

async function assertOwnsBudget(budgetId, email) {
  const rows = await db
    .select({ id: Budgets.id })
    .from(Budgets)
    .where(and(eq(Budgets.id, budgetId), eq(Budgets.createdBy, email)));
  if (rows.length === 0) throw new Error('Budget not found');
}

const budgetWithTotals = {
  ...getTableColumns(Budgets),
  totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
  totalItem: sql`count(${Expenses.id})`.mapWith(Number),
};

export async function hasBudgets() {
  const email = await requireEmail();
  const rows = await db.select({ id: Budgets.id }).from(Budgets).where(eq(Budgets.createdBy, email)).limit(1);
  return rows.length > 0;
}

export async function getBudgetList() {
  const email = await requireEmail();
  return db
    .select(budgetWithTotals)
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));
}

export async function getAllExpenses() {
  const email = await requireEmail();
  return db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    })
    .from(Expenses)
    .innerJoin(Budgets, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .orderBy(desc(Expenses.id));
}

export async function getBudgetInfo(budgetId) {
  const email = await requireEmail();
  const id = cleanId(budgetId);
  const rows = await db
    .select(budgetWithTotals)
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.id, id)))
    .groupBy(Budgets.id);
  return rows[0] ?? null;
}

export async function getExpensesList(budgetId) {
  const email = await requireEmail();
  const id = cleanId(budgetId);
  await assertOwnsBudget(id, email);
  return db.select().from(Expenses).where(eq(Expenses.budgetId, id)).orderBy(desc(Expenses.id));
}

export async function createBudget({ name, amount, icon }) {
  const email = await requireEmail();
  const rows = await db
    .insert(Budgets)
    .values({
      name: cleanName(name),
      amount: cleanAmount(amount),
      icon: String(icon ?? '').slice(0, 16),
      createdBy: email,
    })
    .returning({ insertedId: Budgets.id });
  return rows[0];
}

export async function updateBudget(budgetId, { name, amount, icon }) {
  const email = await requireEmail();
  const id = cleanId(budgetId);
  const rows = await db
    .update(Budgets)
    .set({ name: cleanName(name), amount: cleanAmount(amount), icon: String(icon ?? '').slice(0, 16) })
    .where(and(eq(Budgets.id, id), eq(Budgets.createdBy, email)))
    .returning({ id: Budgets.id });
  if (rows.length === 0) throw new Error('Budget not found');
  return rows[0];
}

export async function deleteBudget(budgetId) {
  const email = await requireEmail();
  const id = cleanId(budgetId);
  await assertOwnsBudget(id, email);
  await db.delete(Expenses).where(eq(Expenses.budgetId, id));
  await db.delete(Budgets).where(and(eq(Budgets.id, id), eq(Budgets.createdBy, email)));
  return true;
}

export async function addExpense(budgetId, { name, amount }) {
  const email = await requireEmail();
  const id = cleanId(budgetId);
  await assertOwnsBudget(id, email);
  const rows = await db
    .insert(Expenses)
    .values({
      name: cleanName(name),
      amount: cleanAmount(amount),
      budgetId: id,
      createdAt: moment().format('DD/MM/yyy'),
    })
    .returning({ insertedId: Expenses.id });
  return rows[0];
}

export async function deleteExpense(expenseId) {
  const email = await requireEmail();
  const id = cleanId(expenseId);
  const owned = await db
    .select({ id: Expenses.id })
    .from(Expenses)
    .innerJoin(Budgets, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Expenses.id, id), eq(Budgets.createdBy, email)));
  if (owned.length === 0) throw new Error('Expense not found');
  await db.delete(Expenses).where(eq(Expenses.id, id));
  return true;
}
