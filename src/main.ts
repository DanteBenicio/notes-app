const modalContainer = document.querySelector('.modal_container'),
  addNote = document.querySelector('.add_note'),
  closeModal = document.querySelector('.close_modal'),
  container = document.querySelector('.container');

const form = document.forms.namedItem('create_note_form')
interface Notes {
  title: string
  description: string
  createdAt: string
  id: number
}

let notes: Notes[] = JSON.parse(localStorage.getItem('notes')!) || []

function removeAllCards() {
  Array.from(container?.children!).forEach(child => {
    if (child.className === 'card') {
      child.remove()
    }
  })
}

function handleSubmit(e: SubmitEvent | null, updateNote: Notes | null) {
  if (updateNote) {
    const { title_input, description_input } = form!;
    const { title, description, createdAt, id: noteId } = updateNote

    const btnForm = form?.querySelector('button[type="submit"]')
    
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { title, description, createdAt, id: note.id } 
      }

      return note
    })

    notes = updatedNotes

    removeAllCards()

    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    
    title_input.value = ''
    description_input.value = ''

    renderNotes()
    closeModal?.click()
    
    btnForm?.setAttribute('type', 'submit')
      
  } else {
    e?.preventDefault();

    const createdAt = new Intl.DateTimeFormat('en-US', { dateStyle: "medium" }).format(new Date())

    const { title_input, description_input } = form!;

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
}

function deleteElement(noteId: number) {
  if (confirm('Are you make sure that you want to remove this note?')) {
    const updatedNotes = notes.filter(note => note.id !== noteId)

    notes = updatedNotes

    const cards = Array.from(container?.children!)

    cards.forEach(card => {
      if (card.className === 'card') {
        card.remove()
      }
    })

    localStorage.setItem('notes', JSON.stringify(updatedNotes))

    renderNotes()
  }
}

function editElement(noteId: number) {
  addNote?.click()

  const { title_input, description_input } = form!;

  const note = notes.find(note => note.id === noteId)
  const btnForm = form?.querySelector('button[type="submit"]')

  btnForm?.setAttribute('type', 'button')

  title_input.value = note?.title;
  description_input.value = note?.description

  btnForm?.addEventListener('click', () => handleSubmit(null, {
    title: title_input.value,
    description: description_input.value,
    createdAt: note?.createdAt!,
    id: noteId
  }))
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
          <div class="note_actions" onclick="showMenu(this)">
            <img src="./src/assets/dots.svg" alt="three black dots">

            <div class="menu">
              <span onclick="editElement(${note.id})">
                <img src="./src/assets/edit.svg" alt="pen icon">
                Edit
              </span>
              <span onclick="deleteElement(${note.id})">
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

renderNotes()

function showMenu(noteElement: HTMLDivElement) {
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

closeModal?.addEventListener('click', () => {
  const { title_input, description_input } = form!;

  modalContainer?.classList.remove('active')

  title_input.value = ''
  description_input.value = ''
})

form?.addEventListener('submit', (e) => handleSubmit(e, null))