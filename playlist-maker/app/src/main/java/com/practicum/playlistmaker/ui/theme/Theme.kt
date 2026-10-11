package com.practicum.playlistmaker.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColors = lightColorScheme(
    primary = YpBlue,
    onPrimary = YpWhite,
    background = YpWhite,
    onBackground = YpBlack,
    surface = YpWhite,
    onSurface = YpBlack,
    surfaceVariant = YpLightGray,
    onSurfaceVariant = YpGray,
)

private val DarkColors = darkColorScheme(
    primary = YpBlue,
    onPrimary = YpWhite,
    background = YpBlack,
    onBackground = YpWhite,
    surface = YpBlack,
    onSurface = YpWhite,
    surfaceVariant = YpWhite,
    onSurfaceVariant = YpGray,
)

@Composable
fun PlaylistMakerTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        typography = Typography,
        content = content,
    )
}
