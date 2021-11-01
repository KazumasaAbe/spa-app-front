export default function ({ store, redirect }) {
  const user = store.getters['user_information/getUser']
  if (user && !user.admin) {
    redirect('/')
    store.dispatch(
      'flashMessage/showMessage',
      {
        message: '権限がありません',
        type: 'error',
        status: true
      }
    )
  } else if (!user) {
    redirect('/')
    store.dispatch(
      'flashMessage/showMessage',
      {
        message: 'ログインしてください',
        type: 'error',
        status: true
      }
    )
  }
}
