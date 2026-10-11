package com.practicum.playlistmaker.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    // Заголовки экранов (YS Display Medium 22)
    titleLarge = TextStyle(
        fontWeight = FontWeight.Medium,
        fontSize = 22.sp,
    ),
    // Кнопки главного экрана (YS Display Medium 22)
    titleMedium = TextStyle(
        fontWeight = FontWeight.Medium,
        fontSize = 22.sp,
    ),
    // Пункты настроек и текст поиска (YS Display Regular 16)
    bodyLarge = TextStyle(
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
    ),
)
