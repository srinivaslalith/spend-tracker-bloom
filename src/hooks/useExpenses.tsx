
import { useState, useEffect } from 'react';
import { Expense, EXPENSE_CATEGORIES } from '@/types/expense';

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 25.50,
    description: 'Lunch at cafe',
    category: 'Food & Dining',
    date: '2024-06-08',
    createdAt: '2024-06-08T12:30:00Z'
  },
  {
    id: '2',
    amount: 60.00,
    description: 'Gas station',
    category: 'Transportation',
    date: '2024-06-07',
    createdAt: '2024-06-07T08:15:00Z'
  },
  {
    id: '3',
    amount: 120.00,
    description: 'Grocery shopping',
    category: 'Shopping',
    date: '2024-06-06',
    createdAt: '2024-06-06T18:45:00Z'
  },
  {
    id: '4',
    amount: 15.99,
    description: 'Netflix subscription',
    category: 'Entertainment',
    date: '2024-06-05',
    createdAt: '2024-06-05T09:00:00Z'
  },
  {
    id: '5',
    amount: 85.00,
    description: 'Electricity bill',
    category: 'Bills & Utilities',
    date: '2024-06-04',
    createdAt: '2024-06-04T14:20:00Z'
  },
  {
    id: '6',
    amount: 45.00,
    description: 'Doctor visit',
    category: 'Healthcare',
    date: '2024-06-03',
    createdAt: '2024-06-03T10:30:00Z'
  }
];

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from localStorage or API
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      setExpenses(MOCK_EXPENSES);
      localStorage.setItem('expenses', JSON.stringify(MOCK_EXPENSES));
    }
    setLoading(false);
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedExpenses = [...expenses, newExpense];
    saveExpenses(updatedExpenses);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, ...updates } : expense
    );
    saveExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    saveExpenses(updatedExpenses);
  };

  const getExpensesByCategory = () => {
    return EXPENSE_CATEGORIES.map(category => ({
      category,
      amount: expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
    })).filter(item => item.amount > 0);
  };

  const getMonthlyExpenses = () => {
    const monthlyData: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => 
        [expense.date, expense.description, expense.category, expense.amount].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByCategory,
    getMonthlyExpenses,
    getTotalExpenses,
    exportToCSV,
  };
};
