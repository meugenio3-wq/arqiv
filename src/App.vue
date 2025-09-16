<template>
  <!-- Força recriação do componente sempre que o id mudar -->
  <router-view :key="$route.params.id"></router-view>
</template>
