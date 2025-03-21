<template>
  <div></div>
</template>

<script setup lang="ts">
class User extends Model {
  name!: string;
}
const repo = useRepo(User);
repo.save({
  qsdqs: "",
});
</script>
