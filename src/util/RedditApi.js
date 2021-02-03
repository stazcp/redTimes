import keys from '../keys.json'
const proxy = 'https://cors-anywhere.herokuapp.com/'
let random_str
const redirect_uri = 'http://localhost:3000/'
const duration = 'permanent'
const scope = '*'
const rsp_type = 'code'
const baseUrl = 'https://www.reddit.com/api/v1/'
const oauth_base_url = 'https://oauth.reddit.com'
const tkn_cookie_name = 'tkn'
const user_agent = 'Google Chrome:YFV-xeK6dlQpOA:v1.0 (by u/jiraiya404)'
const token_timer = 'tkn_time'
const token_date = 'tkn_date'
const refresh_tkn_cookie_name = 're-tkn'

export const init = async () => {
  console.log('initializing')
  const token = getCookieValueByName(tkn_cookie_name)
  const refresh_token = getRefreshToken()
  const redirected = window.location.href.includes('code')
  if (redirected && !token) {
    let code = getCode()
    await fetchToken(code)
  } else if (tokenExpired() && refresh_token) {
    await refreshToken(refresh_token)
  } else if (tokenExpired() && !refresh_token) {
    clearCookies()
    await oauth()
  }
}

const setToken = (access_token) =>
  access_token
    ? (document.cookie = `${tkn_cookie_name}=${access_token}`)
    : console.log('missing token')

const setRefreshToken = (refresh_token) =>
  refresh_token
    ? (document.cookie = `${refresh_tkn_cookie_name}=${refresh_token}`)
    : console.log('missing refresh token')

const setTimer = () => {
  console.log('setting timer')
  const date = new Date()
  const time_cookie = `${token_timer}=${date.getHours()}:${date.getMinutes()}`
  document.cookie = time_cookie
  const date_cookie = `${token_date}=${createDate(date)}`
  document.cookie = date_cookie
}

const getRefreshToken = () => getCookieValueByName(refresh_tkn_cookie_name)

const createDate = (today) => {
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  const yyyy = today.getFullYear()
  today = mm + '/' + dd + '/' + yyyy
  return today
}

const tokenExpired = () => {
  if (!getCookieValueByName(tkn_cookie_name)) return true
  const old_date = getCookieValueByName(token_timer)
  if (!old_date) return true
  const date = new Date()
  //if the date is different fetch a new token than when token was received
  if (createDate(date) !== getCookieValueByName(token_date)) return true
  let new_time = date.getHours() + date.getMinutes() / 60
  const [h, m] = old_date.split(':').map((n) => parseInt(n))
  let old_time = h + m / 60
  let time_elapsed = new_time - old_time
  if (time_elapsed >= 1 && time_elapsed >= 0) return true
  return false
}

const refreshToken = async () => {
  try {
    console.log('refreshing token')
    const token = getRefreshToken()
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + btoa(keys.clientId + ':' + keys.clientSecret))
    headers.append('User-agent', user_agent)
    headers.append('Content-Type', 'application/x-www-form-urlencoded')
    const data = `grant_type=refresh_token&refresh_token=${token}`
    let rsp = await fetch(`${baseUrl}access_token`, {
      method: 'POST',
      headers,
      body: data,
    })
    console.log(rsp)
    if (rsp.ok) {
      const jsonResp = await rsp.json()
      console.log(jsonResp)
      const token = jsonResp.access_token
      if (token) document.cookie = `${tkn_cookie_name}=${token}`
      setTimer()
      return token
    }
  } catch (error) {
    console.log(error)
  }
}

const randomStr = (length) => {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const setRandomStr = () => (random_str = randomStr(5))

const oauth = async () => {
  setRandomStr()
  const url = `${baseUrl}authorize?client_id=${keys.clientId}&response_type=${rsp_type}&state=${random_str}&redirect_uri=${redirect_uri}&duration=${duration}&scope=${scope}`
  window.location.replace(url)
}

const getCode = () => {
  const params = new URL(window.location).searchParams
  const code = params.get('code')
  console.log(`code ${code}`)
  return code
}

const fetchToken = async (code) => {
  if (code) {
    try {
      console.log('fetching new token')
      const headers = new Headers()
      headers.set('Authorization', 'Basic ' + btoa(keys.clientId + ':' + keys.clientSecret))
      headers.append('User-agent', user_agent)
      headers.append('Content-Type', 'application/x-www-form-urlencoded')
      const data = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`
      let rsp = await fetch(`${baseUrl}access_token`, {
        method: 'POST',
        headers,
        body: data,
      })
      if (rsp.ok) {
        const jsonResp = await rsp.json()
        const { access_token, refresh_token } = jsonResp
        console.log(jsonResp)
        console.log(access_token, refresh_token)
        setToken(access_token)
        setRefreshToken(refresh_token)

        setTimer()
        return access_token
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const getToken = async () => {
  console.log(`token expired? ${tokenExpired()}`)
  let token = getCookieValueByName(tkn_cookie_name)
  let refresh_token = getRefreshToken()
  if (!tokenExpired()) return token
  if (tokenExpired() && refresh_token) return await refreshToken(refresh_token)
  init()
}

const getCookieValueByName = (name) => {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : ''
}

export const clearCookies = () =>
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })

export const getData = async (sub, cat) => {
  let token = await getToken()
  if (token) {
    console.log(`token ${token}`)
    let headers = new Headers()
    headers.set('Authorization', `bearer ${token}`)
    headers.append('User-agent', user_agent)
    headers.append('Content-Type', 'application/x-www-form-urlencoded')

    try {
      let resp = await fetch(`${oauth_base_url}/r/${sub}/${cat}`, {
        method: 'GET',
        headers,
      })
      if (resp.status != 200) {
        console.log(resp.status)
        return
      }
      let _data = await resp.json()
      if (_data != null) {
        return _data
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// export const getData = async (sub, cat) => {
//   let token = await getToken()
//   console.log(typeof token, token)
//   if (token) {
//     let headers = new Headers()
//     headers.set('User-agent', 'Google Chrome:YFV-xeK6dlQpOA:v1.0 (by /u/jiraiya404)')
//     headers.append('Content-Type', 'application/x-www-form-urlencoded')
//     headers.append('Authorization', `bearer ${token}`)

//     try {
//       let resp = await fetch(`https://oauth.reddit.co/r/${sub}${cat}.json`)
//       if (resp.status != 200) {
//         console.log(resp.status)
//         return
//       }
//       let _data = await resp.json()
//       if (_data != null) {
//         return _data
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

export async function get(url) {
  let resp = await fetch(url)
  if (resp.status != 200) {
    console.log(resp.status)
    return
  }
  let data = await resp.json()
  if (data != null) {
    return data
  }
}
