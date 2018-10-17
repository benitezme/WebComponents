/* eslint react/prop-types: 0 */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { withKnobs, text } from '@storybook/addon-knobs'

import { Button, Welcome } from '@storybook/react/demo'

import { MessageCard, ImageUpload } from '../src'
import { CropperDialog, DropZone, ImagePreview } from '../src/image-upload/components'

const placeholder = 'https://algobotcommstorage.blob.core.windows.net/aateammodule/aa-logo.png'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role='img' aria-label='so cool'>
        😀 😎 👍 💯
      </span>
    </Button>
  ))

storiesOf('MessageCard', module)
  .addDecorator(withKnobs)
  .add('with text', () => <MessageCard message={text('Message', 'This is a message')} />)

storiesOf('ImageUpload', module)
  .addDecorator(withKnobs)
  .add('with all props', () => (
    <ImageUpload
      handleUrl={action(url => console.log('handleUrl function', url))}
      fileName={text('fileName', 'test-avatar.jpg')}
      containerName={text('containerName', 'test-team')}
      existingImage={placeholder}
      cropRatio={1}
      cropContainer={{ x: 10, y: 10, width: 200, height: 200 }}
      cropPreviewBox={{ width: 350, height: 350 }}
      saveImageConfig={{
        quality: 0.6,
        maxWidth: 200,
        maxHeight: 200,
        autoRotate: true,
        mimeType: 'image/jpeg'
      }}
      AzureStorageUrl={text('AzureStorageUrl', 'https://algobotcommstorage.blob.core.windows.net/')}
      AzureSASURL={text('AzureSASURL', '?sv=2017-11-09&ss=b&srt=co&sp=rwlac&se=2019-01-01T14:53:55Z&st=2018-09-20T05:53:55Z&spr=https&sig=sDFrTdrN3hbTT1ugyFoDRjT4D1xZ%2BCz%2Bwouv50hHraA%3D')}
    />
  ))

const cropperRef = React.createRef()
const headers = new window.Headers({ 'Content-Type': 'text/plain' })
var options = {
  method: 'GET',
  headers: headers,
  mode: 'cors',
  cache: 'default'
}
const request = new window.Request(placeholder)
const downloadedImg = window.fetch(request, options).then((response) => {
  console.log('downloadedImg: ', response)
  return response.arrayBuffer().then((buffer) => {
    var base64Flag = 'data:image/jpeg;base64,'
    var imageStr = arrayBufferToBase64(buffer)

    return base64Flag + imageStr
  })
})

const arrayBufferToBase64 = (buffer) => {
  var binary = ''
  var bytes = [].slice.call(new Uint8Array(buffer))

  bytes.forEach((b) => { binary += String.fromCharCode(b) })

  return window.btoa(binary)
}

class LoadImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: null }
  }

  componentDidMount () {
    downloadedImg.then(data => this.setState({ data }))
  }

  render () {
    return this.props.children(this.state.data)
  }
}

storiesOf('ImageUpload Components', module)
  .addDecorator(withKnobs)
  .add('Image Preview component', () => (
    <ImagePreview handleChangeImage={action('Change clicked')} image={placeholder} />
  ))
  .add('DropZone component', () => (
    <DropZone onDrop={action('Image dropped or selected')} handleCancel={action('Change image cancelled')} />
  ))
  .add('Cropper Dialog component: open', () => (
    <LoadImage>
      {data => {
        console.log('CropperImg download: ', data)
        return (
          <CropperDialog
            open
            imgSrc={data}
            handleClose={action('Crop cancelled')}
            handleCrop={action('Cropped image to be uploaded to cloud storage')}
            handleCancel={action('Crop cancelled')}
            cropImagePreview={{ width: 350, height: 350 }}
            cropperRef={cropperRef}
            cropRatio={1}
          />
        )
      }
      }
    </LoadImage>
  ))
