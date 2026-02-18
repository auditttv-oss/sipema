import { Complaint, ComplaintStatus } from '../types';
import { MOCK_COMPLAINTS } from '../constants';

export const getComplaints = async (): Promise<Complaint[]> => {
  return Promise.resolve(MOCK_COMPLAINTS);
};

export const addComplaint = async (complaint: Omit<Complaint, 'id' | 'createdAt'>): Promise<Complaint> => {
  const newComplaint: Complaint = {
    ...complaint,
    id: getNextTicketSync(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  MOCK_COMPLAINTS.unshift(newComplaint);
  return Promise.resolve(newComplaint);
};

export const updateComplaintStatus = async (id: string, status: ComplaintStatus): Promise<void> => {
  const complaint = MOCK_COMPLAINTS.find(c => c.id === id);
  if (complaint) {
    complaint.status = status;
  }
  return Promise.resolve();
};

export const getNextTicket = async (): Promise<string> => {
  return Promise.resolve(getNextTicketSync());
};

const getNextTicketSync = (): string => {
  const ids = MOCK_COMPLAINTS.map(c => parseInt(c.id.split('-')[1]));
  const maxId = Math.max(...ids, 0);
  return `T-${String(maxId + 1).padStart(4, '0')}`;
};
