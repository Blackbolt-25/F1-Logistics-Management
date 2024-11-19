'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit } from 'lucide-react'
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
import AddRequestDialog from './AddRequestDialog'
import UpdateRequestDialog from './UpdateRequestDialog'

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

export default function GetRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [technicalHeadId, setTechnicalHeadId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTechnicalHeadId();
  }, []);

  useEffect(() => {
    if (technicalHeadId) {
      fetchRequests();
    }
  }, [technicalHeadId]);

  const fetchTechnicalHeadId = async () => {
    const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
    const { username, password } = credentials;

    try {
      const response = await fetch('/api/user/technical-head-id', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTechnicalHeadId(data.technicalHeadId);
      } else {
        console.error('Failed to fetch technical head ID');
      }
    } catch (error) {
      console.error('Error fetching technical head ID:', error);
    }
  };

  const fetchRequests = async () => {
    if (!technicalHeadId) return;

    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch(`/api/requests?technicalHeadId=${technicalHeadId}`, {
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

  const handleAddRequest = () => {
    setIsAddDialogOpen(true);
  };

  const handleUpdateRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsUpdateDialogOpen(true);
  };

  const handleRemoveRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa(`${JSON.parse(sessionStorage.getItem('credentials') || '{}').username}:${JSON.parse(sessionStorage.getItem('credentials') || '{}').password}`)
        }
      });

      if (response.ok) {
        toast({
          title: "Request removed successfully",
          description: "The request has been removed from the system.",
        });
        fetchRequests(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast({
          title: "Error removing request",
          description: errorData.message || "An error occurred while removing the request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error removing request:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Requests</h2>
        <Button onClick={handleAddRequest} className="bg-black text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Request
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your requests</TableCaption>
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
                <Button variant="outline" size="sm" onClick={() => handleUpdateRequest(request)} className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                {request.status === 'Pending' && (
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveRequest(request.request_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddRequestDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onRequestAdded={fetchRequests}
        technicalHeadId={technicalHeadId}
      />
      <UpdateRequestDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onRequestUpdated={fetchRequests}
        req={selectedRequest}
      />
    </div>
  )
}
