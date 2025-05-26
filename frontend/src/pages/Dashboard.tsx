import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from '@/components/ui/card'

export default function Dashboard() {
  return (
    <div className="mt-5">
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

      <div className="my-10">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl tracking-tight transition-colors first:mt-0">
          Products
        </h2>

        <div className="mt-5 flex flex-wrap justify-between gap-4">
          <Card className="w-full md:w-[375px]">
            <CardHeader>
              <CardTitle>Total</CardTitle>
              <CardDescription>View and manage all products.</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>

          <Card className="w-full md:w-[375px]">
            <CardHeader>
              <CardTitle>Added This Month</CardTitle>
              <CardDescription>
                View products added in the this month.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>

          <Card className="w-full md:w-[375px]">
            <CardHeader>
              <CardTitle>Added This Week</CardTitle>
              <CardDescription>
                View products added in the this week.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="my-10">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl tracking-tight transition-colors first:mt-0">
          Chat Messages
        </h2>

        <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
          <Card className="w-full md:w-[375px]">
            <CardHeader>
              <CardTitle>Threads</CardTitle>
              <CardDescription>
                View and manage all chat threads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>

          <Card className="w-full md:w-[375px]">
            <CardHeader>
              <CardTitle>Average Messages per Thread</CardTitle>
              <CardDescription>
                View average messages per thread.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
