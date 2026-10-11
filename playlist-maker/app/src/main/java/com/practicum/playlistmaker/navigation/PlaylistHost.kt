package com.practicum.playlistmaker.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.practicum.playlistmaker.ui.main.MainScreen
import com.practicum.playlistmaker.ui.search.SearchScreen
import com.practicum.playlistmaker.ui.settings.SettingsScreen

@Composable
fun PlaylistHost(navController: NavHostController) {

    fun navigateTo(screen: PlaylistScreen) {
        navController.navigate(screen.name) {
            // Повторный клик не создаёт копию экрана в back stack
            launchSingleTop = true
        }
    }

    fun navigateToSearch() = navigateTo(PlaylistScreen.Search)

    fun navigateToSettings() = navigateTo(PlaylistScreen.Settings)

    fun navigateBack() {
        // Не даём закрыть стартовый экран двойным нажатием «назад»
        if (navController.previousBackStackEntry != null) {
            navController.popBackStack()
        }
    }

    NavHost(
        navController = navController,
        startDestination = PlaylistScreen.Main.name,
    ) {
        composable(PlaylistScreen.Main.name) {
            MainScreen(
                onSearchClick = { navigateToSearch() },
                onSettingsClick = { navigateToSettings() },
            )
        }
        composable(PlaylistScreen.Search.name) {
            SearchScreen(onBackClick = { navigateBack() })
        }
        composable(PlaylistScreen.Settings.name) {
            SettingsScreen(onBackClick = { navigateBack() })
        }
    }
}
