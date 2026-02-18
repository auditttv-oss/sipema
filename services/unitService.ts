import { supabase } from '../lib/supabase';
import { UnitData } from '../types';

export const getUnits = async (): Promise<UnitData[]> => {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('cluster');

  if (error) throw error;
  return data || [];
};

export const addUnit = async (unit: Omit<UnitData, 'id'>): Promise<UnitData> => {
  const { data, error } = await supabase
    .from('units')
    .insert(unit)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUnit = async (unit: UnitData): Promise<void> => {
  const { error } = await supabase
    .from('units')
    .update(unit)
    .eq('id', unit.id);

  if (error) throw error;
};

export const deleteUnit = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('units')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
