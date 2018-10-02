import React from 'react'
import { render } from 'react-dom'
import { MessageCard } from '../../src'

const App = () => (
  <MessageCard message='This is just a demo.' />
)

render(<App />, document.getElementById('root'))
