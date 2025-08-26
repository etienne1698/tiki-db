<script lang="ts" setup>
import { db } from "./data/database";

const users = await db.collections.users.findMany({});

console.error(users)

</script>

<template>
    <pre>{{users}}</pre>
</template>
