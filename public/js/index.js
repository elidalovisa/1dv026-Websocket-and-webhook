import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')
console.log(issueTemplate)

// If taskTemplate is not present on the page, just ignore and do not listen for issues
if (issueTemplate) {
  // Create a Handlebars template from the template-tag (rendered from index.hbs)
  const hbsTemplate = window.Handlebars.compile(issueTemplate.innerHTML)

  // Create a socket connection using Socket.io
  const socket = window.io()

  // Listen for message "new issue" from the server
  socket.on('issue', arg => {
    console.log(arg)
    const issueString = hbsTemplate(arg)
    const tr = document.createElement('tr')
    tr.innerHTML = issueString
    const issueList = document.querySelector('#issue-list')
    issueList.appendChild(tr)
  })

  // Listen for message "updated" from the server
  socket.on('updated', arg => {
    const descriptionTitle = document.querySelector('#description-title')
    const description = document.querySelector('#description')
    description.innerHTML = arg.description
    descriptionTitle.innerHTML = arg.title
  })

  // Listen for message "closed" from the server
  socket.on('closed', arg => {
    const state = document.querySelector('#state')
    const close = document.querySelector('#close')
    state.textContent = 'closed'
    close.textContent = 'Open Issue'
  })

  // Listen for message "open" from the server
  socket.on('open', arg => {
    const state = document.querySelector('#state')
    const open = document.querySelector('#open')
    state.textContent = 'open'
    open.textContent = 'Close Issue'
  })
}
