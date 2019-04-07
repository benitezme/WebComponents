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
          title='Superalgos project'
          subtitile='Development Platform'
          description='This is a description of the Superalgos Development Platform'
        >
          <MessageCard message={text('Message', 'This message is wrapped by a page component. Check header source to see inserted metadata.')} />
        </Page>
      )} />
    </Router>
  ))
