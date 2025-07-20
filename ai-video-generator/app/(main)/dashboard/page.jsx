import React from 'react'
import ProjectList from './_components/VideoList' // Keep the filename for now to avoid breaking changes

function Dashboard() {
  return (
    <div>
      <h2 className='font-bold text-3xl'>My Projects</h2>
      <ProjectList/>
    </div>
  )
}
export default Dashboard