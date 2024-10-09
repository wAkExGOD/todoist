# Todo List

![image](https://github.com/user-attachments/assets/a26785d3-f9c7-4473-b4da-987cfdbf30e6)

## Описание проекта

Этот проект представляет собой простое приложение "Список дел", которое позволяет пользователям добавлять, удалять и отслеживать задачи. Приложение написано на TypeScript и поддерживает синхронизацию с Local Storage, что позволяет сохранять данные между сессиями.

## Функциональные требования

1. **Добавление задачи**
   - Поле ввода для заголовка
   - Поле ввода для описания
   - Кнопка "Добавить" для создания новой задачи

2. **Статус задачи**
   - Каждая задача имеет чекбокс, позволяющий отметить ее как выполненную или нет.

3. **Удаление задачи**
   - Возможность удаления задачи из списка.

4. **Сортировка задач**
   - Выполненные задачи отображаются после невыполненных.

5. **Фильтрация задач**
   - Фильтр "Только невыполненные", который скрывает выполненные задачи.

## Дополнительные функции

- **Специальное поведение кнопки "Удалить" на мобильных устройствах**
  - Убедитесь, что кнопка удаления интуитивно понятна и легко доступна на мобильных экранах.

- **Синхронизация с Local Storage**
  - Все задачи сохраняются в Local Storage, что позволяет восстанавливать список после перезагрузки страницы.

## Установка и запуск

- git clone https://github.com/wAkExGOD/react-typescript-todo-list.git .
- pnpm i
- pnpm dev
