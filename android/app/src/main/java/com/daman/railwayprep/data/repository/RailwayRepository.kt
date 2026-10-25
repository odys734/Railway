package com.daman.railwayprep.data.repository

import com.daman.railwayprep.data.local.QuestionDao
import com.daman.railwayprep.data.local.MockTestDao
import com.daman.railwayprep.data.model.QuestionEntity
import com.daman.railwayprep.data.model.MockTestResultEntity
import kotlinx.coroutines.flow.Flow

class RailwayRepository(
    private val questionDao: QuestionDao,
    private val mockTestDao: MockTestDao
) {
    val allQuestions: Flow<List<QuestionEntity>> = questionDao.getAllQuestions()
    val bookmarkedQuestions: Flow<List<QuestionEntity>> = questionDao.getBookmarkedQuestions()
    val incorrectQuestions: Flow<List<QuestionEntity>> = questionDao.getIncorrectQuestions()
    val mockResults: Flow<List<MockTestResultEntity>> = mockTestDao.getAllResults()

    suspend fun insertQuestions(questions: List<QuestionEntity>) {
        questionDao.insertQuestions(questions)
    }

    suspend fun toggleBookmark(questionId: String, isBookmarked: Boolean) {
        questionDao.updateBookmark(questionId, isBookmarked)
    }

    suspend fun markIncorrect(questionId: String) {
        questionDao.updateIncorrectStatus(questionId, true)
    }

    suspend fun resolveIncorrect(questionId: String) {
        questionDao.updateIncorrectStatus(questionId, false)
    }

    suspend fun saveMockResult(result: MockTestResultEntity) {
        mockTestDao.insertResult(result)
    }

    suspend fun clearHistory() {
        mockTestDao.clearAll()
    }
}
