import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { useToast } from "@/components/ui/use-toast"

interface Item {
  item_ID: number;
  item_name: string;
  item_type: string;
  est_weight: number;
}

interface Race {
  race_id: string;
  race_name: string;
}

interface AddRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestAdded: () => void;
  technicalHeadId: string | null;
}

export default function AddRequestDialog({ isOpen, onClose, onRequestAdded, technicalHeadId }: AddRequestDialogProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ id: number; quantity: number }[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
    fetchRaces();
  }, []);

  const fetchItems = async () => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch('/api/items', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchRaces = async () => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch('/api/races', {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRaces(data);
      } else {
        console.error('Failed to fetch races');
      }
    } catch (error) {
      console.error('Error fetching races:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}');
      const { username, password } = credentials;

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: JSON.stringify({
          requestId,
          raceId: selectedRace,
          items: selectedItems,
          technicalHeadId,
          username,
          password
        }),
      });

      if (response.ok) {
        toast({
          title: "Request added successfully",
          description: "The new request has been added to the system.",
        });
        onRequestAdded();
        onClose();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error adding request",
          description: errorData.message || "An error occurred while adding the request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding request:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="request-id" className="text-right">
              Request ID
            </label>
            <Input
              id="request-id"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="race" className="text-right">
              Race
            </label>
            <Select onValueChange={setSelectedRace} value={selectedRace}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a race" />
              </SelectTrigger>
              <SelectContent>
                {races.map((race) => (
                  <SelectItem key={race.race_id} value={race.race_id}>
                    {race.race_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="items" className="text-right">
              Items
            </label>
            <MultiSelect
              options={items.map(item => ({
                // label: `${item.item_name} (${item.item_type}, ${item.est_weight}kg)`,
                // value: item.item_ID.toString()
              }))}
              selected={selectedItems.map(item => item.id.toString())}
              onChange={(selected) => setSelectedItems(selected.map(id => ({ id: parseInt(id), quantity: 1 })))}
              className="col-span-3"
            />
          </div>
          {selectedItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={`quantity-${item.id}`} className="text-right">
                Quantity for {items.find(i => i.item_ID === item.id)?.item_name}
              </label>
              <Input
                id={`quantity-${item.id}`}
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newSelectedItems = [...selectedItems];
                  newSelectedItems[index].quantity = parseInt(e.target.value);
                  setSelectedItems(newSelectedItems);
                }}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
