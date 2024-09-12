import React from 'react'

const Status = () => {
  return (
    <main className="font-outfit">
    <div className="flex justify-between gap-[1em]">
      <div className="h-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
        <header>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-grey-primary">
              Recent Appliction
            </h1>
            <p className="font-medium text-primary-700">See All</p>
          </div>
          <thead className="border-b border-gray-200 text-gray-500 dark:text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Degree
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Action
              </th>
            </tr>
          </thead>
        </header>
      
      </div>
      <div className="h-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
        <header>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-grey-primary">
              Registration Status
            </h1>
          </div>
        </header>
        <div className="mt-[1em] flex flex-col gap-[1.2em]">
       
        </div>
      </div>
    </div>
  </main>
  )
}

export default Status