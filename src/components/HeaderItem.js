import { useState } from 'react'
import { Paper, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  imageStyle: {
    backgroundImage: `url('https://source.unsplash.com/random')`,
    backgroundSize: 'cover',
  },
  container: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}))

export const HeaderItem = ({ item }) => {
  const classes = useStyles()
  // console.log(item)
  let image = item.preview.images[0].source.url || 'https://source.unsplash.com/random'
  console.log(image)

  return (
    <Box className={classes.container}>
      <Paper>
        <img src={image} alt="header Image" width="200px" className={classes.imageStyle} />
        <h2>{item.title}</h2>
      </Paper>
    </Box>
  )
}
