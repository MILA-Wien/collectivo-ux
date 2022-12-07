import { ref } from "vue";

const title = ref("")

export function useTitle() {
  return {
    title
  };
}
