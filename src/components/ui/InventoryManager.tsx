'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface InventoryItem {
  inventory_id: string;
  item_id: number;
  item_name: string;
  quantity: number;
}

export default function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch('/api/inventory', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch inventory data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching inventory data",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (inventoryId: string, newQuantity: number) => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch(`/api/inventory/${inventoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Inventory updated successfully",
        });
        fetchInventory(); // Refresh the inventory data
      } else {
        toast({
          title: "Error",
          description: "Failed to update inventory",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating inventory",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Team Inventory</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.inventory_id}>
              <TableCell>{item.item_name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateQuantity(item.inventory_id, item.quantity - 1)}
                    disabled={item.quantity <= 0}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.inventory_id, parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Button
                    onClick={() => updateQuantity(item.inventory_id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
