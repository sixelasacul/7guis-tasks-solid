import { createMemo, createSignal } from 'solid-js'
import { For } from 'solid-js/web'

interface User {
  name: string
  surname: string
}

export function CRUD() {
  const [usersList, setUsersList] = createSignal<User[]>([])
  const [name, setName] = createSignal('')
  const [surname, setSurname] = createSignal('')
  const [filter, setFilter] = createSignal('')
  const [selectedUser, setSelectedUser] = createSignal(-1)

  const filteredUsersList = createMemo(() =>
    usersList().filter(({ surname }) =>
      surname.toLocaleLowerCase().startsWith(filter().toLocaleLowerCase())
    )
  )

  function createUser() {
    setUsersList((prev) => prev.concat({ name: name(), surname: surname() }))
  }
  function updateUser() {
    // SolidJS allows to rely on the array indices for data manipulation
    setUsersList((prev) =>
      prev.map((user, i) =>
        i === selectedUser()
          ? {
              name: name(),
              surname: surname()
            }
          : user
      )
    )
  }
  function deleteUser() {
    setUsersList((prev) => prev.filter((_, i) => i !== selectedUser()))
  }

  return (
    <div>
      <select
        size={5}
        onChange={(e) => setSelectedUser(Number(e.target.value))}>
        <For each={filteredUsersList()}>
          {({ name, surname }, index) => (
            <option value={index()}>
              {surname}, {name}
            </option>
          )}
        </For>
      </select>
      <label>
        Filter prefix:{' '}
        <input value={filter()} onInput={(e) => setFilter(e.target.value)} />
      </label>
      <label>
        Name: <input value={name()} onInput={(e) => setName(e.target.value)} />
      </label>
      <label>
        Surname:{' '}
        <input value={surname()} onInput={(e) => setSurname(e.target.value)} />
      </label>
      <button onClick={createUser}>Create</button>
      <button onClick={updateUser}>Update</button>
      <button onClick={deleteUser}>Delete</button>
    </div>
  )
}
