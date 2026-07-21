import React, { useState } from 'react';
import { FileText, Check, X } from 'lucide-react';
import { useSystem } from '../../../context/SystemContext';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../utils';

export function AdminProposals() {
  const { proposals, approveProposal, rejectProposal } = useSystem();
  const { user } = useAuth();
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  const pendingProposals = proposals.filter(p => p.status === 'Pending');

  const renderDiff = (oldData: any, newData: any) => {
    const keys = Object.keys(newData);
    return (
      <div className="space-y-3 mt-4 text-sm bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-[var(--color-border)]">
        {keys.map(key => {
          if (!oldData || oldData[key] !== newData[key]) {
            return (
              <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="font-medium capitalize text-gray-500">{key}:</div>
                <div>
                  {oldData && <span className="line-through text-gray-400 mr-2">{oldData[key]}</span>}
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 px-1.5 rounded">{newData[key]}</span>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-[var(--color-primary)]" />
          Proposal Review
        </h1>
        <p className="text-sm font-medium text-gray-500">Review and approve treatment updates from agronomists.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {pendingProposals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No pending proposals in the queue.</div>
        ) : (
          pendingProposals.map(p => (
            <Card key={p.id}>
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="gray">Proposal #{p.id}</Badge>
                      <span className="text-xs text-gray-500">Submitted by {p.agronomistId} on {new Date(p.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      {p.newData.crop} - {p.newData.disease}
                    </h3>
                  </div>
                </div>

                {renderDiff(p.oldData, p.newData)}

                <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Reason for rejection (required if rejecting)" 
                      value={rejectReason[p.id] || ''}
                      onChange={e => setRejectReason({...rejectReason, [p.id]: e.target.value})}
                      className="w-full bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => rejectProposal(p.id, rejectReason[p.id] || 'No reason provided', user?.name || 'Admin')}
                      disabled={!rejectReason[p.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      onClick={() => approveProposal(p.id, user?.name || 'Admin')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-lg font-semibold transition-colors"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
