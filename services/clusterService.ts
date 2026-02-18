import { supabase } from '../lib/supabase';
import { Cluster } from '../types';

export const getClusters = async (): Promise<Cluster[]> => {
  const { data, error } = await supabase
    .from('clusters')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const addCluster = async (cluster: Omit<Cluster, 'id'>): Promise<Cluster> => {
  const { data, error } = await supabase
    .from('clusters')
    .insert(cluster)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCluster = async (cluster: Cluster): Promise<void> => {
  const { error } = await supabase
    .from('clusters')
    .update(cluster)
    .eq('id', cluster.id);

  if (error) throw error;
};

export const deleteCluster = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clusters')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
