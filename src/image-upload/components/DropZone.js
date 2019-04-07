import React from 'react'
import PropTypes from 'prop-types'

import Dropzone from 'react-dropzone'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  dropzone: {
    display: 'flex',
    flexGrow: 1,
    padding: '0.5em',
    height: 200,
    borderWidth: 2,
    borderColor: '#999',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer'
  },
  dropzoneText: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: '"Saira","Saira Condensed", "Arial Narrow", Arial, sans-serif',
    cursor: 'pointer'
  },
  cancelButton: {
    position: 'relative',
    top: '-3em'
  }
})

export const DropZone = ({ classes, onDrop, handleCancel, dropzoneStyle }) => (
  <React.Fragment>
    <Dropzone
      accept='image/jpeg, image/png'
      onDrop={e => onDrop(e)}
      className={classes.dropzone}
      multiple={false}
      style={{ height: dropzoneStyle.height ? dropzoneStyle.height : 200 }}
    >
      <p className={classes.dropzoneText}>
        Drag *.jpeg or *.png image here or click to select
      </p>
    </Dropzone>
    <Button
      size='small'
      variant='contained'
      onClick={handleCancel}
      color='secondary'
      className={classes.cancelButton}
    >
      Cancel Image Change
    </Button>
  </React.Fragment>
)

DropZone.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  dropzoneStyle: PropTypes.object
}

export default withStyles(styles)(DropZone)
