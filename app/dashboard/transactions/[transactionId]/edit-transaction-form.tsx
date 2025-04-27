'use client';

import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction-from';
import { type Category } from '@/types/Category';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updateTransaction } from './actions';
import { format } from 'date-fns';

export default function EditTransactionForm({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction: {
    id: number;
    categoryId: number;
    amount: string;
    description: string;
    transactionDate: string;
  };
}) {
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await updateTransaction({
      id: transaction.id,
      categoryId: data.categoryId,
      amount: data.amount,
      description: data.description,
      transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
    });

    if (result && 'error' in result) {
      toast.error(result.message);
      console.log('edf result ==>', result);
      return;
    }

    console.log('edf success result ==>', result);
    toast.success(`transaction Updated successfuly`);

    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`
    );
  };

  const defaultValue = {
    amount: Number(transaction.amount),
    categoryId: transaction.categoryId,
    description: transaction.description,
    transactionDate: new Date(transaction.transactionDate),
    transactionType:
      categories.find((category) => category.id === transaction.categoryId)
        ?.type ?? 'income',
  };

  return (
    <TransactionForm
      defaultValues={defaultValue}
      categories={categories}
      onSubmit={handleSubmit}
    />
  );
}
