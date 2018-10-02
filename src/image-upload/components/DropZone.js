import React from 'react'
import PropTypes from 'prop-types'

import Dropzone from 'react-dropzone'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  dropzone: {
    display: 'block',
    padding: '3em',
    height: 200,
    borderWidth: 2,
    borderColor: '#999',
    backgroundColor: '#eee'
  },
  dropzoneText: {
    textAlign: 'center'
  }
})

export const DropZone = ({ classes, onDrop, handleCancel }) => (
  <React.Fragment>
    <Dropzone
      accept='image/jpeg, image/png'
      onDrop={(e) => onDrop(e)}
      className={classes.dropzone}
      multiple={false}
    >
      <p className={classes.dropzoneText}>Drag-and-drop image here or click to select <br /> Only *.jpeg and *.png images</p>
    </Dropzone>
    <Button
      onClick={handleCancel}
      color='primary'
    >
      Cancel Image Change
    </Button>
  </React.Fragment>
)

DropZone.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
}

export default withStyles(styles)(DropZone)
