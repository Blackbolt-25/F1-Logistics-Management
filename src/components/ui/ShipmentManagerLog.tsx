'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Shipment {
  shipment_id: string;
  shipment_type: string;
  start_location: string;
  race_id: string;
  race_name: string,
  request_id: string;
  estimated_delivery_date: string;
  actual_delivery_date: string | null;
  current_status: string;
}

export default function ShipmentManager() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [logisticsHeadId, setLogisticsHeadId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogisticsHeadId();
  }, []);

  useEffect(() => {
    if (logisticsHeadId) {
      fetchShipments();
    }
  }, [logisticsHeadId]);

  const fetchLogisticsHeadId = async () => {
    const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
    const { username, password } = credentials;

    try {
      const response = await fetch('/api/user/logisticsHeadId', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLogisticsHeadId(data.logisticsHeadId);
      } else {
        console.error('Failed to fetch logistics head ID');
      }
    } catch (error) {
      console.error('Error fetching logistics head ID:', error);
    }
  };

  const fetchShipments = async () => {
    if(!logisticsHeadId) return;
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch(`/api/shipments?logisticsHeadId=${logisticsHeadId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });

      if (response.ok) {
        const data = await response.json();
        setShipments(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch shipment data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching shipment data",
        variant: "destructive",
      });
    }
  };

  const updateShipment = async (shipmentId: string, updates: Partial<Shipment>) => {
    if (!logisticsHeadId) return;
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;
      const response = await fetch('/api/shipments/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: JSON.stringify({
          shipmentId,
          updates,
          logisticsHeadId
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Shipment updated successfully",
        });
        fetchShipments(); // Refresh the shipment data
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update shipment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating shipment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Shipments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shipment ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Race name</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Estimated Delivery</TableHead>
            <TableHead>Actual Delivery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.shipment_id}>
              <TableCell>{shipment.shipment_id}</TableCell>
              <TableCell>{shipment.shipment_type}</TableCell>
              <TableCell>{shipment.race_name}</TableCell>
              <TableCell>{shipment.request_id}</TableCell>
              <TableCell>{new Date(shipment.estimated_delivery_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={shipment.actual_delivery_date ? new Date(shipment.actual_delivery_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateShipment(shipment.shipment_id, { actual_delivery_date: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={shipment.current_status}
                  onValueChange={(value) => updateShipment(shipment.shipment_id, { current_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue>{shipment.current_status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button onClick={() => updateShipment(shipment.shipment_id, {})}>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
