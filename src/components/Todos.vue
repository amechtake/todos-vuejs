<template>
  <section class="todoapp">
    <header class="header">
      <h1>Todos</h1>
      <input
        type="text"
        class="new-todo"
        placeholder="Add new task"
        v-model="newTodo"
        @keyup.enter="saveTodo"
      >
    </header>
    <div class="main">
      <input id="toggle-all" type="checkbox" class="toggle-all" v-model="allDone">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          class="todo"
          v-for="(item, key) in filtered"
          v-bind:key="key"
          :class="{'completed' : item.completed, 'editing' : editing && item.id == editing.id}"
        >
          <div class="view">
            <input type="checkbox" class="toggle" v-model="item.completed">
            <label @dblclick.prevent="edit(item)">{{item.name}}</label>
            <button class="destroy" @click="remove(item)"></button>
          </div>
          <input
            type="text"
            v-model="editing.name"
            class="edit"
            @keyup.enter="doneEdit(editing)"
            @keyup.escape.prevent="cancelEdit(editing)"
            @blur="doneEdit(editing)"
            v-focus="item == editing"
            v-if="editing"
          >
        </li>
      </ul>
    </div>
    <footer class="footer" v-show="todos.length > 0">
      <span class="todo-count">
        <strong>{{remainingTodosCount}}</strong> item left
      </span>
      <ul class="filters">
        <li>
          <a href="#" :class="{selected : filter == 'all'}" @click.prevent="filter = 'all'">All</a>
        </li>
        <li>
          <a href="#" :class="{selected : filter == 'todo'}" @click.prevent="filter = 'todo'">Active</a>
        </li>
        <li>
          <a
            href="#"
            :class="{selected : filter == 'done'}"
            @click.prevent="filter = 'done'"
          >Completed</a>
        </li>
      </ul>
      <button v-show="doneTodo" class="clear-completed" @click="clearCompleted">Clear all</button>
    </footer>
  </section>
</template>
<script>
import Vue from "vue";
import store from "./TodoStore.js";
import Vuex from "vuex";

export default {
  name: "Todos",
  store: store,
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      newTodo: "",
      filter: "all",
      all_done: false,
      editing: {},
      oldTodoEditing: null
    };
  },
  watch: {
    value(newVal) {
      this.todos = newVal;
    }
  },
  methods: {
    ...Vuex.mapActions({
      addTodoStore: "addTodo",
      remove: "deleteTodo",
      editTodo: "editTodo"
    }),
    saveTodo() {
      if (this.newTodo) {
        this.addTodoStore(this.newTodo);
        this.newTodo = "";
      }
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed);
      this.$emit("input", this.todos);
    },
    edit(todo) {
      if (!todo.completed) {
        this.editing = JSON.parse(JSON.stringify(todo));
        this.oldTodoEditing = todo.name;
      }
    },
    doneEdit(item) {
      this.editTodo(item);
      this.editing = null;
      this.oldTodoEditing = null;
    },
    cancelEdit(item) {
      item.name = this.oldTodoEditing;
      this.doneEdit(item);
    }
  },
  computed: {
    ...Vuex.mapGetters([
      "todos",
      "remainingTodosCount",
      "completedTodosCount",
      "completedTodos",
      "remainingTodos"
    ]),
    todos() {
      return store.state.todos;
    },
    allDone: {
      get() {
        return this.remainingTodosCount === 0;
      },
      set(value) {
        this.todos.forEach(todo => {
          todo.completed = value;
        });
      }
    },
    filtered() {
      if (this.filter === "todo") {
        return this.remainingTodos;
      } else if (this.filter === "done") {
        return this.completedTodos;
      } else {
        return this.todos;
      }
    },
    doneTodo() {
      return this.completedTodos !== undefined
        ? this.completedTodos.length > 0
        : false;
    }
  },
  directives: {
    focus(el, value) {
      if (value) {
        Vue.nextTick(_ => {
          el.focus();
        });
      }
    }
  }
};
</script>
