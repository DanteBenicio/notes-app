const modalContainer = document.querySelector('.modal_container'),
  addNote = document.querySelector('.add_note'),
  closeModal = document.querySelector('.close_modal'),
  container = document.querySelector('.container');

const form = document.forms.namedItem('create_note_form')

let notes = JSON.parse(localStorage.getItem('notes')) || []
let isUpdate = false
let noteIdForUpdate;

window.onload = renderNotes

function removeAllCards() {
  Array.from(container?.children).forEach(child => {
    if (child.className === 'card') {
      child.remove()
    }
  })
}

function getCreatedAt() {
  const hours = new Date().getHours()
  const minutes = new Date().getMinutes()

  const noteCreatedAt = `${new Intl.DateTimeFormat('en-US', { dateStyle: "long"}).format(new Date())} - ${hours}:${minutes}`

  return noteCreatedAt
}

function handleSubmit(e) {
  e.preventDefault();

  const { title_input, description_input } = form;

  if (isUpdate) {
    const updatedNote = {
      title: title_input.value,
      description: description_input.value,
      createdAt: getCreatedAt(),
    }

    const updatedNotes = notes.map(note => {
      if (note.id === noteIdForUpdate) {
        return { ...updatedNote, id: note.id }
      }

      return note
    })

    notes = updatedNotes

    removeAllCards()

    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    
    title_input.value = ''
    description_input.value = ''

    isUpdate = false

    renderNotes()
    closeModal?.click()
    
    return
  }
    
  const createdAt = getCreatedAt()

  if (title_input.value && description_input.value) {
    const noteData = {
      title: title_input.value,
      description: description_input.value,
      createdAt,
      id: notes.length + 1
    }

    notes.push(noteData)

    title_input.value = ''
    description_input.value = ''

    removeAllCards()

    localStorage.setItem('notes', JSON.stringify(notes))

    closeModal?.click();
      
    renderNotes()
  }
}

function deleteElement(noteId) {
  if (confirm('Are you make sure that you want to remove this note?')) {
    const updatedNotes = notes.filter(note => note.id !== noteId)

    notes = updatedNotes

    const noteElements = Array.from(container?.children)

    noteElements.forEach(note => {
      if (note.className === 'card') {
        note.remove()
      }
    })

    localStorage.setItem('notes', JSON.stringify(updatedNotes))

    renderNotes()
  }
}

function editElement(noteId) {
  addNote?.click()

  const { title_input, description_input } = form;

  const note = notes.find(note => note.id === noteId)

  noteIdForUpdate = noteId
  isUpdate = true

  title_input.value = note?.title;
  description_input.value = note?.description
}

function renderNotes() {
  notes?.forEach(note => {
    const card_note = `
      <div class="card">
        <div class="note_header">
          <h3>${note.title}</h3>
          <p>${note.description}</p>
        </div>
        <div class="note_footer">
          <span>${note.createdAt}</span>
          <div class="note_actions" onclick="showMenu(this)" onkeypress="showMenu(this)" tabindex="0">
            <img src="./src/assets/dots.svg" alt="three black dots">

            <div class="menu">
              <span tabindex="0" onclick="editElement(${note.id})" onkeypress="editElement(${note.id})">
                <img src="./src/assets/edit.svg" alt="pen icon">
                Edit
              </span>
              <span tabindex="0" onclick="deleteElement(${note.id})" onkeypress="deleteElement(${note.id})">
                <img src="./src/assets/delete.svg" alt="trash icon">
                Delete
              </span>
            </div>
          </div>
        </div>
      </div>
      `;

    container?.insertAdjacentHTML('beforeend', card_note)
  })
}

function showMenu(noteElement) {
  noteElement.classList.toggle('active')

  document.addEventListener('click', e => {
    const clickedElement = e.target

    if (clickedElement !== noteElement) {
      noteElement.classList.remove('active');
    }
  })
}

addNote?.addEventListener('click', () => {
  modalContainer?.classList.add('active')
})

addNote?.addEventListener('keypress', () => {
  modalContainer?.classList.add('active')
})

closeModal?.addEventListener('click', () => {
  const { title_input, description_input } = form;

  modalContainer?.classList.remove('active')

  title_input.value = ''
  description_input.value = ''
})

form?.addEventListener('submit', handleSubmit)