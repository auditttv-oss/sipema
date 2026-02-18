import { supabase } from '../lib/supabase';
import { Lead } from '../types';

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addLead = async (lead: Omit<Lead, 'id'>): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateLead = async (lead: Lead): Promise<void> => {
  const { error } = await supabase
    .from('leads')
    .update(lead)
    .eq('id', lead.id);

  if (error) throw error;
};

export const deleteLead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
