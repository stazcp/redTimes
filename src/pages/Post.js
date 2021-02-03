import React, { useContext, useState, useEffect } from 'react'
import {
  Container,
  Typography,
  IconButton,
  Avatar,
  Collapse,
  CardActions,
  CardContent,
  CardMedia,
  CardHeader,
  Card,
} from '@material-ui/core'
import { useParams, Redirect } from 'react-router-dom'
import Header from '../components/Header'
import { PostContext } from '../components/PostContext'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const defaultImg = 'https://source.unsplash.com/random'
const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
}))

export default function Post() {
  const { post } = useContext(PostContext)
  const [title, setTitle] = useState()
  const [date, setDate] = useState()
  const [img, setImg] = useState(defaultImg)
  const classes = useStyles()
  // let { data } = useParams()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    init()
  }, [post])

  const init = () => {
    setTitle(post?.title ? post.title : '')
    setDate(post?.created_utc ? new Date(post.created_utc * 1000) : '')
    setImage()
  }

  const setImage = () => {
    if (post?.preview?.images[0]?.source?.url) {
      let imgUrl = post.preview.images[0].source.url
      setImg(convertImgUrl(imgUrl))
    }
  }

  // Removing 'amp;' is necessary to not get an error when loading an img
  const convertImgUrl = (image) => setImg(image.replace(/amp;/g, ''))

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  console.log(post)

  return (
    <Container maxWidth="sm" className={classes.container}>
      {!post && <Redirect to="/" />}

      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={`${title}`}
          subheader={`${date}`}
        />
        <CardMedia className={classes.media} image={img} title="Paella dish" />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            AAAThis impressive paella is a perfect party dish and a fun meal to cook together with
            your guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
              minutes.
            </Typography>
            <Typography paragraph>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
              heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
              browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
              chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
              salt and pepper, and cook, stirring often until thickened and fragrant, about 10
              minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography paragraph>
              Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
              without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat
              to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and
              cook again without stirring, until mussels have opened and rice is just tender, 5 to 7
              minutes more. (Discard any mussels that don’t open.)
            </Typography>
            <Typography>
              Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Container>
  )
}
