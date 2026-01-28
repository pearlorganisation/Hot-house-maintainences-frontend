import React from 'react'
import Success from '../Success'

export default function page({params,searchParams}) {
  return (
    <div>
        <Success transId={searchParams.t}/>
    </div>
  )
}
