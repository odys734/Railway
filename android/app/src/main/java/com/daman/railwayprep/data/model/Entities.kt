package com.daman.railwayprep.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "questions")
data class QuestionEntity(
    @PrimaryKey val id: String,
    val subject: String,
    val topic: String,
    val difficulty: String,
    val questionText: String,
    val optionA: String,
    val optionB: String,
    val optionC: String,
    val optionD: String,
    val correctOptionIndex: Int, // 0..3
    val explanation: String,
    val shortcutTip: String?,
    val isBookmarked: Boolean = false,
    val isIncorrect: Boolean = false,
    val sourceTag: String? = "RRB NTPC Curated"
)

@Entity(tableName = "mock_test_results")
data class MockTestResultEntity(
    @PrimaryKey val id: String,
    val examTitle: String,
    val timestamp: Long,
    val totalQuestions: Int,
    val durationMinutes: Int,
    val timeSpentSeconds: Int,
    val score: Double,
    val maxScore: Int,
    val correctCount: Int,
    val incorrectCount: Int,
    val unansweredCount: Int,
    val accuracy: Int
)
