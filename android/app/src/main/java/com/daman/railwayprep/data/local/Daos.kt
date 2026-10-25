package com.daman.railwayprep.data.local

import androidx.room.*
import com.daman.railwayprep.data.model.QuestionEntity
import com.daman.railwayprep.data.model.MockTestResultEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface QuestionDao {
    @Query("SELECT * FROM questions")
    fun getAllQuestions(): Flow<List<QuestionEntity>>

    @Query("SELECT * FROM questions WHERE subject = :subject")
    fun getQuestionsBySubject(subject: String): Flow<List<QuestionEntity>>

    @Query("SELECT * FROM questions WHERE isBookmarked = 1")
    fun getBookmarkedQuestions(): Flow<List<QuestionEntity>>

    @Query("SELECT * FROM questions WHERE isIncorrect = 1")
    fun getIncorrectQuestions(): Flow<List<QuestionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertQuestions(questions: List<QuestionEntity>)

    @Query("UPDATE questions SET isBookmarked = :bookmarked WHERE id = :questionId")
    suspend fun updateBookmark(questionId: String, bookmarked: Boolean)

    @Query("UPDATE questions SET isIncorrect = :incorrect WHERE id = :questionId")
    suspend fun updateIncorrectStatus(questionId: String, incorrect: Boolean)
}

@Dao
interface MockTestDao {
    @Query("SELECT * FROM mock_test_results ORDER BY timestamp DESC")
    fun getAllResults(): Flow<List<MockTestResultEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertResult(result: MockTestResultEntity)

    @Query("DELETE FROM mock_test_results")
    suspend fun clearAll()
}
