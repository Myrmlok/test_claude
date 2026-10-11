package com.practicum.playlistmaker.ui.settings

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.SupportAgent
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.practicum.playlistmaker.R
import com.practicum.playlistmaker.ui.components.ScreenTopBar
import com.practicum.playlistmaker.ui.theme.PlaylistMakerTheme
import com.practicum.playlistmaker.ui.theme.YpBlue
import com.practicum.playlistmaker.ui.theme.YpGray
import com.practicum.playlistmaker.ui.theme.YpLightGray

@Composable
fun SettingsScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current

    val shareMessage = stringResource(R.string.share_app_message)
    val supportEmail = stringResource(R.string.support_email)
    val emailSubject = stringResource(R.string.support_email_subject)
    val emailBody = stringResource(R.string.support_email_body)
    val userAgreementUrl = stringResource(R.string.user_agreement_url)
    val noAppMessage = stringResource(R.string.no_app_to_handle)

    // Переключатель только свёрстан, логика смены темы будет позже
    var darkThemeEnabled by rememberSaveable { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding(),
    ) {
        ScreenTopBar(
            title = stringResource(R.string.settings_title),
            onBackClick = onBackClick,
        )
        Column(modifier = Modifier.padding(top = 24.dp)) {
            SettingsItem(
                text = stringResource(R.string.settings_dark_theme),
                onClick = { darkThemeEnabled = !darkThemeEnabled },
            ) {
                Switch(
                    checked = darkThemeEnabled,
                    onCheckedChange = { darkThemeEnabled = it },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = YpBlue,
                        checkedTrackColor = YpBlue.copy(alpha = 0.5f),
                        uncheckedThumbColor = YpGray,
                        uncheckedTrackColor = YpLightGray,
                        uncheckedBorderColor = YpLightGray,
                    ),
                )
            }
            SettingsItem(
                text = stringResource(R.string.settings_share_app),
                icon = Icons.Default.Share,
                onClick = { context.shareApp(shareMessage, noAppMessage) },
            )
            SettingsItem(
                text = stringResource(R.string.settings_write_to_developers),
                icon = Icons.Default.SupportAgent,
                onClick = {
                    context.writeToDevelopers(supportEmail, emailSubject, emailBody, noAppMessage)
                },
            )
            SettingsItem(
                text = stringResource(R.string.settings_user_agreement),
                icon = Icons.AutoMirrored.Filled.ArrowForwardIos,
                onClick = { context.openUrl(userAgreementUrl, noAppMessage) },
            )
        }
    }
}

@Composable
private fun SettingsItem(
    text: String,
    onClick: () -> Unit,
    icon: ImageVector? = null,
    trailing: (@Composable () -> Unit)? = null,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(61.dp)
            .clickable(onClick = onClick)
            .padding(start = 16.dp, end = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = text,
            modifier = Modifier.weight(1f),
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        when {
            trailing != null -> trailing()
            icon != null -> Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier
                    .padding(4.dp)
                    .size(16.dp),
                tint = YpGray,
            )
        }
    }
}

private fun Context.shareApp(message: String, noAppMessage: String) {
    val sendIntent = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_TEXT, message)
    }
    startActivitySafely(Intent.createChooser(sendIntent, null), noAppMessage)
}

private fun Context.writeToDevelopers(
    email: String,
    subject: String,
    body: String,
    noAppMessage: String,
) {
    val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
        data = Uri.parse("mailto:")
        putExtra(Intent.EXTRA_EMAIL, arrayOf(email))
        putExtra(Intent.EXTRA_SUBJECT, subject)
        putExtra(Intent.EXTRA_TEXT, body)
    }
    startActivitySafely(emailIntent, noAppMessage)
}

private fun Context.openUrl(url: String, noAppMessage: String) {
    startActivitySafely(Intent(Intent.ACTION_VIEW, Uri.parse(url)), noAppMessage)
}

private fun Context.startActivitySafely(intent: Intent, noAppMessage: String) {
    try {
        startActivity(intent)
    } catch (e: ActivityNotFoundException) {
        Toast.makeText(this, noAppMessage, Toast.LENGTH_SHORT).show()
    }
}

@Preview(showSystemUi = true)
@Composable
private fun SettingsScreenPreview() {
    PlaylistMakerTheme {
        SettingsScreen(onBackClick = {})
    }
}
