
import { useState, useCallback } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, TrendingUp, Calendar, Plus } from 'lucide-react';
import { Expense } from '@/types/expense';

export const Dashboard = () => {
  const {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByCategory,
    getMonthlyExpenses,
    getTotalExpenses,
    exportToCSV,
  } = useExpenses();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const categoryData = getExpensesByCategory();
  const monthlyData = getMonthlyExpenses();
  const totalExpenses = getTotalExpenses();
  const thisMonthExpenses = monthlyData[monthlyData.length - 1]?.amount || 0;
  const lastMonthExpenses = monthlyData[monthlyData.length - 2]?.amount || 0;
  const monthlyTrend = lastMonthExpenses > 0 
    ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
    : 0;

  const handleSaveExpense = useCallback((expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      setEditingExpense(null);
    } else {
      addExpense(expenseData);
    }
    setIsFormOpen(false);
  }, [editingExpense, updateExpense, addExpense]);

  const handleEditExpense = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingExpense(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingExpense(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onExportCSV={exportToCSV} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            description="All time spending"
            icon={DollarSign}
          />
          <StatsCard
            title="This Month"
            value={`$${thisMonthExpenses.toFixed(2)}`}
            description="Current month expenses"
            icon={Calendar}
            trend={{
              value: Math.abs(monthlyTrend),
              isPositive: monthlyTrend > 0
            }}
          />
          <StatsCard
            title="Categories"
            value={categoryData.length.toString()}
            description="Active spending categories"
            icon={TrendingUp}
          />
        </div>

        {/* Charts and Add Button */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ExpenseChart 
            categoryData={categoryData}
            monthlyData={monthlyData}
          />
          
          <div className="lg:col-span-1">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full h-24 text-lg" 
                  onClick={handleAddNew}
                  aria-label="Add new expense"
                >
                  <Plus className="h-6 w-6 mr-2" />
                  Add New Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" aria-describedby="expense-form-description">
                <div id="expense-form-description" className="sr-only">
                  Form to add or edit expense details including amount, description, category, and date
                </div>
                <ExpenseForm
                  onSave={handleSaveExpense}
                  onCancel={handleCloseForm}
                  expense={editingExpense || undefined}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Expense List */}
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={deleteExpense}
        />
      </main>
    </div>
  );
};
