import { ref } from "vue";
import { defineStore } from "pinia";

export const useMembersStore = defineStore("members", () => {
  const members = ref(0);
  return { members };
});
