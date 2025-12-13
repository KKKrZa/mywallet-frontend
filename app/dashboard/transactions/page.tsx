import { TransactionsList } from "@/components/transactions-list"

export default function TransactionsPage() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <TransactionsList />
    </div>
  )
}