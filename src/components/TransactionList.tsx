
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Camera } from "lucide-react";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  receiptUrl?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-2 p-4">
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        transactions.map((transaction) => (
          <Card 
            key={transaction.id}
            className="p-4 border-l-4 hover:shadow-md transition-shadow duration-200"
            style={{
              borderLeftColor: transaction.type === 'income' ? '#22c55e' : '#ef4444'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {transaction.type === 'income' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.receiptUrl && (
                      <>
                        <span>•</span>
                        <Camera className="w-3 h-3" />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`font-bold text-lg ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default TransactionList;
