/* eslint react/prop-types: 0 */
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'

import Page from '../index'
import MessageCard from '../../message-card/'

storiesOf('Page', module)
  .addDecorator(withKnobs)
  .add('with text', () => (
    <Router>
      <Route path='/' component={props => (
        <Page
          title='Advanced Algos'
          subtitile='Development Platform'
          description='This is a description of the Advanced Algos Development Platform'
        >
          {console.log(props)}
          <MessageCard message={text('Message', 'This message is wrapped by a page component')} />
        </Page>
      )} />
    </Router>
  ))
