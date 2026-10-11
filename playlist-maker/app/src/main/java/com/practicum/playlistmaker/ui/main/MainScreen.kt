package com.practicum.playlistmaker.ui.main

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LibraryMusic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.practicum.playlistmaker.R
import com.practicum.playlistmaker.ui.theme.PlaylistMakerTheme
import com.practicum.playlistmaker.ui.theme.YpBlack
import com.practicum.playlistmaker.ui.theme.YpBlue
import com.practicum.playlistmaker.ui.theme.YpWhite

@Composable
fun MainScreen(
    onSearchClick: () -> Unit,
    onSettingsClick: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(YpBlue)
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text(
            text = stringResource(R.string.app_name),
            modifier = Modifier.padding(vertical = 10.dp),
            style = MaterialTheme.typography.titleLarge,
            color = YpWhite,
        )
        Spacer(modifier = Modifier.height(8.dp))
        MainMenuButton(
            text = stringResource(R.string.main_search),
            icon = Icons.Default.Search,
            onClick = onSearchClick,
        )
        MainMenuButton(
            text = stringResource(R.string.main_media_library),
            icon = Icons.Default.LibraryMusic,
            onClick = { /* Экран медиатеки появится позже */ },
        )
        MainMenuButton(
            text = stringResource(R.string.main_settings),
            icon = Icons.Default.Settings,
            onClick = onSettingsClick,
        )
    }
}

@Composable
private fun ColumnScope.MainMenuButton(
    text: String,
    icon: ImageVector,
    onClick: () -> Unit,
) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .weight(1f),
        shape = RoundedCornerShape(8.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = YpWhite,
            contentColor = YpBlack,
        ),
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(48.dp),
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = text, style = MaterialTheme.typography.titleMedium)
        }
    }
}

@Preview(showSystemUi = true)
@Composable
private fun MainScreenPreview() {
    PlaylistMakerTheme {
        MainScreen(onSearchClick = {}, onSettingsClick = {})
    }
}
