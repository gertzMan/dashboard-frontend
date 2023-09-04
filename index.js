window.onload = (function () {
  const register_submit = document.getElementById('registerForm')
  const login_submit = document.getElementById('loginForm')
  const logout_btn = document.getElementById('logout_btn')
  console.log(logout_btn)

  if (register_submit) {
    register_submit.addEventListener('submit', function (event) {
      event.preventDefault()
      const formData = new FormData(event.target)
      console.log(formData)

      fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          // if (data.success) {
          //   alert('register Successful!')
          // } else {
          //   alert('registers Failed!')
          // }
        })
        .catch(error => {
          console.error('Error:', error)
          alert('There was an error processing your request.')
        })
    })
  }

  if (login_submit) {
    login_submit.addEventListener('submit', function (event) {
      event.preventDefault()
      const formData = new FormData(event.target)
      console.log(formData)

      fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.status === 200) {
            const { access_token, user } = data
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('user_data', JSON.stringify(user))
            window.location.href = './dashboard.html'
          } else {
            alert('Wrong username or password ')
          }
        })
        .catch(error => {
          console.error('Error:', error)
          alert('There was an error processing your request.')
        })
    })
  }

  if (logout_btn) {
    console.log('found logout')
    logout_btn.addEventListener('click', e => {
      e.preventDefault()

      const access_token = localStorage.getItem('access_token')

      let formData = new FormData()
      formData.append('token', access_token)

      fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          localStorage.removeItem('access_token')
          window.location.href = './index.html'
        })
        .catch(error => {
          console.error('Error:', error)
          alert('There was an error processing your request.')
        })
    })
  }

  const messages_div = document.getElementById('messages-body')
  function fetchMessages() {
    fetch('http://localhost:8000/api/auth/messages', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        let results = `<div class="messages-info">
        <div class="summary">
          <i class="fa-regular fa-envelope"></i>
          <p>New messages</p>
        </div>
        <p>You have 22 new messages and 16 waiting in draft folder.</p>
      </div>`
        data.map(message => {
          results += `  
        <div class="message-card">
          <div class="message-title-container">
            <p class="message-title">${message.title}</p>
            <span class="time-since">1m ago</span>
          </div>
          <p class="message-body">
           ${message.body}
          </p>
          <p class="message-time">${new Date(message.created_at).toLocaleString(
            'en-US'
          )}</p>
        </div>`
        })

        console.log(results)
        messages_div.innerHTML = results
        console.log(data)
      })
      .catch(error => {
        console.error('Error:', error)
        alert('There was an error processing your request.')
      })
  }

  fetchMessages()
})()
