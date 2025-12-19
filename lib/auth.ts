import { supabase, type UserRole } from './supabase'

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function getUserRole(): Promise<UserRole | null> {
  const session = await getSession()
  if (!session) return null
  
  const profile = await getUserProfile(session.user.id)
  return profile?.role || null
}

export async function hasRole(requiredRoles: UserRole[]): Promise<boolean> {
  const role = await getUserRole()
  if (!role) return false
  return requiredRoles.includes(role)
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, fullName: string, role: UserRole = 'employer') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
