import React from 'react'
import { Container } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'

export default function Post() {
  let { data } = useParams()
  console.log(data)
  return (
    <Container>
      <h1>'Post Page'</h1>
    </Container>
  )
}
