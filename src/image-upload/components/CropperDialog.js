import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'

import { Cropper } from 'react-image-cropper'

const styles = theme => ({
  dropzone: {
    display: 'block',
    padding: '3em',
    height: 200,
    borderWidth: 2,
    borderColor: '#999',
    backgroundColor: '#eee'
  }
})

class CropperDialog extends Component {
  render () {
    const { classes, open, handleClose, imgSrc, handleCrop, handleCancel, cropperRef } = this.props
    console.log(cropperRef)
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <div classes={classes.dialogContainer}>
          <DialogContent>
            <div className={classes.cropImageBox} >
              {imgSrc === null && (
                <div>Loading...</div>
              )}
              {imgSrc !== null && (
                <Cropper
                  src={imgSrc}
                  originX={100}
                  originY={100}
                  ref={ref => { this.cropper = ref }}
                  ratio={1}
                />
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={(e) => handleCrop(e, this.cropper)}
              color='primary'
            >
              Crop Image
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  }
}

CropperDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  imgSrc: PropTypes.string,
  handleCrop: PropTypes.func.isRequired,
  cropperRef: PropTypes.any.isRequired,
  handleCancel: PropTypes.func.isRequired
}

export default withStyles(styles)(CropperDialog)
