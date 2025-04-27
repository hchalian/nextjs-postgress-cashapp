import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getTransactionsByMonth } from '@/data/getTransactionsByMonth';
import { format } from 'date-fns';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import numeral from 'numeral';
import { Badge } from '@/components/ui/badge';
import Filters from './filters';
import getTransactionsYearsRange from '@/data/getTransactionsYearsRange';

const today = new Date();

const searchSchema = z.object({
  year: z.coerce
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear() + 1)
    .catch(today.getFullYear()),
  month: z.coerce
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1),
});

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const searchParamsValues = await searchParams;
  const { month, year } = searchSchema.parse(searchParamsValues);

  const selectedDate = new Date(year, month - 1, 1);

  const transactions = await getTransactionsByMonth({ month, year });

  const yearsRange = await getTransactionsYearsRange();

  return (
    <div className="max-w-screen-xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">DashBoard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Transactions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{format(selectedDate, 'MMM yyyy')} Transactions</span>
            <div>
              <Filters year={year} month={month} yearsRange={yearsRange} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={`/dashboard/transactions/new`}>New Transactions</Link>
          </Button>

          {!transactions?.length && (
            <p className="text-center py-10 text-lg text-muted-foreground">
              There are no transaction for this month
            </p>
          )}
          {transactions?.length && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(
                  ({
                    id,
                    transactionDate,
                    description,
                    transactionType,
                    category,
                    amount,
                  }) => (
                    <TableRow key={id}>
                      <TableCell>
                        {format(transactionDate, 'dd MMM yyy')}
                      </TableCell>
                      <TableCell>{description}</TableCell>
                      <TableCell className="capitalize">
                        <Badge
                          className={
                            transactionType === 'income'
                              ? 'bg-lime-500'
                              : 'bg-orange-500'
                          }
                        >
                          {transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>{category}</TableCell>
                      <TableCell>
                        ${numeral(amount).format('0,0[.]00')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={`outline`}
                          asChild
                          size="icon"
                          aria-label="Edit Transaction"
                        >
                          <Link href={`/dashboard/transactions/${id}`}>
                            <PencilIcon />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
