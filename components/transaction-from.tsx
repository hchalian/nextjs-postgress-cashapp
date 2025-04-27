'use client';

import { useForm } from 'react-hook-form';
import { addDays, format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { type Category } from '@/types/Category';

export const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number().positive('Please select a category'),
  transactionDate: z.coerce
    .date()
    .max(addDays(new Date(), 1), 'Transaction date cannot be in the future'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 characters')
    .max(300, 'Description must contain a maximum of 300 characters'),
});

type Props = {
  categories: Category[];
  onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>;
  defaultValues?: {
    transactionType: 'income' | 'expense';
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date;
  };
};

export default function TransactionForm({
  categories,
  onSubmit,
  defaultValues,
}: Props) {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      categoryId: 0,
      description: '',
      transactionDate: new Date(),
      transactionType: 'income',
      ...defaultValues,
    },
  });

  const transactionType = form.watch('transactionType');
  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="grid grid-cols-2 gap-y-5 gap-x-2"
        >
          <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transactoin Type</FormLabel>
                <Select
                  onValueChange={(newValue) => {
                    field.onChange(newValue);
                    form.setValue('categoryId', 0);
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                  value={field.value.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transactionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('2020-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <Input {...field} type="number" />
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset
          disabled={form.formState.isSubmitting}
          className="mt-5 flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </fieldset>
      </form>
    </Form>
  );
}
