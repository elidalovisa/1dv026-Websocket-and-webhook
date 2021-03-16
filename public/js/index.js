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
    console.log(tr)
    const issueList = document.querySelector('#issue-list')

    issueList.appendChild(tr)
    console.log(issueList)
  })

  // Listen for message "reopen" from the server
  socket.on('reopen', arg => {
    const openString = hbsTemplate(arg)
    const td = document.createElement('td')
    td.innerHTML = openString

    const formControl = document.querySelector('.form-control')
    formControl.innerHTML = openString.appendChild()
  })
}
