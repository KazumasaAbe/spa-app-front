export default async function ({ $auth, store, route, redirect }) {
  const user = await store.$auth.$state.user
  console.log(user)
  if (!user.admin) {
    redirect('/')
  }
}
