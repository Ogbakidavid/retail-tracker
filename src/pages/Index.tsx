
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";

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
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 2500,
      description: 'Client payment - Website design',
      category: 'Services',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'expense',
      amount: 450,
      description: 'Office supplies and equipment',
      category: 'Supplies',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'expense',
      amount: 85,
      description: 'Business lunch meeting',
      category: 'Meals',
      date: '2024-01-13'
    }
  ]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowTransactionForm(false);
  };

  if (showTransactionForm) {
    return (
      <TransactionForm 
        onSave={addTransaction}
        onCancel={() => setShowTransactionForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Tracker</h1>
          <p className="text-gray-600">Track your income & expenses</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="bg-white shadow-lg border-0 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${netProfit.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200 shadow-md animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">
                  ${totalIncome.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200 shadow-md animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800">
                  ${totalExpenses.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <IncomeExpenseChart 
            income={totalIncome} 
            expenses={totalExpenses} 
          />
          <ExpenseChart transactions={transactions} />
        </div>

        {/* Add Transaction Button */}
        <Button
          onClick={() => setShowTransactionForm(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>

        {/* Recent Transactions */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TransactionList transactions={transactions.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
