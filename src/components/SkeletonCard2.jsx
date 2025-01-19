import React from 'react'
import Skeleton from "react-loading-skeleton";

const SkeletonCard2 = () => {
  return (
    <>
      <div className="card-skeleton2">
        <div className="img-side">
          <Skeleton
            count={3}
            style={{ marginTop: "10px", marginLeft: "-10px" }}
          />
        </div>
        <div className="details-side"></div>
        <Skeleton circle width={40} height={40} style={{marginTop: '20px'}} />
      </div>
    </>
  );
}

export default SkeletonCard2
