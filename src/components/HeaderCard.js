import React, { useState, useEffect, useContext } from 'react'
import { Box, Typography, Card, CardContent, CardMedia, CardActionArea } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { PostContext } from './PostContext'

const defaultImg = 'https://source.unsplash.com/random'
const mediaSize = 205
const useStyles = makeStyles((theme) => ({
  root: {
    width: [mediaSize],
    // padding: theme.spacing(2, 2, 2, 2),
    flexShrink: 0,
  },
  media: {
    height: [mediaSize],
    width: [mediaSize],
    objectFit: 'cover',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    color: 'white',
    backgroundColor: 'rgba(12, 12, 12, 0.4)',
  },
  text: {
    textDecoration: 'none',
    color: 'inherit',
  },
}))

export default function headerCard({ datum }) {
  const { setPost } = useContext(PostContext)
  const [img, setImg] = useState(defaultImg)
  const [_title, _setTitle] = useState()
  const [dest, setDest] = useState('/')
  const classes = useStyles()
  const title = datum?.title
  const preview = datum?.preview
  console.log(datum)

  useEffect(() => {
    init()
  }, [datum])

  function init() {
    if (datum) {
      getResolutions()
      trimTitle()
      setDest(`/post${datum.permalink}`)
    }
  }

  // Removing 'amp;' is necessary to not get an error when loading an img
  const setImage = (image) => setImg(image.replace(/amp;/g, ''))

  //This function calculates which image is best suited for preview
  function getResolutions() {
    const res = preview?.images[0]?.resolutions
    let bestRes = res[0],
      curr,
      next
    for (let i = 0; i < res.length - 1; i++) {
      curr = Math.abs(res[i].height - mediaSize)
      next = Math.abs(res[i + 1].height - mediaSize)
      if (curr < next) {
        if (curr < Math.abs(bestRes.height - mediaSize)) {
          bestRes = res[i]
        }
      } else {
        if (next < Math.abs(bestRes.height - mediaSize)) {
          bestRes = res[i + 1]
        }
      }
    }
    //if lower resolution image is not available we grab the original url instead
    if (bestRes?.url) {
      setImage(bestRes.url)
    } else if (datum?.preview?.images[0]?.source[0]?.url) {
      setImage(datum.preview.images[0].source.url)
    }
  }

  function trimTitle() {
    if (title?.length > 20) {
      _setTitle(title.split(' ').splice(0, 5).join(' ') + '...')
    } else _setTitle(title)
  }

  function handleClick() {
    setPost(datum)
  }

  //catch card media error needed
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={img}
          title={title}
          onClick={() => handleClick()}
          component={Link}
          to={dest}
        />
        <CardContent className={classes.content}>
          {_title && (
            <Typography>
              <Link className={classes.text} to={dest}>
                {_title}
              </Link>
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
