import { supabase } from '../lib/supabase';
import { Vendor } from '../types';

export const getVendors = async (): Promise<Vendor[]> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const addVendor = async (vendor: Omit<Vendor, 'id'>): Promise<Vendor> => {
  const { data, error } = await supabase
    .from('vendors')
    .insert(vendor)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateVendor = async (vendor: Vendor): Promise<void> => {
  const { error } = await supabase
    .from('vendors')
    .update(vendor)
    .eq('id', vendor.id);

  if (error) throw error;
};

export const deleteVendor = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
