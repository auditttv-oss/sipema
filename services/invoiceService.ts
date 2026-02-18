import { supabase } from '../lib/supabase';
import { Invoice, InvoiceStatus } from '../types';

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('due_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateInvoice = async (invoice: Invoice): Promise<void> => {
  const { error } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', invoice.id);

  if (error) throw error;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const payInvoice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('invoices')
    .update({ status: InvoiceStatus.PAID })
    .eq('id', id);

  if (error) throw error;
};
