'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface UpdateFinancialRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestUpdated: () => void;
  requestId: string;
  financialHeadId: string | null;
}

export default function UpdateFinancialRequestDialog({
  isOpen,
  onClose,
  onRequestUpdated,
  requestId,
  financialHeadId
}: UpdateFinancialRequestDialogProps) {
  const [financialComments, setFinancialComments] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchExistingComments()
    }
  }, [isOpen, requestId])

  const fetchExistingComments = async () => {
    if (!requestId) return

    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}')
      const { username, password } = credentials

      const response = await fetch(`/api/requests/${requestId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFinancialComments(data.financial_comments || '')
      } else {
        console.error('Failed to fetch existing comments')
      }
    } catch (error) {
      console.error('Error fetching existing comments:', error)
    }
  }

  const handleSubmit = async (approved: boolean) => {
    if (!requestId || !financialHeadId) return

    setIsApproving(true)
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials') || '{}')
      const { username, password } = credentials

      const response = await fetch('/api/financial/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: JSON.stringify({
          requestId,
          financialComments,
          approved,
          financialHeadId
        }),
      })

      if (response.ok) {
        toast({
          title: approved ? "Request approved" : "Comments updated",
          description: approved ? "The request has been approved." : "The comments have been updated.",
        })
        onRequestUpdated()
        onClose()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error updating request",
          description: errorData.message || "An error occurred while updating the request.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Financial Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="financial-comments" className="text-right">
              Financial Comments
            </label>
            <Textarea
              id="financial-comments"
              value={financialComments}
              onChange={(e) => setFinancialComments(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleSubmit(false)} disabled={isApproving}>
            Update Comments
          </Button>
          <Button onClick={() => handleSubmit(true)} disabled={isApproving}>
            Approve Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
