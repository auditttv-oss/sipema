export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: { Row: any; Insert: any; Update: any };
      clusters: { Row: any; Insert: any; Update: any };
      units: { Row: any; Insert: any; Update: any };
      residents: { Row: any; Insert: any; Update: any };
      invoices: { Row: any; Insert: any; Update: any };
      complaints: { Row: any; Insert: any; Update: any };
      leads: { Row: any; Insert: any; Update: any };
      vendors: { Row: any; Insert: any; Update: any };
      ledger_entries: { Row: any; Insert: any; Update: any };
      marketplace_items: { Row: any; Insert: any; Update: any };
      payments: { Row: any; Insert: any; Update: any };
      house_types: { Row: any; Insert: any; Update: any };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'RESIDENT' | 'ADMIN_CLUSTER' | 'SUPER_ADMIN' | 'TECHNICIAN';
      unit_status: 'Pemilik' | 'Penyewa' | 'Kosong';
      complaint_status: 'Pending' | 'Proses' | 'Selesai' | 'Ditolak';
    };
    CompositeTypes: Record<string, never>;
  };
};
