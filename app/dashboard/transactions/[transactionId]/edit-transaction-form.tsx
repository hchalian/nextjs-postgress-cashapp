'use client';

import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction-from';
import { type Category } from '@/types/Category';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    const result = {};

    if ('error' in result) {
      toast.error(result.message);
    }

    if ('id' in result) {
      toast.success(`transaction Updated successfuly`);
    }

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
