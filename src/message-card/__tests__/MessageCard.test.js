import React from 'react'
import renderer from 'react-test-renderer'

import { shallow } from '../../enzyme'

import MessageCard from '../index'

describe('MessageCard tests', () => {
  it('renders matching snapshot', () => {
    const tree = renderer
      .create(<MessageCard message='Renders correctly' />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders message', () => {
    const message = 'This is a test message'
    const wrapper = shallow(<MessageCard message={message} />)

    // Expect the wrapper object to be defined
    expect(wrapper.find('MessageCard')).toBeDefined()
    expect(wrapper.dive().dive().dive().find('h1'))
  })
})
