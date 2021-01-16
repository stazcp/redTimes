import React, { useState, useEffect } from 'react'
import { Box, Paper, Container, Grid, Card } from '@material-ui/core'
import Carousel from 'react-material-ui-carousel'
import HeaderCard from './HeaderCard'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    paddingTop: theme.spacing(2),
    justifyContent: 'center',
    display: 'flex',
    flowDirection: 'row',
    // height: '250px',
  },
  bannerGrid: {},
  carouselStyle: {},
}))

export default function Header({ _data }) {
  const [items, setItems] = useState()
  const classes = useStyles()
  const totalItems = 4

  useEffect(() => {
    if (_data) prepItems(_data)
  }, [_data])

  const prepItems = (x) => {
    //converts an aray of Items to groups of 4

    //trim array to array % 4
    let mod = x.length % 4
    if (mod !== 0) {
      let startIdx = x.length - 1 - mod
      x.splice(startIdx, mod)
    }
    let arr = []
    if (x) {
      for (let i = 0; i < _data.length; i += 4) {
        arr.push(x.slice(i, i + 4))
      }
      setItems(arr)
    }
  }

  //internal component
  const Banner = ({ data }) => {
    //expects an array of 4 items to build the banner
    const defaultData = []
    console.log(data)

    const renderDefaultData = () => {
      for (let i = 0; i < 4; i++) {
        defaultData.push(
          <Grid item xs={12 / totalItems} key={i}>
            <HeaderCard />
          </Grid>
        )
      }
      return defaultData.map((datum) => datum)
    }

    const renderData = () =>
      data.map((x, i) => (
        <Grid item xs={12 / totalItems} key={i}>
          <HeaderCard datum={x.data} />
        </Grid>
      ))

    return (
      <Card elevation={0}>
        <Grid container spacing={2} className={classes.bannerGrid}>
          {data ? renderData() : renderDefaultData()}
        </Grid>
      </Card>
    )
  }

  return (
    <Box className={classes.headerStyle} clone>
      <Container maxWidth="md" className={classes.container}>
        <Carousel
          indicators={false}
          stopAutoPlayOnHover={true}
          interval={10000}
          className={classes.carouselStyle}
          autoplay={!!items}
        >
          {items ? items.map((item, i) => <Banner data={item} key={i} />) : <Banner />}
        </Carousel>
      </Container>
    </Box>
  )
}
