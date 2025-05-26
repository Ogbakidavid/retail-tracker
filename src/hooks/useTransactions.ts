
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  user_id: string;
}

export const useTransactions = () => {
  const { user } = useAuth();

  const { data: transactions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      return data as Transaction[];
    },
    enabled: !!user?.id,
  });

  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const totalBalance = totals.totalIncome - totals.totalExpenses;

  return {
    transactions,
    isLoading,
    error,
    refetch,
    totalBalance,
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
  };
};
