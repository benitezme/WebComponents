/* eslint react/prop-types: 0 */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'

import MessageCard from '../index'

storiesOf('MessageCard', module)
  .addDecorator(withKnobs)
  .add('with text', () => (
    <MessageCard message={text('Message', 'This is a message')} />
  ))
