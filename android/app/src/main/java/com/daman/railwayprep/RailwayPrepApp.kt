package com.daman.railwayprep

import android.app.Application
import com.daman.railwayprep.data.local.AppDatabase
import com.daman.railwayprep.data.repository.RailwayRepository

class RailwayPrepApp : Application() {

    val database: AppDatabase by lazy {
        AppDatabase.getDatabase(this)
    }

    val repository: RailwayRepository by lazy {
        RailwayRepository(
            questionDao = database.questionDao(),
            mockTestDao = database.mockTestDao()
        )
    }

    override fun onCreate() {
        super.onCreate()
    }
}
