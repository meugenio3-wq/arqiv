import { createRouter, createWebHistory } from 'vue-router'

import Splash from '../components/Splash.vue'
import Landing from '../components/Landing.vue'
import Entry from '../components/Entry.vue'
import Login from '../components/Login.vue'
import Login_ from '../components/Login_.vue'
import Home from '../components/Home.vue'
import File from '../components/File.vue'
import Publish from '../components/Publish.vue'
import UserProfile from '../components/UserProfile.vue'

const routes = [
  { path: '/', name: 'Splash', component: Splash },
  { path: '/landing', name: 'Landing', component: Landing },
  { path: '/entry', name: 'Entry', component: Entry },
  { path: '/cadastrar', name: 'Login', component: Login },
  { path: '/login', name: 'Login_', component: Login_ },
  { path: '/home', name: 'Home', component: Home },
  { path: '/file/:id', name: 'file', component: File, props: true},
  { path: '/publish', name: 'Publish', component: Publish },
  { path: '/userprofile', name: 'UserProfile', component: UserProfile },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

