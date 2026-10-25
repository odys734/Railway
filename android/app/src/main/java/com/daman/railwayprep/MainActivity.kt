package com.daman.railwayprep

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.*

val NavyDark = Color(0xFF050814)
val NavySurface = Color(0xFF0A1128)
val ElectricTeal = Color(0xFF00E5FF)
val SlateBorder = Color(0xFF1E293B)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RailwayPrepTheme {
                MainAppNavigation()
            }
        }
    }
}

@Composable
fun RailwayPrepTheme(content: @Composable () -> Unit) {
    val colorScheme = darkColorScheme(
        primary = ElectricTeal,
        onPrimary = Color(0xFF050814),
        surface = NavySurface,
        onSurface = Color.White,
        background = NavyDark,
        onBackground = Color.White
    )

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppNavigation() {
    val navController = rememberNavController()
    var selectedTab by remember { mutableStateOf("dashboard") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Railway Prep AI",
                            fontSize = 18.sp,
                            color = Color.White
                        )
                        Text(
                            text = "Made by Daman • RRB NTPC",
                            fontSize = 11.sp,
                            color = ElectricTeal
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = NavySurface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = NavySurface
            ) {
                NavigationBarItem(
                    selected = selectedTab == "dashboard",
                    onClick = { selectedTab = "dashboard" },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = ElectricTeal,
                        selectedTextColor = ElectricTeal,
                        indicatorColor = NavyDark
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == "practice",
                    onClick = { selectedTab = "practice" },
                    icon = { Icon(Icons.Default.Book, contentDescription = "Practice") },
                    label = { Text("Practice", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = ElectricTeal,
                        selectedTextColor = ElectricTeal,
                        indicatorColor = NavyDark
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == "cbt_mock",
                    onClick = { selectedTab = "cbt_mock" },
                    icon = { Icon(Icons.Default.Timer, contentDescription = "CBT Mock") },
                    label = { Text("CBT Mock", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = ElectricTeal,
                        selectedTextColor = ElectricTeal,
                        indicatorColor = NavyDark
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == "ai_tutor",
                    onClick = { selectedTab = "ai_tutor" },
                    icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "AI Tutor") },
                    label = { Text("AI Tutor", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = ElectricTeal,
                        selectedTextColor = ElectricTeal,
                        indicatorColor = NavyDark
                    )
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(NavyDark)
                .padding(innerPadding)
        ) {
            when (selectedTab) {
                "dashboard" -> AndroidDashboardView()
                "practice" -> AndroidPracticeView()
                "cbt_mock" -> AndroidMockExamView()
                "ai_tutor" -> AndroidAiTutorView()
            }
        }
    }
}

@Composable
fun AndroidDashboardView() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = NavySurface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Target: RRB NTPC Under-Graduate", color = ElectricTeal, fontSize = 12.sp)
                Spacer(modifier = Modifier.height(4.dp))
                Text("Welcome to Railway Prep AI", color = Color.White, fontSize = 20.sp)
                Text("Authentic CBT-1 Mock Simulator & AI Tutoring", color = Color.LightGray, fontSize = 12.sp)
            }
        }
    }
}

@Composable
fun AndroidPracticeView() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Subject Practice Engine", color = Color.White, fontSize = 18.sp)
    }
}

@Composable
fun AndroidMockExamView() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("RRB NTPC CBT-1 Exam Simulator (100 Qs / 90 Mins)", color = Color.White, fontSize = 18.sp)
    }
}

@Composable
fun AndroidAiTutorView() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Daman AI Railway Tutor (Gemini 3.8 Flash)", color = Color.White, fontSize = 18.sp)
    }
}
