
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense, EXPENSE_CATEGORIES } from '@/types/expense';
import { Edit, Trash2, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseList = memo(({ expenses, onEdit, onDelete }: ExpenseListProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
      const monthMatch = monthFilter === 'all' || 
        new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' }) === monthFilter;
      return categoryMatch && monthMatch;
    });
  }, [expenses, categoryFilter, monthFilter]);

  const availableMonths = useMemo(() => {
    const months = [...new Set(expenses.map(expense => 
      new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    ))];
    return months.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [expenses]);

  const handleDeleteExpense = (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      onDelete(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {expenses.length === 0 ? 'No expenses yet. Add your first expense!' : 'No expenses match the current filters.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-medium">{expense.description}</h3>
                      <Badge variant="secondary" className="w-fit">
                        {expense.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>${expense.amount.toFixed(2)}</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(expense)}
                      aria-label={`Edit ${expense.description}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id, expense.description)}
                      aria-label={`Delete ${expense.description}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ExpenseList.displayName = 'ExpenseList';
