import { supabase } from '../lib/supabase';
import { ClusterExpense } from '../types';

export const getExpenses = async (): Promise<ClusterExpense[]> => {
  const { data, error } = await supabase
    .from('cluster_expenses')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addExpense = async (expense: Omit<ClusterExpense, 'id'>): Promise<ClusterExpense> => {
  const { data, error } = await supabase
    .from('cluster_expenses')
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExpense = async (expense: ClusterExpense): Promise<void> => {
  const { error } = await supabase
    .from('cluster_expenses')
    .update(expense)
    .eq('id', expense.id);

  if (error) throw error;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cluster_expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
