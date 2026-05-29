/** Map a persisted user row to `UserContext` profile shape. */
export function dbUserToProfile(user) {
  if (!user) return null
  return {
    userId: user.id,
    email: user.email,
    displayName: user.name,
    role: user.role,
    classLevel: user.classLevel ?? null,
    children: user.children ?? null,
    allCoursesUnlocked: !!user.allCoursesUnlocked,
    purchaseInfo: user.purchaseInfo ?? null,
  }
}
