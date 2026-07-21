import React, { createContext, useContext, useState } from 'react';
import { useToast } from '../components/ui/Toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'officer' | 'agronomist' | 'admin';
  region: string;
  status: 'active' | 'suspended';
  joinedDate: string;
}

export interface Treatment {
  id: string;
  crop: string;
  disease: string;
  type: 'Chemical' | 'Organic';
  dosage: string;
  safetyNotes: string;
  preventionTips: string;
}

export interface Proposal {
  id: string;
  agronomistId: string;
  treatmentId?: string; // If it's an edit
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectReason?: string;
  newData: Omit<Treatment, 'id'>;
  oldData?: Omit<Treatment, 'id'>;
  submittedAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

interface SystemContextType {
  users: User[];
  updateUserRole: (id: string, role: User['role']) => void;
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => void;

  treatments: Treatment[];
  
  proposals: Proposal[];
  submitProposal: (proposal: Omit<Proposal, 'id' | 'status' | 'submittedAt'>) => void;
  approveProposal: (id: string, actor: string) => void;
  rejectProposal: (id: string, reason: string, actor: string) => void;

  auditLogs: AuditLog[];
}

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Ramesh Patel', email: 'ramesh@example.com', role: 'farmer', region: 'Ahmedabad', status: 'active', joinedDate: '2026-01-15' },
  { id: 'u2', name: 'Suresh Kumar', email: 'suresh@example.com', role: 'farmer', region: 'Surat', status: 'active', joinedDate: '2026-02-20' },
  { id: 'u3', name: 'Dr. Anita Desai', email: 'anita@example.com', role: 'agronomist', region: 'Gujarat', status: 'active', joinedDate: '2025-11-05' },
  { id: 'u4', name: 'Vikram Singh', email: 'vikram@example.com', role: 'officer', region: 'Ahmedabad', status: 'active', joinedDate: '2025-10-12' },
  { id: 'u5', name: 'Priya Sharma', email: 'priya.admin@example.com', role: 'admin', region: 'HQ', status: 'active', joinedDate: '2024-05-01' },
];

const INITIAL_TREATMENTS: Treatment[] = [
  { id: 't1', crop: 'Tomato', disease: 'Early Blight', type: 'Chemical', dosage: 'Chlorothalonil 75% WP (2g/L)', safetyNotes: '7-day pre-harvest interval.', preventionTips: 'Crop rotation, avoid overhead watering.' },
  { id: 't2', crop: 'Tomato', disease: 'Early Blight', type: 'Organic', dosage: 'Copper Soap (10ml/L)', safetyNotes: 'Safe for organic. Wear gloves.', preventionTips: 'Ensure good air circulation.' },
  { id: 't3', crop: 'Potato', disease: 'Late Blight', type: 'Chemical', dosage: 'Mancozeb 75% WP (2.5g/L)', safetyNotes: 'Do not inhale dust.', preventionTips: 'Preventative spray in humid weather.' },
];

const INITIAL_PROPOSALS: Proposal[] = [
  { 
    id: 'p1', agronomistId: 'u3', status: 'Pending', submittedAt: '2026-10-18T10:00:00Z', 
    treatmentId: 't1',
    oldData: { crop: 'Tomato', disease: 'Early Blight', type: 'Chemical', dosage: 'Chlorothalonil 75% WP (2g/L)', safetyNotes: '7-day pre-harvest interval.', preventionTips: 'Crop rotation, avoid overhead watering.' },
    newData: { crop: 'Tomato', disease: 'Early Blight', type: 'Chemical', dosage: 'Chlorothalonil 75% WP (2g/L)', safetyNotes: '10-day pre-harvest interval recommended.', preventionTips: 'Crop rotation, avoid overhead watering.' }
  },
  { 
    id: 'p2', agronomistId: 'u3', status: 'Approved', submittedAt: '2026-10-10T14:30:00Z', 
    newData: { crop: 'Wheat', disease: 'Rust', type: 'Organic', dosage: 'Neem Oil Extract (5ml/L)', safetyNotes: 'Non-toxic.', preventionTips: 'Early detection is key.' }
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'a1', actor: 'Priya Sharma', action: 'Approved treatment proposal', target: 'Proposal #p2', timestamp: '2026-10-11T09:15:00Z' },
  { id: 'a2', actor: 'System', action: 'Automated backup completed', target: 'Database', timestamp: '2026-10-10T00:00:00Z' },
];

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [treatments, setTreatments] = useState<Treatment[]>(INITIAL_TREATMENTS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const { addToast } = useToast();

  const addAuditLog = (actor: string, action: string, target: string) => {
    setAuditLogs(prev => [{
      id: Date.now().toString(),
      actor, action, target,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const updateUserRole = (id: string, role: User['role']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    addAuditLog('Admin', 'User role changed', `User ${id} \u2192 ${role}`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        addAuditLog('Admin', `User ${newStatus}`, `User ${id}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('Admin', 'User deleted', `User ${id}`);
  };

  const submitProposal = (proposal: Omit<Proposal, 'id' | 'status' | 'submittedAt'>) => {
    const newProposal: Proposal = {
      ...proposal,
      id: `p${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setProposals(prev => [newProposal, ...prev]);
    addToast({ variant: 'success', title: 'Proposal Submitted', description: 'Your proposal is pending admin review.' });
  };

  const approveProposal = (id: string, actor: string) => {
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return;

    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    
    if (proposal.treatmentId) {
      setTreatments(prev => prev.map(t => t.id === proposal.treatmentId ? { ...t, ...proposal.newData } : t));
    } else {
      setTreatments(prev => [{ id: `t${Date.now()}`, ...proposal.newData }, ...prev]);
    }
    
    addAuditLog(actor, 'Approved treatment proposal', `Proposal #${id}`);
    addToast({ variant: 'success', title: 'Proposal Approved', description: 'The treatment library has been updated.' });
  };

  const rejectProposal = (id: string, reason: string, actor: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected', rejectReason: reason } : p));
    addAuditLog(actor, 'Rejected treatment proposal', `Proposal #${id}`);
    addToast({ variant: 'info', title: 'Proposal Rejected', description: 'The proposal has been rejected.' });
  };

  return (
    <SystemContext.Provider value={{
      users, updateUserRole, toggleUserStatus, deleteUser,
      treatments,
      proposals, submitProposal, approveProposal, rejectProposal,
      auditLogs
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}
