import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/ai/interview.context.jsx"
import { SubscriptionProvider } from "./features/subscription/subscription.context.jsx"

function App() {

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <InterviewProvider>
        <RouterProvider router={router} />
        </InterviewProvider>
      </SubscriptionProvider>
    </AuthProvider>
  )
  
}

export default App
