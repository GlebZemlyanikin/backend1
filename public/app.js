document.addEventListener('click', (event) => {
    if (event.target.dataset.type === 'delete') {
        const id = event.target.dataset.id;

        deleteNote(id).then(() => {
            event.target.closest('li').remove();
        });
    }

    if (event.target.dataset.type === 'update') {
        const id = event.target.dataset.id;
        const li = event.target.closest('li');
        const titleSpan = li.querySelector('span');
        const current = titleSpan.textContent.trim();
        const next = prompt('Новый заголовок', current);
        if (!next || next === current) return;

        updateNote(id, next).then(() => {
            titleSpan.textContent = next;
        });
    }
});

async function deleteNote(id) {
    await fetch(`/${id}`, {
        method: 'DELETE',
    });
}

async function updateNote(id, title) {
    await fetch(`/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
}
