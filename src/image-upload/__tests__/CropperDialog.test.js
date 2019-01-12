import React from 'react'
import renderer from 'react-test-renderer'
import { unwrap } from '@material-ui/core/test-utils'

import { shallow } from '../../enzyme'

import { CropperDialog } from '../components'

let handleCloseMock = jest.fn()
let handleCropMock = jest.fn()
let handleCancelMock = jest.fn()
const cropPreview = {
  width: 350,
  height: 350
}
const placeHolder =
  'https://aadevelop.blob.core.windows.net/module-web-components/assets/Superalgos-logo-horz-sm.jpg'

const ComponentNaked = unwrap(CropperDialog)

describe('CropperDialog tests', () => {
  it('with shallow', () => {
    const wrapper = shallow(
      <ComponentNaked
        open={false}
        imgSrc={placeHolder}
        handleClose={handleCloseMock}
        handleCrop={handleCropMock}
        handleCancel={handleCancelMock}
        cropImagePreview={cropPreview}
        cropperRef={e => this.instance()}
        cropRatio={1}
        classes={{
          dialogContainer: '',
          cropImageBox: ''
        }}
      />
    )
    console.log('shallow', wrapper.debug())
    expect(wrapper.find('CropperDialog')).toBeDefined()
  })

  it('renders matching snapshot with dialog closed', () => {
    const tree = renderer
      .create(
        <ComponentNaked
          open={false}
          imgSrc={placeHolder}
          handleClose={handleCloseMock}
          handleCrop={handleCropMock}
          handleCancel={handleCancelMock}
          cropImagePreview={cropPreview}
          cropperRef={e => this.instance()}
          cropRatio={1}
          classes={{
            dialogContainer: '',
            cropImageBox: ''
          }}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders matching snapshot with dialog open', () => {
    const tree = renderer
      .create(
        <ComponentNaked
          open={true}
          imgSrc={placeHolder}
          handleClose={handleCloseMock}
          handleCrop={handleCropMock}
          handleCancel={handleCancelMock}
          cropImagePreview={cropPreview}
          cropperRef={e => this.instance()}
          cropRatio={1}
          classes={{
            dialogContainer: '',
            cropImageBox: ''
          }}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders', () => {
    const wrapper = shallow(
      <CropperDialog
        open={false}
        imgSrc={placeHolder}
        handleClose={handleCloseMock}
        handleCrop={handleCropMock}
        handleCancel={handleCancelMock}
        cropImagePreview={cropPreview}
        cropperRef={e => this.instance()}
        cropRatio={1}
        classes={{
          dialogContainer: '',
          cropImageBox: ''
        }}
      />
    )

    // Expect the wrapper object to be defined
    expect(wrapper.find('CropperDialog')).toBeDefined()
  })
})
