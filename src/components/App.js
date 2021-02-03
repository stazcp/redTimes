import React from 'react'
import AppBar from './AppBar'
import Home from '../pages/Home'
import PostProvider from './PostContext'
import Post from '../pages/Post'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PostContext from './PostContext'

function App() {
  return (
    <div className="App">
      <Router>
        <PostProvider>
          <AppBar />
          <Switch>
            <Route path="/post/:data">
              <Post />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </PostProvider>
      </Router>
    </div>
  )
}

export default App
