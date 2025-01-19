import React from 'react'
import Skeleton from 'react-loading-skeleton'

const SkeletonCard = () => {
  return (
      <div className='card-skeleton'>
          <div className="img-side">
              <Skeleton circle width={30} height={30}/>
          </div>
          <div className="details-side">
              <Skeleton count={1} style={{marginTop : '10px', marginLeft : '-10px'}}/>
          </div>
      
    </div>
  )
}

export default SkeletonCard
