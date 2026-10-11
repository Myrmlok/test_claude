# Playlist Maker (Jetpack Compose)

Android-приложение Playlist Maker: экраны «Главный», «Поиск», «Настройки» и навигация между ними.

## Как запустить

1. Откройте папку `playlist-maker` в Android Studio (Ladybug или новее).
2. Дождитесь синхронизации Gradle. Android Studio сама создаст `local.properties` с путём к SDK.
3. Запустите конфигурацию `app` на эмуляторе или устройстве (Android 8.0+, minSdk 26).

## Что сделано

### Задача 1. Экран поиска — `ui/search/SearchScreen.kt`
- Шапка со стрелкой «назад» и заголовком «Поиск».
- Поисковая строка на `BasicTextField`: высота 36dp, скругление 8dp, светло-серый фон.
- Пока запрос пустой, показывается подсказка «Поиск».
- В начале поля стоит иконка «лупа» (`Icons.Default.Search`), обработчик нажатия пока пустой.
- В конце поля стоит иконка «х» (`Icons.Default.Clear`). Она видна, когда запрос не пустой, и по нажатию очищает его и снимает фокус.
- Логику поиска оставили на потом: клавиша «Поиск» и иконка «лупа» вызывают пустой `onSearch`.

### Задача 2. Экран настроек — `ui/settings/SettingsScreen.kt`
- «Тёмная тема»: переключатель только свёрстан, тема не меняется.
- «Поделиться приложением»: `Intent.ACTION_SEND` + `Intent.createChooser`, открывается системный диалог шеринга.
- «Написать разработчикам»: `Intent.ACTION_SENDTO` с `mailto:`, в письме заполнены получатель, тема и текст.
- «Пользовательское соглашение»: `Intent.ACTION_VIEW` открывает в браузере оферту Яндекс Практикума.
- Все тексты, адрес почты, тема и тело письма, ссылка на оферту лежат в `res/values/strings.xml` и берутся через `stringResource()`.

> Адрес получателя письма хранится в строке `support_email` в `strings.xml`.

### Задача 3. Навигация — `navigation/`
- `PlaylistScreen.kt`: `enum class PlaylistScreen { Main, Search, Settings }`.
- `PlaylistHost.kt`: composable `PlaylistHost(navController)` с `NavHost`. Внутри него методы перехода
  `navigateToSearch()`, `navigateToSettings()`, `navigateBack()`; они передаются в экраны колбэками.
- `MainActivity` создаёт `NavController` через `rememberNavController()` и передаёт его в `PlaylistHost`.

## Структура

```
app/src/main/java/com/practicum/playlistmaker/
├── MainActivity.kt
├── navigation/
│   ├── PlaylistScreen.kt
│   └── PlaylistHost.kt
└── ui/
    ├── components/ScreenTopBar.kt
    ├── main/MainScreen.kt
    ├── search/SearchScreen.kt
    ├── settings/SettingsScreen.kt
    └── theme/ (Color.kt, Type.kt, Theme.kt)
```
