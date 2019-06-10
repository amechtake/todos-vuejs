import Vuex from "vuex"

const state = {
  todos: []
}

const getters = {
  todos: state => state.todos,
  completedTodos: state => state.todos.filter(todo => todo.completed),
  remainingTodos: state => state.todos.filter(todo => !todo.completed),
  remainingTodosCount: state => getters.remainingTodos(state).length,
  completedTodosCount: state => getters.completedTodos(state).length
}

const mutations = {
  ADD_TODO(state, name) {
    let id = state.todos.length + 1
    state.todos.push({
      id: id,
      name: name,
      completed: false
    })
  },
  DELETE_TODO(state, todo) {
    state.todos = state.todos.filter(i => i !== todo)
  },
  EDIT_TODO(state, todo) {
    if (todo) {
      state.todos.forEach(element => {
        if (element.id == todo.id) {
          element.name = todo.name
        }
      })
    }
  },
  SET_COMPLETED(state, todo) {
    if (todo) {
      state.todos.forEach(element => {
        if (element.id == todo.id) {
          element.completed = todo.completed
        }
      })
    }
  }
}

const actions = {
  addTodo(store, name) {
    store.commit("ADD_TODO", name)
  },
  deleteTodo(store, todo) {
    store.commit("DELETE_TODO", todo)
  },
  editTodo(store, todo) {
    store.commit("EDIT_TODO", todo)
  },
  editTodoCompleted(store, todo) {
    store.commit("SET_COMPLETED", todo)
  }
}

let sotre = new Vuex.Store({
  state: state,
  mutations: mutations,
  getters: getters,
  actions: actions,
  strict: true
})

global.store = sotre
export default store
