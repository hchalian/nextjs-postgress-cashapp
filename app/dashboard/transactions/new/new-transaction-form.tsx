'use client';

import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction-from';
import { type Category } from '@/types/Category';
import { z } from 'zod';
import { createTransaction } from './actions';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NewTransactionForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await createTransaction({
      amount: data.amount,
      transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
      categoryId: data.categoryId,
      description: data.description,
    });

    if ('error' in result) {
      toast.error(result.message);
    }

    if ('id' in result) {
      toast.success(`transaction created successfuly with ${result.id}`);
    }

    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`
    );
  };

  return <TransactionForm categories={categories} onSubmit={handleSubmit} />;
}
