import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { withKnobs, text } from '@storybook/addon-knobs'
import { imgSrcToBlob } from 'blob-util'

import { Button, Welcome } from '@storybook/react/demo'

import { MessageCard, ImageUpload } from '../src'

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

const existingImage = imgSrcToBlob('https://algobotcommstorage.blob.core.windows.net/aateammodule/aa-logo.png', 'image/png')
console.log(existingImage)

storiesOf('ImageUpload', module)
  .addDecorator(withKnobs)
  .add('with all props', () => (
    <ImageUpload
      handleUrl={action(url => console.log('handleUrl function', url))}
      fileName={text('fileName', 'test-avatar.jpg')}
      containerName={text('containerName', 'test-team')}
      existingImage={'https://algobotcommstorage.blob.core.windows.net/aateammodule/aa-logo.png'}
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
