import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%'
  },
  image: {
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15
      },
      '& $imageTitle': {
        backgroundColor: theme.palette.common.black,
        opacity: 0.4
      }
    }
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%'
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity')
  },
  imageTitle: {
    position: 'relative',
    textTransform: 'uppercase',
    fontWeight: 700,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`
  }
})

export const ImagePreview = ({ classes, handleChangeImage, image, imagePreview }) => (
  <React.Fragment>
    <ButtonBase
      focusRipple
      key={imagePreview.title}
      className={classes.image}
      focusVisibleClassName={classes.focusVisible}
      onClick={handleChangeImage}
      style={{
        width: imagePreview.width,
        height: imagePreview.height
      }}
    >
      <span
        className={classes.imageSrc}
        style={{
          backgroundImage: `url(${image})`
        }}
      />
      <span className={classes.imageBackdrop} />
      <span className={classes.imageButton}>
        <Typography
          component='span'
          variant='h3'
          color='inherit'
          className={classes.imageTitle}
          style={{
            fontSize: imagePreview.fontSize
          }}
        >
          {imagePreview.title}
        </Typography>
      </span>
    </ButtonBase>
  </React.Fragment>
)

ImagePreview.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChangeImage: PropTypes.func,
  image: PropTypes.string,
  imagePreview: PropTypes.object
}

export default withStyles(styles)(ImagePreview)
