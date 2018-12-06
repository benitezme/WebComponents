import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as Azure from '@azure/storage-blob'
import readAndCompressImage from 'browser-image-resizer'
import { imgSrcToBlob } from 'blob-util'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import { DropZone, ImagePreview, CropperDialog } from './components/'

const styles = theme => ({
  imageUploadContainer: {
    display: 'block',
    margin: 0,
    height: 200,
    overflow: 'visible'
  }
})

// placeholder image if no existing image
const placeHolder = fileName => {
  return `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3E${fileName}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
}

const containerStyleDefault = {
  display: 'block',
  margin: 0,
  height: 200,
  wdith: 200,
  overflow: 'visible'
}

const imagePreviewDefault = {
  width: 400,
  height: 400,
  title: 'Change Avatar'
}

const cropPreviewBoxDefault = {
  width: 350,
  height: 350
}

// default config for cropping shape
const cropConfigDefault = {
  x: 10,
  y: 10,
  width: 200,
  height: 200,
  ratio: 1 / 1
}

// default config for image resize and quality
const saveImageConfigDefault = {
  quality: 0.6,
  maxWidth: 200,
  maxHeight: 200,
  autoRotate: true,
  debug: true,
  mimeType: 'image/jpeg'
}

const dropzoneStyleDefault = {
  height: 200
}

class ImageUpload extends Component {
  constructor (props) {
    super(props)

    this.onDrop = this.onDrop.bind(this)
    this.handleChangeImage = this.handleChangeImage.bind(this)
    this.handleCrop = this.handleCrop.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.saveImage = this.saveImage.bind(this)
    this.debug = this.props.debug

    let containerStyleConfig =
      props.containerStyle !== undefined
        ? props.containerStyle
        : containerStyleDefault
    let previewConfig =
      props.imagePreviewConfig !== undefined
        ? props.imagePreviewConfig
        : imagePreviewDefault
    let cropConfig =
      props.cropContainerConfig !== undefined
        ? props.cropContainerConfig
        : cropConfigDefault
    let saveConfig =
      props.saveImageConfig !== undefined
        ? props.saveImageConfig
        : saveImageConfigDefault
    let cropPreview =
      props.cropPreviewBox !== undefined
        ? props.cropPreviewBox
        : cropPreviewBoxDefault
    let dropzoneStyleConfig =
      props.dropzoneStyle !== undefined
        ? props.dropzoneStyle
        : dropzoneStyleDefault
    this.containerStyleConfig = containerStyleConfig
    this.previewConfig = previewConfig
    this.cropConfig = cropConfig
    this.saveConfig = saveConfig
    this.cropPreview = cropPreview
    this.dropzoneStyleConfig = dropzoneStyleConfig

    this.state = {
      open: false,
      event: 'preview', // events: preview, choose, crop, cropping, uploaded
      change: false,
      file: null,
      src: null,
      crop: cropConfig,
      editedImage: null,
      uploadedImage: null
    }
  }

  render () {
    const { classes, existingImage, cropRatio, fileName } = this.props

    let image = null
    if (this.debug) console.log('Image Upload existingImage: ', existingImage)
    if (existingImage !== undefined && existingImage !== null) {
      image = existingImage
    } else {
      image = placeHolder(fileName)
    }

    return (
      <div
        className={classes.imageUploadContainer}
        style={this.containerStyleConfig}
      >
        {this.state.event === 'cropping' && (
          <Typography variant='h6' color='primary'>
            Cropping...
          </Typography>
        )}
        {this.state.event !== 'cropping' && (
          <React.Fragment>
            <div>
              {(this.state.event === 'preview' ||
                this.state.event === 'uploaded') &&
                this.state.event !== 'choose' && (
                <ImagePreview
                  handleChangeImage={this.handleChangeImage}
                  image={image}
                  imagePreview={this.previewConfig}
                />
              )}
              {this.state.event === 'choose' && (
                <DropZone
                  onDrop={this.onDrop}
                  handleCancel={this.handleCancel}
                  dropzoneStyle={this.dropzoneStyleConfig}
                />
              )}
              {this.state.event === 'uploaded' && (
                <Typography variant='h6' color='primary'>
                  Save profile to save image changes
                </Typography>
              )}
            </div>
            <CropperDialog
              open={this.state.open}
              imgSrc={this.state.src}
              handleClose={this.handleClose}
              handleCrop={this.handleCrop}
              handleCancel={this.handleCancel}
              cropImagePreview={this.cropPreview}
              cropRatio={cropRatio}
            />
          </React.Fragment>
        )}
      </div>
    )
  }

  onDrop (file) {
    this.onSelectFile(file)
    this.setState({
      file
    })
  }

  onSelectFile (file) {
    if (file && file.length > 0) {
      const reader = new window.FileReader()
      reader.addEventListener(
        'load',
        () =>
          this.setState({
            src: reader.result,
            open: true
          }),
        false
      )
      reader.readAsDataURL(file[0])
    }
  }

  async handleCrop (cropped) {
    const croppedBlob = await imgSrcToBlob(cropped, 'image/png', 'Anonymous')
    let resizedBlob = await readAndCompressImage(croppedBlob, this.saveConfig)

    return this.setState(
      { editedImage: resizedBlob, event: 'cropping', open: false },
      () => {
        this.saveImage()
      }
    )
  }

  async saveImage () {
    const {
      AzureStorageUrl,
      AzureSASURL,
      containerName,
      fileName,
      handleUrl
    } = this.props
    const SASurl = `${AzureStorageUrl}?${AzureSASURL}`

    // create Azure BlockBlobURL to save image to
    const pipeline = Azure.StorageURL.newPipeline(
      new Azure.AnonymousCredential()
    )
    const serviceURL = new Azure.ServiceURL(SASurl, pipeline)

    const containerURL = Azure.ContainerURL.fromServiceURL(
      serviceURL,
      containerName
    )
    const blockBlobURL = Azure.BlockBlobURL.fromContainerURL(
      containerURL,
      fileName
    )

    await Azure.uploadBrowserDataToBlockBlob(
      Azure.Aborter.None,
      this.state.editedImage,
      blockBlobURL
    )

    const image = `${AzureStorageUrl}${containerName}/${fileName}`
    handleUrl(image) // pass image URL up to be save to DB
    this.setState({ event: 'uploaded', uploadedImage: image })
    return image
  }

  handleChangeImage () {
    this.setState({
      event: 'choose'
    })
  }

  handleCancel () {
    this.setState({ event: 'preview', open: false })
  }

  handleClickOpen (e) {
    e.preventDefault()
    this.setState({ open: true })
  }

  handleClose () {
    this.setState({ open: false, src: null, change: false })
  }
}

ImageUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  containerStyle: PropTypes.object,
  imagePreviewConfig: PropTypes.object, // { width: 400, height: 'auto', title: 'Change Avatar', fontSize: '1.5em'} (default)
  cropContainerConfig: PropTypes.object, // { x: 10, y: 10, width: 200, height: 200 } (default)
  dropzoneStyle: PropTypes.object, // { height: 200 } (default)
  cropPreviewBox: PropTypes.object, // { width: 350, height: 350 } (default)
  cropRatio: PropTypes.number.isRequired, // ratio (width/height) image is cropped at eg. 1/1, 4/1, 16/9, 800/150
  saveImageConfig: PropTypes.object, // see imageResizeConfig above for default (default)
  containerName: PropTypes.string.isRequired, // name of Azure Container image will be saved in
  fileName: PropTypes.string.isRequired, // filename to save image as
  existingImage: PropTypes.string, // image url of existing image (optional)
  handleUrl: PropTypes.func.isRequired, // function that handles uploaded image file url
  AzureSASURL: PropTypes.string.isRequired,
  AzureStorageUrl: PropTypes.string.isRequired,
  debug: PropTypes.bool
}

export default withStyles(styles)(ImageUpload)
