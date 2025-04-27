'use client';

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { Trash2Icon } from 'lucide-react';
import { deleteTransaction } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DeleteTransactionDialog({
  transactionId,
  transactionDate,
}: {
  transactionId: number;
  transactionDate: string;
}) {
  const router = useRouter();

  const haldeDeletConfirm = async () => {
    const result = await deleteTransaction(transactionId);

    if (result?.error) {
      toast.error(result.message);
      return;
    }

    toast.success('transaction deleted');

    const [year, month] = transactionDate.split('_');
    router.push(`/dashboard/transactions?month=${month + 1}&year=${year}`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} size="icon">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This transaction will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={haldeDeletConfirm} variant={'destructive'}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
