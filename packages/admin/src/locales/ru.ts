/* eslint-disable unicorn/filename-case */
/* cspell:disable */
export const ru = {
  auth: {
    signIn: {
      errors: { invalidCredentials: `Неверное имя пользователя или пароль`, unknownError: `Не удалось выполнить вход` },
      password: `Пароль`,
      submit: `Войти`,
      submitting: `Вход…`,
      title: `Вход`,
      username: `Имя пользователя`,
    },
  },
  layout: { signOutTip: `Выйти` },
  pager: { next: `Далее`, page: `Стр. {page} из {pageCount}`, prev: `Назад` },
  users: {
    edit: {
      balance: `Баланс`,
      delete: `Удалить`,
      deleteConfirm: `Удалить пользователя?`,
      email: `Email`,
      errors: { invalid: `Введите корректный баланс` },
      submit: `Сохранить`,
      submitting: `Сохранение…`,
      title: `Редактирование пользователя`,
    },
    list: {
      columns: {
        actions: `Действия`,
        balance: `Баланс`,
        createdAt: `Создан`,
        email: `Email`,
        emailVerified: `Подтверждён`,
      },
      editTip: `Редактировать`,
      title: `Пользователи`,
      verifiedNo: `Нет`,
      verifiedYes: `Да`,
    },
  },
};
