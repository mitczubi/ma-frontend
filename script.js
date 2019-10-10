const app = document.getElementById('root')
const logo = document.createElement('img')
logo.src = 'images/logo-final.png'

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(logo)
app.appendChild(container)
// Creating a request variable to be used for API access
let request = new XMLHttpRequest()

request.open('GET', 'https://api.mobilize.us/v1/events', true)

request.onload = function() {
  //Where the json data is accessed
  var data = JSON.parse(this.response)['data']

   for (i = 0; i < data.length; i++) {
     const card = document.createElement('div')
     card.setAttribute('class', 'card')

     const h1 = document.createElement('h1')
     h1.textContent = data[i].sponsor.name

     const p = document.createElement('p')
     p.textContent = data[i].description

     container.appendChild(card)

     card.appendChild(h1)
     card.appendChild(p)
     console.log(data[i])
   }

  // if (request.status >= 200 && request.status < 400) {
  //   data.forEach(item => {
  //     console.log(item.title)
  //   })
  // } else {
  //   console.log('error')
  // }
}

request.send()
