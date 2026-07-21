import React, { useState } from 'react';
import { FlaskConical, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useSystem, Proposal } from '../../../context/SystemContext';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../utils';

export function Proposals() {
  const { proposals, submitProposal } = useSystem();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    crop: '', disease: '', type: 'Chemical' as 'Chemical'|'Organic', dosage: '', safetyNotes: '', preventionTips: ''
  });

  const myProposals = proposals.filter(p => p.agronomistId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProposal({
      agronomistId: user?.id || 'unknown',
      newData: formData,
    });
    setShowModal(false);
    setFormData({ crop: '', disease: '', type: 'Chemical', dosage: '', safetyNotes: '', preventionTips: '' });
  };

  const renderDiff = (oldData: any, newData: any) => {
    const keys = Object.keys(newData);
    return (
      <div className="space-y-3 mt-4 text-sm">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 border-b border-[var(--color-border)] pb-2 mb-2">Proposed Changes</h4>
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col relative">
      <div className="flex justify-between items-end shrink-0 mt-4 md:mt-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-[var(--color-primary)]" />
            My Proposals
          </h1>
          <p className="text-sm font-medium text-gray-500">Track your submitted treatment updates.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Proposal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {myProposals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No proposals submitted yet.</div>
        ) : (
          myProposals.map(p => (
            <Card key={p.id}>
              <CardBody className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="gray">Proposal #{p.id}</Badge>
                    <span className="text-xs text-gray-500">{new Date(p.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <Badge variant={p.status === 'Approved' ? 'green' : p.status === 'Rejected' ? 'red' : 'amber'} className="flex items-center gap-1">
                    {p.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                    {p.status === 'Pending' && <Clock className="w-3 h-3" />}
                    {p.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                    {p.status}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {p.newData.crop} - {p.newData.disease}
                </h3>
                
                {p.status === 'Rejected' && p.rejectReason && (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-3 rounded-lg text-sm text-red-800 dark:text-red-400 mb-4">
                    <strong>Reason for rejection:</strong> {p.rejectReason}
                  </div>
                )}

                {renderDiff(p.oldData, p.newData)}
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <CardBody className="p-6 flex flex-col h-full">
              <h2 className="text-xl font-bold mb-4">New Treatment Proposal</h2>
              <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Crop</label>
                    <input required type="text" value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Disease</label>
                    <input required type="text" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2">
                    <option value="Chemical">Chemical</option>
                    <option value="Organic">Organic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Dosage & Method</label>
                  <textarea required rows={2} value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Safety Notes</label>
                  <textarea required rows={2} value={formData.safetyNotes} onChange={e => setFormData({...formData, safetyNotes: e.target.value})} className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Prevention Tips</label>
                  <textarea required rows={2} value={formData.preventionTips} onChange={e => setFormData({...formData, preventionTips: e.target.value})} className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-200 dark:bg-neutral-800 rounded-lg font-semibold">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded-lg font-semibold">Submit Proposal</button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
