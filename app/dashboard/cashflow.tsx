import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnnualCashflow } from '@/data/getAnnualCashflow';
import CashFlowFilters from './cashflow-filters';
import getTransactionsYearsRange from '@/data/getTransactionsYearsRange';
import CashflowContent from './transactions/cashflow-content';

export default async function CashFlow({ year }: { year: number }) {
  const [cashflow, yearsRange] = await Promise.all([
    getAnnualCashflow(year),
    getTransactionsYearsRange(),
  ]);

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <CashFlowFilters yearsRange={yearsRange || []} year={year} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_250px]">
        <CashflowContent annualCashFlow={cashflow} />
      </CardContent>
    </Card>
  );
}
