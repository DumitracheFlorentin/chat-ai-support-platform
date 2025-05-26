import { Button } from '@/components/ui/button'

export default function Navigation({
  setCurrentScreen,
  currentScreen,
}: {
  setCurrentScreen: (screen: string) => void
  currentScreen: string
}) {
  return (
    <ul className="my-5 flex items-center space-x-4 text-sm font-medium text-gray-500">
      <li>
        <Button
          className="cursor-pointer"
          variant={currentScreen === 'all' ? 'default' : 'outline'}
          onClick={() => setCurrentScreen('all')}
        >
          All Products
        </Button>
      </li>
      <li>
        <Button
          className="cursor-pointer"
          variant={currentScreen === 'add' ? 'default' : 'outline'}
          onClick={() => setCurrentScreen('add')}
        >
          Add Product(s)
        </Button>
      </li>
    </ul>
  )
}
