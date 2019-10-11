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

  if (request.status >= 200 && request.status < 400) {
    for (i = 0; i < data.length; i++) {
      const card = document.createElement('div')
      card.setAttribute('class', 'card')
      container.appendChild(card)

      let url = data[i].browser_url
      card.setAttribute('href', url)

      const inner_card_container = document.createElement('div')
      inner_card_container.setAttribute('class', 'innerContainer')


      const h1 = document.createElement('h1')
      h1.textContent = data[i].title

      const h2 = document.createElement('h2')
      h2.textContent = data[i].sponsor.name

      const p = document.createElement('p')
      if (data[i].description.length < 300) {
        p.textContent = data[i].description
      } else {
        // if the desc is too long we make it shorter
        p.textContent = `${data[i].description.substring(0, 300)}...`
      }


      let start_date_utc = data[i]['timeslots'][0]['start_date']
      let start_date = new Date(start_date_utc)
      start_date.toLocaleDateString()
      // start_date.setUTCSeconds(start_date_utc)
      // start_date.toLocaleDateString()

      let time_table = document.createElement('table')
      time_table.setAttribute('id', 'timeTable')

      let time_tr = document.createElement('tr')
      time_tr.setAttribute('id', 'tableRow')

      let time_td = document.createElement('td')
      let start = document.createTextNode(`${start_date}`)

      time_table.appendChild(time_tr)
      time_tr.appendChild(time_td)
      time_td.appendChild(start)

      card.appendChild(h1)
      card.appendChild(inner_card_container)
      inner_card_container.appendChild(h2)
      inner_card_container.appendChild(p)
      inner_card_container.appendChild(time_table);
    }
  } else {
   const errorMessage = document.createElement('marquee')
   errorMessage.textContent = "Message not found!"
   app.appendChild(errorMessage)
  }

  const cards = document.querySelectorAll('.card')
  cards.forEach(function(e) {
    e.addEventListener('click', function() {
      window.location = e.getAttribute('href')
    })
  })
}

request.send()
