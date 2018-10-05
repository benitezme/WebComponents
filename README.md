# Advanced Algos Web Components
==================================

## Introduction

The is a repository for shared React web components between the Advanced Algos platform modules.


* [Installation](#installation)
* [Usage](#usage)
  * [Message Card](#message-card)
  * [Image Upload](#image-uploade)
* [Configuration Options](#configuration-options)
  * [Message Card](#message-card)
  * [Image Upload](#image-upload)
  		* [Full Example](#full-example)
* [Developing This Package](#developing-this-package)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install @advancedalgos/web-components
```

# Usage

## MessageCard
The Message Card is a simple component for outputting a message within a card. Great for using as a placeholder or adding simple formatting to error and loading messages.

```javascript
import React from 'react'
import { MessageCard } from '@advancedalgos/web-components'

export const YourComponent = () => (
  <div>
    <MessageCard message='A message!' />
    <MessageCard message='That can also wrap other components' >
      <div className='loader'>Loading...</div>
    </MessageCard>
  </div>
)
```
#### Configuration Options
| Props                | Type                                                            | Default | Note                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`         | String | ---  | Display any string |
| `<children>`        | Node                                                          | ---  | Can accept children nodes.                                                                                                |




## Image Upload
Image Upload is a complex multi-functional component that encompasses allowing a user to preview an existing image, choose a new image, crop and resize that image, and then upload that image to Azure Blob Storage.  

```javascript
import React from 'react'
import { MessageCard, ImageUpload } from '@advancedalgos/web-components'

const YourComponent = ({ handleAvatar, filename, containerName, avatar, AzureStorageUrl, AzureSASURL }) => (
  <React.Fragment>
    <h1>Upload an image</h1>
    <ImageUpload
      handleUrl={handleAvatar}
      fileName={fileName}
      containerName={containerName}
      existingImage={avatar}
      cropContainer={{ x: 10, y: 10, width: 200, height: 200 }}
      cropPreviewBox={{ width: 350, height: 350 }}
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

export default YourComponent
```

#### Configuration Options
| Props                | Type                                                          | Note                                                                                                                                                                                               |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `handleUrl`       | Function | *Required.* Receives the url of the uploaded image |
| `fileName`        | String   | *Required.* File name that image is uploaded to storage as                                                                                                |
| `containerName`   | String  | *Required.* StorageContainer name that image is uploaded to  |
| `existingImage`           | String (url) | Url of pre-existing image. Usually will be same as URL returned from `handleUrl`                                                   |
| `cropContainer`            | Object | Size and location of cropper on image in crop mode |
| `cropPreviewBox`          | Object | Dimensions of cropper preview |
| `cropRatio`      | Number | ratio (width/height) image is cropped at eg. 1/1, 4/1, 16/9, 800/150                                                                                                |
| `saveImageConfig` | Object | Configuration of image saved to storage                       |
| `AzureStorageUrl`      | String  | *Required.* Azure Storage Url (just the storage url; container and filename will be appended)                                                                                                       |
| `AzureSASURL`      | String | *Required.* The Azure Shared Access Signature (SAS) that allows saving to the Blob without using full-access keys. See [Full Example](#full-example) for server side example.

#### Default Values
| Props              | Default       |
| ------------------ | ------------- |
| `cropContainer`    | `{ x: 10, y: 10, width: 200, height: 200 }` |
|`cropPreviewBox`    | `{ width: 350, height: 350 }` |
|`cropRatio`         | `1 / 1` |
|`saveImageConfig`   | `{quality: 0.6, maxWidth: 200, maxHeight: 200, autoRotate: true, debug: true, mimeType: 'image/jpeg}` |

## Full Example
**YourComponent.js**

```javascript
import React, { Component } from 'react'
import { MessageCard, ImageUpload } from '@advancedalgos/web-components'

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
              loader = (<MessageCard message='Submitting team...' />)
            }

          return (
              <Mutation mutation={GET_AZURE_SAS} >
                {(getAzureSAS, { loading, error, data }) => {
                  console.log('getAzureSAS: ', loading, error, data, team.profile)
                  const AzureStorageUrl = process.env.AZURE_STORAGE_URL
                  const containerName = user.name
                  const fileName = `${user.name}-avatar.jpg`
                  let AzureSASURL
                  if (!loading && data !== undefined) {
                    AzureSASURL = data.getAzureSAS
                  } else {
                    getAzureSAS({ variables: { containerName: containerName } })
                  }

                  let avatar = null
                  if (this.state.avatar !== null) avatar = this.state.avatar
                  if (team.profile !== null && user.profile.avatar !== undefined && user.profile.avatar !== null) avatar = user.profile.avatar

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
                          cropContainer={{ x: 10, y: 10, width: 200, height: 200 }}
                          cropPreviewBox={{ width: 350, height: 350 }}
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
    this.setState({ avatar: `${avatarUrl}?${Math.random()}` })  // random number makes browser loads latest image version
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

# Developing This Package
==================================

### Libraries

* [react]()
* [apollo-client]()
* [material-ui]()
* [@azure/storage-blob]()


### Getting Started
```bash
$ npm install
$ npm run storybook
```

### Testing
```bash
$ npm run test
```
