'use server';
import { db } from '@/db';
import { transactionsTable } from '@/db/schema';
import { transactionSchema } from '@/validation/transactionSchema';
import { auth } from '@clerk/nextjs/server';

type TransactionData = {
  amount: number;
  transactionDate: string;
  description: string;
  categoryId: number;
};

const userIdValidationError = {
  error: true,
  message: 'Unathorized',
};

export const createTransaction = async (data: TransactionData) => {
  const { userId } = await auth();
  if (!userId) return userIdValidationError;

  // return new Promise<{ error: boolean; message: string }>((resolve) =>
  //   resolve({
  //     error: true,
  //     message: 'something went wrong',
  //   })
  // );

  const validation = transactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      amount: data.amount.toString(),
      description: data.description,
      categoryId: data.categoryId,
      transactionDate: data.transactionDate,
    })
    .returning();

  return transaction;
};
