import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to register page for new users
  redirect('/register')
}
