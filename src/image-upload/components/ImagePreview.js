import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  imagePreview: {
    width: 100,
    height: 100
  }
})

export const ImagePreview = ({ classes, handleChangeImage, image }) => (
  <React.Fragment>
    <img src={image} className={classes.imagePreview} alt='Existing Image Preview' />
    <Button
      onClick={handleChangeImage}
      color='primary'
    >
      Change
    </Button>
  </React.Fragment>
)

ImagePreview.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChangeImage: PropTypes.func,
  image: PropTypes.string
}

export default withStyles(styles)(ImagePreview)
