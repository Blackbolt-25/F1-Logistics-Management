'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Edit } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import UpdateFinancialRequestDialog from './UpdateFinancialRequestDialog'

interface Request {
  request_id: string;
  time_of_request: string;
  race_id: string,
  race_name: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  requester_id: string;
  design_approver_id: string | null;
  design_comments: string | null;
  finance_approver_id: string | null;
  financial_comments: string | null;
  cost: number | null;
}

export default function FinancialHeadRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [financialHeadId, setFinancialHeadId] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialHeadId();
  }, []);

  useEffect(() => {
    if (financialHeadId) {
      fetchRequests();
    }
  }, [financialHeadId]);

  const fetchFinancialHeadId = async () => {
    const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
    const { username, password } = credentials;

    try {
      const response = await fetch('/api/user/financial-head-id', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFinancialHeadId(data.financialHeadId);
      } else {
        console.error('Failed to fetch financial head ID');
      }
    } catch (error) {
      console.error('Error fetching financial head ID:', error);
    }
  };

  const fetchRequests = async () => {
    if (!financialHeadId) return;

    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch(`/api/financial`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleUpdateRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Requests</h2>
      </div>
      <Table>
        <TableCaption>A list of requests for financial approval</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Time of Request</TableHead>
            <TableHead>Race Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requester ID</TableHead>
            <TableHead>Design Approver ID</TableHead>
            <TableHead>Design Comments</TableHead>
            <TableHead>Finance Approver ID</TableHead>
            <TableHead>Financial Comments</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.request_id}>
              <TableCell>{request.request_id}</TableCell>
              <TableCell>{new Date(request.time_of_request).toLocaleString()}</TableCell>
              <TableCell>{request.race_name}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>{request.requester_id}</TableCell>
              <TableCell>{request.design_approver_id || 'N/A'}</TableCell>
              <TableCell>{request.design_comments || 'N/A'}</TableCell>
              <TableCell>{request.finance_approver_id || 'N/A'}</TableCell>
              <TableCell>{request.financial_comments || 'N/A'}</TableCell>
              <TableCell>{request.cost ? `$${request.cost}` : 'N/A'}</TableCell>
              <TableCell>
                {request.status !== 'Approved' && (
                  <Button variant="outline" size="sm" onClick={() => handleUpdateRequest(request.request_id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedRequestId && (
        <UpdateFinancialRequestDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          onRequestUpdated={fetchRequests}
          requestId={selectedRequestId}
          financialHeadId={financialHeadId}
        />
      )}
    </div>
  )
}
