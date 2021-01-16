import React, { useEffect, useState } from 'react'
import { Container, Box, Typography, Paper } from '@material-ui/core'
import HeaderCard from '../components/HeaderCard'
import { makeStyles } from '@material-ui/core/styles'
import { getData, cleanCookies, init } from '../util/RedditApi'
import Header from '../components/Header'

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerStyle: {
    padding: theme.spacing(2, 2, 0, 0),
    justifyContent: 'center',
    width: '20%',
  },
}))

const HEADERS = {
  subs: ['popular', 'all', 'NatureIsFuckingLit', 'pics', 'home', 'politics'],
  cats: ['top', 'hot', 'new'],
}

export default function Home() {
  const classes = useStyles()
  const [headerList, setHeaderList] = useState()

  useEffect(() => {
    run()
  }, [])

  const run = async () => {
    await init()
    // grabHeaders()
    getData('popular', 'top').then((d) => setHeaderList(filterArray(d.data.children)))
  }

  // const grabHeaders = () => {
  //   HEADERS.subs.forEach(async (sub) => {
  //     await getData(sub, HEADERS.cats[1]).then((d) => {
  //       const sorted = filterArray(d.data.children)
  //       setHeaderList((headerList) => [...headerList, sorted])
  //     })
  //   })
  // }

  //keep posts with preview images only
  const filterArray = (arr) => arr.filter((x) => !!x?.data?.preview?.images[0]?.source?.url)

  // console.log(headerList[0][2].data.preview.images[0].source.url)
  console.log(headerList)

  return (
    <>
      <Container maxWidth="md" className={classes.main}>
        <Box className={classes.headerSection}>
          <Header _data={headerList} />
        </Box>
      </Container>
    </>
  )
}
