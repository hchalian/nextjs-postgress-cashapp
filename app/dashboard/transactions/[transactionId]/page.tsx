import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import EditTransactionForm from './edit-transaction-form';
import { getCategories } from '@/data/getCategories';
import { getTransaction } from '@/data/getTransaction';
import { notFound } from 'next/navigation';
import DeleteTransactionDialog from './delete-transaction-dailog';

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const paramsValues = await params;

  const transactionId = Number(paramsValues.transactionId);
  if (isNaN(transactionId)) return notFound();

  const categories = await getCategories();
  const transaction = await getTransaction(transactionId);

  if (!transaction) return notFound();

  return (
    <Card className="mt-4 max-w-screen-md">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <DeleteTransactionDialog
            transactionId={transactionId}
            transactionDate={transaction.transactionDate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditTransactionForm
          categories={categories}
          transaction={transaction}
        />
      </CardContent>
    </Card>
  );
}
