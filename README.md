# Superalgos Web Components
[![npm version](https://badge.fury.io/js/%40superalgos%2Fweb-components.svg)](https://badge.fury.io/js/%40superalgos%2Fweb-components)

## Introduction

The is a repository for shared React web components between the Superalgos platform modules.


* [Installation](#installation)
* [Usage](#usage)
  * [Message Card](#message-card)
    * [Message Card Configuration Options](#message-card-configuration-options)
  * [Image Upload](#image-upload)
    * [Image Upload Configuration Options](#image-upload-configuration-options)
    * [Image Upload Default Values](#image-upload-default-values)
    * [Image Upload Full Example](#image-upload-full-example)
  * [Page](#page)
    * [Page Configuration Options](#page-configuration-options)
* [Developing This Package](#developing-this-package)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install @superalgos/web-components
```

# Usage

## MessageCard
The Message Card is a simple component for outputting a message within a card. Great for using as a placeholder or adding simple formatting to error and loading messages.

```javascript
import React from 'react'
import { MessageCard } from '@superalgos/web-components'

export const YourComponent = () => (
  <div>
    <MessageCard message='A message!' />
    <MessageCard message='That can also wrap other components' >
      <div className='loader'>Loading...</div>
    </MessageCard>
  </div>
)
```
#### Message Card Configuration Options
| Props                | Type                                                            | Default | Note                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`         | String | ---  | Display any string |
| `<children>`        | Node                                                          | ---  | Can accept children nodes.                                                                                                |


## Image Upload
Image Upload is a complex multi-functional component that encompasses allowing a user to preview an existing image, choose a new image, crop and resize that image, and then upload that image to Azure Blob Storage.

We use an Azure Shared Access Signature (SAS) created on a by-container basis that should be created on your server-side. The ImageUpload component then appends the SAS query parameters to the Storage Blob url with container and filename to upload the image.

View the [Full Example](#full-example) for examples with use of client-side GraphQL mutation and server-side generation of the SASurl.

```javascript
import React from 'react'
import { MessageCard, ImageUpload } from '@superalgos/web-components'

const YourComponent = ({ handleAvatar, filename, containerName, avatar, AzureStorageUrl, AzureSASURL }) => (
  <React.Fragment>
    <h1>Upload an image</h1>
    <ImageUpload
      handleUrl={handleAvatar}
      fileName={fileName}
      containerName={containerName}
      existingImage={avatar}
      imagePreviewConfig={{ width: 350, height:'auto', title: 'Change Avatar', fontSize: '1.5em' }}
      cropContainerConfig={{ x: 10, y: 10, width: 200, height: 200 }}
      cropPreviewBox={{ width: 350, height: 350 }}
      saveImageConfig={{
        quality: 0.6,
        maxWidth: 200,
        maxHeight: 200,
        autoRotate: true,
        mimeType: 'image/jpeg'
      }}
      containerStyle={{
        display: 'block',
        margin: '30px',
        height: '100px',
        width: '400px',
        overflow: 'visible'
      }}
      dropzoneStyle={{ height: 200 }}
      AzureStorageUrl={AzureStorageUrl}
      AzureSASURL={AzureSASURL}
      cropRatio={1}
    />
  </React.Fragment>
)

export default YourComponent
```

#### Image Upload Configuration Options
| Props                | Type                                                          | Note                                                                                                                                                                                               |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `handleUrl`       | Function | *Required.* Receives the url of the uploaded image |
| `fileName`        | String   | *Required.* File name that image is uploaded to storage as                                                                                                |
| `containerName`   | String  | *Required.* StorageContainer name that image is uploaded to  |
| `existingImage`           | String (url) | Url of pre-existing image. Usually will be same as URL returned from `handleUrl`                                                   |
| `imagePreviewConfig`            | Object | Existing image preview and change button text |
| `containerStyle`            | Object | Style of main container |
| `dropzoneStyle`            | Object | Style of dropzone container |
| `cropContainerConfig`            | Object | Size and location of cropper on image in crop mode |
| `cropPreviewBox`          | Object | Dimensions of cropper preview |
| `cropRatio`      | Number | ratio (width/height) image is cropped at eg. 1/1, 4/1, 16/9, 800/150                                                                                                |
| `saveImageConfig` | Object | Configuration of image saved to storage                       |
| `AzureStorageUrl`      | String  | *Required.* Azure Storage Url (just the storage url; container and filename will be appended)                                                                                                       |
| `AzureSASURL`      | String | *Required.* The Azure Shared Access Signature (SAS) that allows saving to the Blob without using full-access keys. See [Full Example](#full-example) for server side example.

#### Image Upload Default Values
| Props              | Default       |
| ------------------ | ------------- |
| `containerStyle`    | `{ display: 'block', margin: 0, height: 200, width: 200, overflow: 'visible' }` |
| `dropzoneStyle`    | `{ height: 200 }` |
| `imagePreviewConfig`    | `{ width: 350, height: auto, title: 'Change Avatar', fontSize: '24px' }` |
| `cropContainerConfig`    | `{ x: 10, y: 10, width: 200, height: 200 }` |
|`cropPreviewBox`    | `{ width: 350, height: 350 }` |
|`cropRatio`         | `1 / 1` |
|`saveImageConfig`   | `{quality: 0.6, maxWidth: 200, maxHeight: 200, autoRotate: true, debug: true, mimeType: 'image/jpeg}` |

## Image Upload Full Example
**YourComponent.js**

```javascript
import React, { Component } from 'react'
import gql from 'graphql-tag'
import { MessageCard, ImageUpload } from '@superalgos/web-components'

const GET_AZURE_SAS = gql`
  mutation getAzureSAS($containerName: String!) {
    getAzureSAS(containerName: $containerName)
  }
`

export class YourComponent extends Component {
  constructor (props) {
    super(props)

    this.handleAvatar = this.handleAvatar.bind(this)

    this.state = {
      avatar: null
    }
  }

  render () {
    const { user, avatar } = this.props
    return (
      <Mutation mutation={UPDATE_USER_PROFILE} >
        {(updateUserProfile, { loading, error, data }) => {
        	let user = data.updateUserProfile
            if (loading) {
              loader = (<MessageCard message='Updating user profile...' />)
            }

          return (
              <Mutation mutation={GET_AZURE_SAS} >
                {(getAzureSAS, { loading, error, data }) => {

                  const AzureStorageUrl = process.env.AZURE_STORAGE_URL
                  const containerName = user.name
                  const fileName = `${user.name}-avatar.jpg`
                  let avatar = user.profile.avatar

                  let AzureSASURL
                  if (!loading && data !== undefined) {
                    AzureSASURL = data.getAzureSAS
                  } else {
                    getAzureSAS({ variables: { containerName: containerName } })
                  }

                  if (loading || data === undefined) {
                    return (<MessageCard message='Loading...' />)
                  } else {
                    return (
                      <React.Fragment>
                        <ImageUpload
                          handleUrl={this.handleAvatar}
                          fileName={fileName}
                          containerName={containerName}
                          existingImage={avatar}
                          imagePreviewConfig={{ width: 350, title: 'Change Avatar' }}
      					  cropContainerConfig={{ x: 10, y: 10, width: 200, height: 200 }}                          cropPreviewBox={{ width: 350, height: 350 }}
                          saveImageConfig={{
                            quality: 0.6,
                            maxWidth: 200,
                            maxHeight: 200,
                            autoRotate: true,
                            mimeType: 'image/jpeg'
                          }}
                          AzureStorageUrl={AzureStorageUrl}
                          AzureSASURL={AzureSASURL}
                          cropRatio={1}
                        />
                      </React.Fragment>
                    )
                  }
                }}
              </Mutation>      
    		)
        }}
      </Mutation>
    )
  }

  handleAvatar (avatarUrl) {
    console.log('handleAvatar: ', avatarUrl)
    this.setState({ avatar: `${avatarUrl}?${Math.random()}` })  // random number makes browser load latest image version
  }
}
```
**ServerSide: server.js**

```javascript
const { createSASQueryURL } = require('./storage/azure')

...
const resolvers = {
	...
	Mutation: {
		async getAzureSAS(parent, { teamSlug }, ctx, info) {
	      const SASUrl = createSASQueryURL(teamSlug)
	      console.log('createSASQueryURL: ', SASUrl)
	      return SASUrl
	    }
    }
}

```
**ServerSide: azure.js**

```javascript
const Azure = require("@azure/storage-blob")
const azureAccount = process.env.AZURE_STORAGE_ACCOUNT
const azureKey = process.env.AZURE_STORAGE_ACCESS_KEY
const azureStorageUrl = process.env.AZURE_STORAGE_URL

const createSASQueryURL = async (containerName) => {
  let today = new Date()
  let week = new Date()
  week.setDate(today.getDate() + 7)

  // Create SharedKeyCredential and attach to pipline
  const SKC = new Azure.SharedKeyCredential(azureAccount, azureKey)
  const pipeline = Azure.StorageURL.newPipeline(SKC)

  // Create container URL
  const serviceURL = new Azure.ServiceURL(azureStorageUrl, pipeline)
  const containerURL = Azure.ContainerURL.fromServiceURL(serviceURL, containerName)

  //list container and check if already exists.
  let marker
  let containerCheck = null
  do {
    const listContainersResponse = await serviceURL.listContainersSegment(
      Azure.Aborter.None,
      marker,
    )
    marker = listContainersResponse.marker;
    for (const container of listContainersResponse.containerItems) {

      if(container.name === containerName){
        containerCheck = container.name
      }
    }
  } while (marker)

  // if container doesn't exist, create one
  let newContainer
  if(containerCheck === null){
    newContainer = await containerURL.create(Azure.Aborter.None, { access: 'blob' })
  }

  // Set permissions for service, resource types and containers
  const SASContainerPerms = await Azure.AccountSASPermissions.parse('rwlacu')
  const SASServicePerms = await Azure.AccountSASServices.parse('b')
  const SASResourceTypes = await Azure.AccountSASResourceTypes.parse('co')

  // Generate SAS url
  const SASQueryParameters = await Azure.generateBlobSASQueryParameters(
    {
      version: '2017-11-09',
      protocol: 'https,http',
      expiryTime: week,
      permissions: 'rwlac',
      containerName: containerName
    }, SKC )

  return SASQueryParameters
}

module.exports = { createSASQueryURL }


```

## Page
The Page component is a wrapper that uses [React Helmet](https://github.com/nfl/react-helmet) to inject page title, description and other metadata into the header to represent the current view.

Supports basic meta data as well as metadata for Twitter and Facebook

** Note 1:** View .env.sample for extra configuration variables that should be added to your environment variables.

** Note 2:** Uses [react-router-dom `withRouter` HoC](https://reacttraining.com/react-router/web/api/withRouter) and requires being used with <BrowserRouter /> &amp; <Route /> components

```javascript
import React from 'react'
import { Page, MessageCard } from '@superalgos/web-components'

export const YourComponent = () => (
  <Page
    title='Superalgos Development Platform'
    subtitile='A Platform View'
    description='This describes the current view of the Superalgos Development Platform'
  >
    <MessageCard message={text('Message', 'This message is wrapped by a page component. Check header source to see inserted metadata.')} />
  </Page>
)
```
#### Page Configuration Options
| Props                | Type                                                            | Default | Note                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`         | String | ---  | Title of site |
| `subtitle`         | String | ---  | Title of current view |
| `description`         | String | ---  | Description of current view |
| `twitter`         | String | ---  | Twitter handle (eg. @superalgos) and enables Twitter card metadata |
| `facebook`         | Boolean | ---  | Enables Facebook OpenGraph metadata |
| `image`         | string | ---  | URL of image that represents current view |
| `<children>`        | Node | ---  | Can accept children nodes.    



# Developing This Package
==================================

### Libraries

* [react](https://reactjs.org/)
* [graphql](https://howtographql.com)
* [apollo-client](https://www.apollographql.com/docs/react/)
* [material-ui](https://material-ui.com/api/)
* [@azure/storage-blob](https://github.com/Azure/azure-storage-js)


### Getting Started

* [storybook](https://storybook.js.org/)

```bash
$ npm install
$ npm run storybook
```

### Testing

* [jest](https://jestjs.io/)
* [enzyme](https://airbnb.io/enzyme/docs/guides/jest.html)

```bash
$ npm run test
```
