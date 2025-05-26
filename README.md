# 🧾 SmartRetail Tracker

A mobile/web app that helps small business owners track **income and expenses** using **voice** or **photo input**, powered by **Supabase** (backend) and **Lovable AI** (frontend).

---

## 📦 Features

- 📸 Upload receipts or record voice notes to log transactions
- 📊 Income vs Expense bar chart visualization
- 🔐 User authentication via Supabase (email & password)
- 🧠 CAPTCHA protection using hCaptcha
- 🗄️ Supabase DB with RLS (Row-Level Security)
- 💾 File storage via Supabase bucket
- ⚙️ Automatic email confirmation and password strength check

---

## 🚀 Tech Stack

- **Frontend**: Lovable AI (No-code/Low-code AI tool)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Chart**: Recharts (React charting library)
- **CAPTCHA**: hCaptcha

---

## 🧱 Database Schema

```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  amount numeric,
  type text check (type in ('income', 'expense')),
  description text,
  date timestamp with time zone default now(),
  file_url text
); 

🔐 ##Supabase Auth Setup
Enable email confirmation

Enable Row-Level Security with these policies:

sql
Copy
Edit
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
  ON public.transactions 
  FOR DELETE 
  USING (auth.uid() = user_id);
Under Bot and Abuse Protection, select hCaptcha as your CAPTCHA provider.

Add your production hCaptcha site key in your frontend (Lovable):

ts
Copy
Edit
const HCAPTCHA_SITE_KEY = "YOUR-PROD-HCAPTCHA-SITE-KEY";

📊 Charts Example
Bar chart for income vs expenses:

ts
Copy
Edit
const data = [
  { name: 'Income', amount: income, fill: '#22c55e' },
  { name: 'Expenses', amount: expenses, fill: '#ef4444' }
];
🐛 Debug Fixes
TypeScript Error Fix – onTransactionAdded
Ensure TransactionFormProps interface includes:

ts
Copy
Edit
interface TransactionFormProps {
  onTransactionAdded: () => void;
  disabled: boolean;
}
TypeScript Error Fix – transactions not found
ts
Copy
Edit
interface IncomeExpenseChartProps {
  income: number;
  expenses: number;
}
🧪 Development Notes
You must replace the test hCaptcha key with a production key to avoid CAPTCHA failures.

On the free Supabase plan, leaked password protection can't be enabled via ALTER SYSTEM.

Use strong passwords, enable email verification, and CAPTCHA to mitigate risk.

👥 Author
Built by [Your Name] using Supabase and Lovable AI.
