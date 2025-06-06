import { createFileRoute } from '@tanstack/react-router'
import { CreateTestCenterStoreContextProvider } from '@/features/createTestCenter/createTestCenterStore'
import { CreateTestCenterView } from '@/features/createTestCenter/CreateTestCenterView'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <CreateTestCenterStoreContextProvider>
      <CreateTestCenterView />
    </CreateTestCenterStoreContextProvider>
  )
}
