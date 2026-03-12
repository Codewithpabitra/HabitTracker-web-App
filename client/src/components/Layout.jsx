import React from 'react'
import Container from './container'
import Landing from '../Pages/Landing'

const Layout = () => {
  return (
    <div className='bg-zinc-900 text-neutral-100 h-auto min-h-screen w-full'>
       <Container>
        <Landing />
       </Container>
    </div>
  )
}

export default Layout