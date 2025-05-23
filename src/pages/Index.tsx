
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import ExpenseChart from "@/components/ExpenseChart";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  receiptUrl?: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tally It Easy
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Simple and intuitive expense tracking for everyone
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            size="lg"
            className="flex items-center space-x-2 mx-auto"
          >
            <LogIn className="w-5 h-5" />
            <span>Get Started - Sign In</span>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Track Your Expenses</h2>
            <p className="text-gray-600 mb-4">
              Easily log your income and expenses with our simple form. 
              Categorize transactions and upload receipts for better organization.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <TransactionForm 
                onTransactionAdded={() => {}} 
                disabled={true}
              />
              <div className="mt-4 text-center text-sm text-gray-500">
                Sign in to start tracking your transactions
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Visualize Your Data</h2>
            <p className="text-gray-600 mb-4">
              Get insights into your spending patterns with beautiful charts and graphs.
            </p>
            <div className="space-y-4">
              <IncomeExpenseChart transactions={[]} />
              <ExpenseChart transactions={[]} />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList transactions={[]} />
          <div className="mt-4 text-center text-sm text-gray-500">
            Sign in to view your transactions
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
