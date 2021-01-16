import React, { useContext, useState } from 'react'

export const PostContext = React.createContext()

export default function PostProvider(props) {
  const [post, setPost] = useState()
  return <PostContext.Provider value={{ post, setPost }}> {props.children}</PostContext.Provider>
}
