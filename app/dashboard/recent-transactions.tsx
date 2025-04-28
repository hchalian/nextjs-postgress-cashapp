import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentTransaction } from '@/data/getRecentTransactions';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import numeral from 'numeral';

export default async function RecentTransactions() {
  const recentTransacions = await getRecentTransaction();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Recent Transactions</span>
            <div className="flex gap-2">
              <Button asChild variant={'outline'}>
                <Link href={`/dashboard/transactions`}>View All</Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/transactions/new`}>Create New</Link>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!recentTransacions?.length && (
            <p className="text-center py-10 text-lg text-muted-foreground">
              You have no transactions yet.
            </p>
          )}
          {recentTransacions?.length && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransacions.map(
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
